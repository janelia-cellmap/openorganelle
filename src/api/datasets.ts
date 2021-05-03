import {
  urlSafeStringify,
  encodeFragment,
  CoordinateSpaceTransform,
  CoordinateSpace,
  ViewerState,
  ImageLayer,
  LayerDataSource,
  SegmentationLayer,
  ManagedLayer,
  Layer,
  SingleMeshLayer,
} from "@janelia-cosem/neuroglancer-url-tools";
import { s3ls, getObjectFromJSON, bucketNameToURL, s3URItoURL } from "./datasources";
import * as Path from "path";

import {DatasetDescription} from "./dataset_description";
import {isUri} from "valid-url";
import { LocalConvenienceStoreOutlined } from "@material-ui/icons";

const IMAGE_DTYPES = ['int8', 'uint8', 'uint16'];
const SEGMENTATION_DTYPES = ['uint64'];
export type DataFormats = "n5" | "zarr" | "precomputed" | "neuroglancer_legacy_mesh"
export type LayerTypes = 'image' | 'segmentation' | 'annotation' | 'mesh';
export type VolumeStores = "n5" | "precomputed" | "zarr";
export type ContentType = "em" | "segmentation" | "prediction" | "analysis";

interface ContrastLimits {
  start?: number
  end?: number
  min: number
  max: number
}

interface DisplaySettings {
  contrastLimits: ContrastLimits;
  invertLUT: boolean;
  color: string;
  defaultLayerType: LayerTypes
}

interface DatasetIndex {
  name: string;
  volumes: Volume[];
  views: DatasetView[]
}

interface DataSource {
  name: string
  path: string  
  format: DataFormats
  transform: SpatialTransform
  description: string
  version: string
  tags: string[]
}

interface MeshSource extends DataSource {
  ids?: number[]
}

interface VolumeSource extends DataSource{
  dataType: string
  contentType: ContentType
  displaySettings: DisplaySettings
  subsources: MeshSource[]
}

interface SpatialTransform {
  axes: string[];
  units: string[];
  translate: number[];
  scale: number[];
}

interface IDatasetView{
  name: string
  description: string
  position: number[] | undefined
  scale: number | undefined
  orientation: number[] | undefined 
  volumeNames: string[]
}

interface IDataset{
  name: string
  space: CoordinateSpace
  volumes: Map<string, Volume>
  description: DatasetDescription | undefined
  thumbnailURL: string
  views: DatasetView[]
}

export class DatasetView implements IDatasetView {
  constructor(
  public name: string,
  public description: string,
  public volumeNames: string[],
  public orientation: number[] | undefined,
  public position: number[] | undefined,
  public scale: number | undefined){
      this.name = name;
      this.description = description;
      this.position = position;
      this.scale = scale;
      this.volumeNames = volumeNames;
      this.orientation = orientation;
  }
}

export interface ContentTypeMetadata {
  label: string
  description: string
} 

// one nanometer, expressed as a scaled meter
const nm: [number, string] = [1e-9, "m"];

// this specifies the basis vectors of the coordinate space neuroglancer will use for displaying all the data
const outputDimensions: CoordinateSpace = { x: nm, y: nm, z: nm };

export const contentTypeDescriptions = new Map<string, ContentTypeMetadata>();
contentTypeDescriptions.set('em', {label: "EM Layers", description: "Raw FIB-SEM data."});
contentTypeDescriptions.set('lm', {label: "LM Layers", description: "Light microscopy data."});
contentTypeDescriptions.set('segmentation', {label: "Segmentation Layers", description: "Predictions that have undergone refinements such as thresholding, smoothing, size filtering, and connected component analysis."});
contentTypeDescriptions.set('prediction', {label: "Prediction Layers", description: "Raw distance transform inferences scaled from 0 to 255. A voxel value of 127 represent a predicted distance of 0 nm."});
contentTypeDescriptions.set('analysis', {label: "Analysis Layers", description: "Results of applying various analysis routines on raw data, predictions, or segmentations."});

function makeShader(shaderArgs: DisplaySettings, contentType: ContentType, dataType: string): string | undefined{
  let lower = 0;
  let upper = 0;
  let cmin = 0;
  let cmax = 0;
    switch (contentType) {
    case 'em':{
      if (dataType === 'uint8') {lower = 0; upper = 255}
      else if (dataType === 'uint16') {lower = 0; upper = 65535}
      let cmin = shaderArgs.contrastLimits.min * (upper - lower);
      let cmax = shaderArgs.contrastLimits.max * (upper - lower);
        return `#uicontrol invlerp normalized(range=[${cmin}, ${cmax}], window=[${Math.max(0, cmin - 2 * (cmax-cmin))}, ${Math.min(upper, cmax + 2 * (cmax - cmin))}])
        #uicontrol int invertColormap slider(min=0, max=1, step=1, default=${shaderArgs.invertLUT? 1: 0})
        #uicontrol vec3 color color(default="${shaderArgs.color}")
        float inverter(float val, int invert) {return 0.5 + ((2.0 * (-float(invert) + 0.5)) * (val - 0.5));}
          void main() {
          emitRGB(color * inverter(normalized(), invertColormap));
        }`
      }
    case "segmentation":
      return `#uicontrol invlerp normalized(range=[${cmin}, ${cmax}], window=[${cmin}, ${cmax}])\n#uicontrol vec3 color color(default="${shaderArgs.color}")\nvoid main() {emitRGB(color * normalized());}`;
      default:
        return undefined;
              }
}

