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
import {DatasetMetadata, GithubDatasetMetadataSource} from "./dataset_metadata";
import {isUri} from "valid-url";

export type DataFormats = "n5" | "zarr" | "precomputed" | "neuroglancer_legacy_mesh"
export type LayerTypes = 'image' | 'segmentation' | 'annotation' | 'mesh';
export type VolumeStores = "n5" | "precomputed" | "zarr";
export type ContentType = "em" | "segmentation" | "prediction" | "analysis";
export type SampleType = "scalar" | "label"
const resolutionTagThreshold = 6;
export interface titled {
  title: string
}

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
  sampleType: SampleType
  format: VolumeStores
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

type TagCategories = "Software Availability" |
"Contributing institution" |
"Volumes" |
"Sample: Organism" |
"Sample: Type" |
"Sample: Subtype" |
"Sample: Treatment" |
"Acquisition institution" |
"Lateral voxel size" |
"Axial voxel size"

export interface ITag{
  value: string
  category: TagCategories
}

export class OSet<T>{
  public map: Map<string, T>
  constructor(){
    this.map = new Map();
  }
  add(element: T) {
    this.map.set(JSON.stringify(element), element)
  }
  has(element: T): boolean {
    return [...this.map.keys()].includes(JSON.stringify(element))
  }
  delete(element: T): boolean {
    return this.map.delete(JSON.stringify(element))
  }
  [Symbol.iterator](){
    return this.map[Symbol.iterator]()
  }
}

