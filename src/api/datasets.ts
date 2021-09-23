import {
  urlSafeStringify,
  encodeFragment,
  CoordinateSpaceTransform,
  CoordinateSpace,
  ViewerState,
  ImageLayer,
  LayerDataSource,
  SegmentationLayer,
  Layer
} from "@janelia-cosem/neuroglancer-url-tools";
import { s3ls, bucketNameToURL, s3URItoURL } from "./datasources";
import * as Path from "path";
import { AppContext } from "../context/AppContext";
import {DatasetMetadata, GithubDatasetMetadataSource} from "./dataset_metadata";
import {isUri} from "valid-url";
import { useContext } from "react";

const IMAGE_DTYPES = ['int8', 'uint8', 'uint16'];
const SEGMENTATION_DTYPES = ['uint64'];
const metadataEndpoint = 'https://github.com/janelia-cosem/fibsem-metadata/blob/hela-2-migration/metadata/datasets/';
export type DataFormats = "n5" | "zarr" | "precomputed" | "neuroglancer_legacy_mesh"
export type LayerTypes = 'image' | 'segmentation' | 'annotation' | 'mesh';
export type VolumeStores = "n5" | "precomputed" | "zarr";
export type ContentType = "em" | "segmentation" | "prediction" | "analysis";

interface ContrastLimits {
  start: number
  end: number
  min: number
  max: number
}

interface DisplaySettings {
  contrastLimits: ContrastLimits;
  invertLUT: boolean;
  color: string;
  defaultLayerType: LayerTypes
}

export interface DatasetIndex {
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
  description: DatasetMetadata
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


function SpatialTransformToNeuroglancer(transform: SpatialTransform, outputDimensions: CoordinateSpace): CoordinateSpaceTransform {

  const inputDimensions: CoordinateSpace = {
    x: [1e-9 * Math.abs(transform.scale[transform.axes.indexOf('x')]), "m"],
    y: [1e-9 * Math.abs(transform.scale[transform.axes.indexOf('y')]), "m"],
    z: [1e-9 * Math.abs(transform.scale[transform.axes.indexOf('z')]), "m"]
};

const layerTransform: CoordinateSpaceTransform = {matrix:
    [
        [(transform.scale[transform.axes.indexOf('x')] < 0)? -1 : 1, 0, 0, transform.translate[transform.axes.indexOf('x')]],
        [0, (transform.scale[transform.axes.indexOf('y')] < 0)? -1 : 1, 0, transform.translate[transform.axes.indexOf('y')]],
        [0, 0, (transform.scale[transform.axes.indexOf('z')] < 0)? -1 : 1, transform.translate[transform.axes.indexOf('z')]]
    ],
    outputDimensions: outputDimensions,
    inputDimensions: inputDimensions}
  return layerTransform
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

export function inferLayerType(volumeName: string): string
{
  let result = 'segmentation';
  if ((volumeName.indexOf('em-') > 0) || (volumeName.indexOf('_pred') > 0) || (volumeName.indexOf('_sim') > 0) || (volumeName.indexOf('_palm') > 0)) {
    result='image';
  }
  return result
}

function makeShader(shaderArgs: DisplaySettings, contentType: ContentType, dataType: string): string | undefined{
  switch (contentType) {
    case 'em':{
      let lower = 0;
      let upper = 0;
      if (dataType === 'uint8') {lower = 0; upper = 255}
      else if (dataType === 'uint16') {lower = 0; upper = 65535}
      const interval = upper - lower;
      let cmin = shaderArgs.contrastLimits.start * interval;
      let cmax = shaderArgs.contrastLimits.end * interval;
        return `#uicontrol invlerp normalized(range=[${cmin}, ${cmax}], window=[${Math.max(0, cmin - 2 * (cmax-cmin))}, ${Math.min(upper, cmax + 2 * (cmax - cmin))}])
        #uicontrol int invertColormap slider(min=0, max=1, step=1, default=${shaderArgs.invertLUT? 1: 0})
        #uicontrol vec3 color color(default="${shaderArgs.color}")
        float inverter(float val, int invert) {return 0.5 + ((2.0 * (-float(invert) + 0.5)) * (val - 0.5));}
          void main() {
          emitRGB(color * inverter(normalized(), invertColormap));
        }`
      }
    case "segmentation":
      return '';
    default:
      return undefined;
  }
}

interface LayerDataSource2 extends LayerDataSource {
  transform: any
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

        // need to update the layerdatasource object to have a transform property
        const source: LayerDataSource2 = {url: srcURL,
                                         transform: SpatialTransformToNeuroglancer(this.transform, outputDimensions),
                                        CoordinateSpaceTransform: SpatialTransformToNeuroglancer(this.transform, outputDimensions)};

        const subsources = this.subsources.map(subsource => {
          return {url: `precomputed://${subsource.path}`, transform: SpatialTransformToNeuroglancer(subsource.transform, outputDimensions), CoordinateSpaceTransform: SpatialTransformToNeuroglancer(subsource.transform, outputDimensions)}
        });
        let layer: Layer | undefined = undefined;
        // dvb: this is a hack until this gets fixed in metadata
        const color = this.name === 'gt' ? undefined: this.displaySettings.color;
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
          if (subsources.length > 0) {
            layer = new SegmentationLayer('source',
                                          true,
                                          undefined,
                                          this.name,
                                          [source, ...subsources],
                                          this.subsources[0].ids,
                                          undefined,
                                          true,
                                          undefined,
                                          undefined,
                                          undefined,
                                          undefined,
                                          undefined,
                                          undefined,
                                          undefined,
                                          color);
          }
          else {
            layer = new SegmentationLayer('source',
                                          true,
                                          undefined,
                                          this.name,
                                          source,
                                          undefined,
                                          undefined,
                                          true,
                                          undefined,
                                          undefined,
                                          undefined,
                                          undefined,
                                          undefined,
                                          undefined,
                                          undefined,
                                          color);
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
    public description: DatasetMetadata
    public thumbnailURL: string
    public views: DatasetView[]
    constructor(key: string, space: CoordinateSpace, volumes: Map<string, Volume>, description: DatasetMetadata,
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
                                 crossSectionOrientation: number[] | undefined
                                 ){
        // hack to post-hoc adjust alpha if there is only 1 layer selected
        if (layers.length  === 1 && layers[0] instanceof ImageLayer) {layers[0].opacity = 1.0}
        const projectionOrientation = crossSectionOrientation;
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
  ds.defaultLayerType = inferLayerType(volumeMeta.name) as LayerTypes;
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

  const metadataSources: Map<string, GithubDatasetMetadataSource> = new Map();
  for (let key of datasetKeys) {
    const url = new URL(metadataEndpoint);
    url.pathname += key
    metadataSources.set(key, new GithubDatasetMetadataSource(url.toString()))
  }

  await Promise.all(
    datasetKeys.map(async key => {
      const outerPath: string = `${bucketNameToURL(bucket)}/${key}`;
      const metadataSource = metadataSources.get(key)!;
      const description = await metadataSource.GetMetadata();
      const thumbnailURL = await metadataSource.GetThumbnailURL();
      const index = await metadataSource.GetIndex();
      
      if (index !== undefined && description !== undefined){
        try {
          const views: DatasetView[] = [];
          // make sure that the default view is at the beginning of the list
          for (let v of index.views) {
            let vObj = new DatasetView(v.name, v.description, v.volumeNames, v.orientation, v.position ?? undefined, v.scale);
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

          datasets.set(key, new Dataset(key, outputDimensions, volumes, description, thumbnailURL.toString(), views));
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