// A single n-dimensional array
// this constructor syntax can be shortened but I forget how
export class Volume implements VolumeSource {
    constructor(
        public path: string,
        public name: string,
        public dataType: string,
        public transform: SpatialTransform,
        public contentType: ContentType,
        public format: VolumeStores,
        public displaySettings: DisplaySettings,
        public description: string,
        public version: string,
        public tags: string[],
        public subsources: MeshSource[]
    ) {
        this.path = path;
        this.name = name;
        this.dataType = dataType;
        this.transform = transform;
        this.contentType = contentType;
        this.format = format;
        this.displaySettings = displaySettings;
        this.description = description;
        this.version = version;
        this.tags = tags;
        this.subsources = subsources;
     }

    // todo: remove handling of spatial metadata, or at least don't pass it on to the neuroglancer
    // viewer state construction

    

    toLayer(layerType: LayerTypes): Layer | undefined {
        const srcURL = `${this.format}://${this.path}`;
        const subsrcURLs = this.subsources.map(v => `precomputed://${v.path}`);
         const inputDimensions: CoordinateSpace = {
            x: [1e-9 * this.transform.scale[this.transform.axes.indexOf('x')], "m"],
            y: [1e-9 * this.transform.scale[this.transform.axes.indexOf('y')], "m"],
            z: [1e-9 * this.transform.scale[this.transform.axes.indexOf('z')], "m"]
        };
        const layerTransform: CoordinateSpaceTransform = {matrix:
            [
                [1, 0, 0, this.transform.translate[this.transform.axes.indexOf('x')]],
                [0, 1, 0, this.transform.translate[this.transform.axes.indexOf('y')]],
                [0, 0, 1, this.transform.translate[this.transform.axes.indexOf('z')]]
            ],
            outputDimensions: outputDimensions,
            inputDimensions: inputDimensions}

        // need to update the layerdatasource object to have a transform property
        const source: LayerDataSource = {url: srcURL,
                                         CoordinateSpaceTransform: layerTransform};

        let layer: Layer | undefined = undefined;

        if (layerType === 'image'){
          let shader: string | undefined = '';
          if (SEGMENTATION_DTYPES.includes(this.dataType)){
              shader = makeShader(this.displaySettings, 'segmentation', this.dataType);
          }
          else if (IMAGE_DTYPES.includes(this.dataType)) {
              shader = makeShader(this.displaySettings, 'em', this.dataType);
          }
          else {shader = undefined}
          layer = new ImageLayer('rendering',
                                undefined,
                                undefined,
                                this.name,
                                source,
                                0.75,
                                'additive',
                                shader,
                                undefined,
                                undefined);
        }
        else if (layerType === 'segmentation') {
          if (subsrcURLs !== undefined) {
            const subsource: LayerDataSource = {url: subsrcURLs[0], CoordinateSpaceTransform: layerTransform};
            //let mesh = new SingleMeshLayer(undefined, undefined, undefined, subsource, '' )
            layer = new SegmentationLayer('source', true, undefined, this.name, [source, subsource], this.subsources[0].ids);
          }
          else {
            layer = new SegmentationLayer('source', true, undefined, this.name, source);
          }
        }
        return layer
    }
}

// a collection of volumes, i.e. a collection of ndimensional arrays
export class Dataset implements IDataset {
    public name: string;
    public space: CoordinateSpace;
    public volumes: Map<string, Volume>;
    public description: DatasetDescription | undefined
    public thumbnailURL: string
    public views: DatasetView[]
    constructor(key: string, space: CoordinateSpace, volumes: Map<string, Volume>, description: DatasetDescription,
    thumbnailPath: string, views: DatasetView[]) {
        this.name = key;
        this.space = space;
        this.volumes = volumes;
        this.description = description;
        this.thumbnailURL = thumbnailPath;
        this.views = views;
    }