interface IDataset{
  name: string
  space: CoordinateSpace
  volumes: Map<string, Volume>
  description: DatasetMetadata
  thumbnailURL: string
  views: DatasetView[]
  tags: OSet<ITag>
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
contentTypeDescriptions.set('segmentation', {label: "Segmentation Layers", description: "Predictions that have undergone refinements such as thresholding, smoothing, size filtering, and connected component analysis. Double Left Click a segmentation to turn on/off a 3D rendering."});
contentTypeDescriptions.set('prediction', {label: "Prediction Layers", description: "Raw distance transform inferences scaled from 0 to 255. A voxel value of 127 represent a predicted distance of 0 nm."});
contentTypeDescriptions.set('analysis', {label: "Analysis Layers", description: "Results of applying various analysis routines on raw data, predictions, or segmentations."});


function makeShader(shaderArgs: DisplaySettings, sampleType: SampleType): string | undefined{
  switch (sampleType) {
    case 'scalar':{
      let lower = shaderArgs.contrastLimits.min;
      let upper = shaderArgs.contrastLimits.max;
      let cmin = shaderArgs.contrastLimits.start;
      let cmax = shaderArgs.contrastLimits.end;
        return `#uicontrol invlerp normalized(range=[${cmin}, ${cmax}], window=[${lower}, ${upper}])
        #uicontrol int invertColormap slider(min=0, max=1, step=1, default=${shaderArgs.invertLUT? 1: 0})
        #uicontrol vec3 color color(default="${shaderArgs.color}")
        float inverter(float val, int invert) {return 0.5 + ((2.0 * (-float(invert) + 0.5)) * (val - 0.5));}
          void main() {
          emitRGB(color * inverter(normalized(), invertColormap));
        }`
      }
    case "label":
      return '';
    default:
      return undefined;
  }
}

interface LayerDataSource2 extends LayerDataSource {
  transform: any
}

// A single n-dimensional array
export class Volume implements VolumeSource {
    constructor(
        public path: string,
        public name: string,
        public dataType: string,
        public transform: SpatialTransform,
        public contentType: ContentType,
        public sampleType: SampleType,
        public format: VolumeStores,
        public displaySettings: DisplaySettings,
        public description: string,
        public version: string,
        public tags: string[],
        public subsources: MeshSource[]
    ) {}

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
        const color = this.displaySettings.color ?? undefined;
        if (layerType === 'image'){
          let shader: string | undefined = undefined;
          shader = makeShader(this.displaySettings, this.sampleType);
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
    public tags: OSet<ITag>
    constructor(name: string,
                space: CoordinateSpace,
                volumes: Map<string, Volume>,
                description: DatasetMetadata,
                thumbnailPath: string,
                views: DatasetView[]) {
        this.name = name;
        this.space = space;
        this.volumes = volumes;
        this.description = description;
        this.thumbnailURL = thumbnailPath;
        this.views = views;
        this.tags = this.makeTags();
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
    makeTags(): OSet<ITag>
    {
      const tags: OSet<ITag> = new OSet();
      const descr = this.description;
      let latvox = undefined;
      tags.add({value: descr.imaging.institution, category: 'Acquisition institution'});

      for (let val of descr.institution) {
        tags.add({value: val, category: 'Contributing institution'})}
      for (let val of descr.sample.organism) {
        tags.add({value: val, category: 'Sample: Organism'})
      }
      for (let val of descr.sample.type) {
        tags.add({value: val, category: 'Sample: Type'})
      }
      for (let val of descr.sample.subtype) {
        tags.add({value: val, category: 'Sample: Subtype'})
          }
      for (let val of descr.sample.treatment) {
        tags.add({value: val, category: 'Sample: Treatment'})
      }
      const axvox = descr.imaging.gridSpacing.values.z
      if (axvox !== undefined) {
        let value = ''
        if (axvox <= resolutionTagThreshold)
        {value = `<= ${resolutionTagThreshold} nm`}
        else {
          {value = `> ${resolutionTagThreshold} nm`}
        }
        tags.add({value: value, category: 'Axial voxel size'});
      }
      if ((descr.imaging.gridSpacing.values.y !== undefined) || (descr.imaging.gridSpacing.values.x !== undefined)) {
       latvox =  Math.min(descr.imaging.gridSpacing.values.y, descr.imaging.gridSpacing.values.x!);
       tags.add({value: latvox.toString(), category: 'Lateral voxel size'});
      }
      tags.add({value: descr.softwareAvailability, category: 'Software Availability'});
      return tags
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

function makeVolume(outerPath: string, volumeMeta: VolumeSource): Volume {
  volumeMeta.path = reifyPath(outerPath, volumeMeta.path);
  // this is a shim until we add a defaultLayerType field to the volume metadata
  let ds = volumeMeta.displaySettings;
  ds.defaultLayerType = "image"
  if (volumeMeta.sampleType === 'label') {
    ds.defaultLayerType = "segmentation";
  }
  volumeMeta.displaySettings = ds;

  for (let subsource of volumeMeta.subsources) {subsource.path = reifyPath(outerPath, subsource.path)}

  return new Volume(volumeMeta.path,
                    volumeMeta.name,
                    volumeMeta.dataType,
                    volumeMeta.transform,
                    volumeMeta.contentType,
                    volumeMeta.sampleType,
                    volumeMeta.format,
                    volumeMeta.displaySettings,
                    volumeMeta.description,
                    volumeMeta.version,
                    volumeMeta.tags,
                    volumeMeta.subsources)
}

export async function makeDatasets(bucket: string, metadataEndpoint: string): Promise<Map<string, Dataset>> {
  const datasets: Map<string, Dataset> = new Map();
  const metadataSources: Map<string, GithubDatasetMetadataSource> = new Map();

  // get the keys to the datasets
  const datasetKeys: string[] = await getDatasetKeys(bucket);

  for (let key of datasetKeys) {
    const url = new URL(metadataEndpoint);
    url.pathname += key
    metadataSources.set(key, new GithubDatasetMetadataSource(url.toString()))
  }

  await Promise.all(
    datasetKeys.map(async key => {
      const outerPath: string = `${bucketNameToURL(bucket)}/${key}`;
      // non-undefined assertion is OK because we know that all the keys
      // are in there
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
        if (index === undefined) {console.log(`Failed to parse index.json from ${metadataSource.url}`)}
        if (description === undefined) {console.log(`Failed to parse readme.json from ${metadataSource.url}`)}
      }
    })
  );
  return datasets;
}