    makeNeuroglancerViewerState(layers: SegmentationLayer[] | ImageLayer[], 
                                 viewerPosition: number[] | undefined, 
                                 crossSectionScale: number | undefined,
                                 ){
        // hack to post-hoc adjust alpha if there is only 1 layer selected
        if (layers.length  === 1 && layers[0] instanceof ImageLayer) {layers[0].opacity = 1.0}
        const projectionOrientation = undefined;
        const crossSectionOrientation = undefined;
        crossSectionScale = crossSectionScale? crossSectionScale : 50;
        const projectionScale = 65536;
        // the first layer is the selected layer; consider making this a kwarg
        const selectedLayer = {'layer': layers[0]!.name, 'visible': true};

        const vState = new ViewerState(
            outputDimensions,
            viewerPosition,
            layers as Layer[],
            '4panel',
            undefined,
            crossSectionScale,
            undefined,
            crossSectionOrientation,
            projectionScale,
            undefined,
            projectionOrientation,
            true,
            true,
            true,
            undefined,
            undefined,
            undefined,
            undefined,
            'black',
            'black',
            selectedLayer,
            undefined
        );
        return encodeFragment(urlSafeStringify(vState));
    }
  }
  
async function getDatasetKeys(bucket: string): Promise<string[]> {
    // get all the folders in the bucket
    let datasetKeys = (await s3ls(bucket, '', '/', '', false)).folders;
    //remove trailing "/" character
    datasetKeys = datasetKeys.map((k) => k.replace(/\/$/, ""));
    return datasetKeys
}

async function getDatasetIndex(
  URL: string,
  dataset: string
): Promise<DatasetIndex> {
  const indexFile = `${URL}/${dataset}/index.json`;
  return getObjectFromJSON(indexFile);
}

async function getDescription(
  bucket: string,
  key: string
): Promise<DatasetDescription> {
  const bucketURL = bucketNameToURL(bucket);
  const descriptionURL = `${bucketURL}/${key}/README.json`;
  return getObjectFromJSON(descriptionURL);
}

// This function will disappear when the dataset metadata starts providing full URLs
function reifyPath(outerPath: string, innerPath: string): string {
  // Check if the innerPath is already a URL; if so, return it:
  if (isUri(innerPath)) {
    return s3URItoURL(innerPath);
}
  else {
    const absPath = new URL(outerPath);
    absPath.pathname = Path.resolve(absPath.pathname, innerPath);
    console.log(absPath.toString())
    return absPath.toString()
  }

}

function makeVolume(outerPath: string, volumeMeta: Volume): Volume {
  volumeMeta.path = reifyPath(outerPath, volumeMeta.path);
  // this is a shim until we add a defaultLayerType field to the volume metadata
  let ds = volumeMeta.displaySettings;
  if (volumeMeta.dataType === 'uint64' && (volumeMeta.name.indexOf('_seg') === -1)) {ds.defaultLayerType = 'segmentation'}
  else (ds.defaultLayerType = 'image')
  volumeMeta.displaySettings = ds;

  for (let subsource of volumeMeta.subsources) {subsource.path = reifyPath(outerPath, subsource.path)}

  return new Volume(volumeMeta.path,
                    volumeMeta.name,
                    volumeMeta.dataType,
                    volumeMeta.transform,
                    volumeMeta.contentType,
                    volumeMeta.format,
                    volumeMeta.displaySettings,
                    volumeMeta.description,
                    volumeMeta.version,
                    volumeMeta.tags,
                    volumeMeta.subsources)
}

export async function makeDatasets(bucket: string): Promise<Map<string, Dataset>> {
  // get the keys to the datasets
  const datasetKeys: string[] = await getDatasetKeys(bucket);
  // Get a list of volume metadata specifications, represented instances
  // of Map<string, VolumeMeta>
  const datasets: Map<string, Dataset> = new Map();
  //const metadataURL = bucketNameToURL(bucket);
  const metadataURL = "https://raw.githubusercontent.com/janelia-cosem/fibsem-metadata/master/metadata/datasets/";
  let ds = await Promise.all(
    datasetKeys.map(async key => {
      const outerPath: string = `${bucketNameToURL(bucket)}/${key}`;
      const description = await getDescription(bucket, key);
      const thumbnailURL: string =  `${outerPath}/thumbnail.jpg`
      const index = await getDatasetIndex(metadataURL, key);
      
      if (index !== undefined){
        try {
          const views: DatasetView[] = [];
          // make sure that the default view is at the beginning of the list
          for (let v of index.views) {
            let vObj = new DatasetView(v.name, v.description, v.volumeNames, v.position, undefined, v.scale);
            if (vObj.name === 'Default View'){
              views.unshift(vObj)
            }
            else views.push(vObj)
          }
          const volumes: Map<string, Volume> = new Map();
          index.volumes.forEach(v => volumes.set(v.name, makeVolume(outerPath, v)));
          if (views.length === 0){
            let defaultView = new DatasetView('Default view', '', Array.from(volumes.keys()), undefined, undefined, undefined);
            views.push(defaultView)
          }
          datasets.set(key, new Dataset(key, outputDimensions, volumes, description, thumbnailURL, views));
        }
        catch (error) {
          console.log(error)
        }
      }
      else {
        console.log(`Could not load index.json from ${outerPath}`)
      }
    })
  );
  return datasets;
}
