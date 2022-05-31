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
import { Index } from ".";
import {DatasetMetadata, GithubDatasetAPI} from "./dataset_metadata";
import { DisplaySettings, 
         ContentTypeEnum as ContentType, 
         SampleTypeEnum as SampleType,
         SpatialTransform, 
         VolumeSource,
         DatasetView as IDatasetView, 
         MeshSource } from "./manifest";

export type DataFormats = "n5" | "zarr" | "precomputed" | "neuroglancer_legacy_mesh"
export type LayerTypes = 'image' | 'segmentation' | 'annotation' | 'mesh';
export type VolumeStores = "n5" | "precomputed" | "zarr";

const resolutionTagThreshold = 6;
export interface titled {
  title: string
}

type Complete<T> = {
  [P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>> ? T[P] : (T[P] | undefined);
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
  volumes: Map<string, VolumeSource>
  description: DatasetMetadata
  thumbnailURL: string
  views: DatasetView[]
  tags: OSet<ITag>
}

const DefaultView: IDatasetView = {name: "Default view", 
                    description: "The default view of the data", 
                    sources: [], 
                    orientation: [0, 1, 0, 0], 
                    position: undefined, 
                    scale: undefined};
export class DatasetView implements IDatasetView {
  name: string;
  description: string;
  sources: string[];
  position?: number[];
  scale?: number;
  orientation?: number[];
  constructor(blob: IDatasetView = DefaultView){
      this.name = blob.name;
      this.description = blob.description;
      this.sources = blob.sources;
      this.position = blob.position ?? undefined;
      this.scale = blob.scale ?? undefined;
      this.orientation = blob.orientation ?? undefined;
  }
}

export interface ContentTypeMetadata {
  label: string
  description: string
}

export function makeQuiltURL(bucket: string, prefix: string): string {
  return `https://open.quiltdata.com/b/${bucket}/tree/${prefix}/`
}

export function isS3(url: string): boolean {
  return url.startsWith('s3://')
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
const outputDimensions = { x: nm, y: nm, z: nm };

export const contentTypeDescriptions = new Map<ContentType, ContentTypeMetadata>();
contentTypeDescriptions.set('em', {label: "EM Layers", description: "Raw FIB-SEM data."});
contentTypeDescriptions.set('lm', {label: "LM Layers", description: "Light microscopy data."});
contentTypeDescriptions.set('segmentation', {label: "Segmentation Layers", description: "Predictions that have undergone refinements such as thresholding, smoothing, size filtering, and connected component analysis. In neuroglancer, left click twice on a segmentation to turn on/off a 3D rendering."});
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


export function makeLayer(volume: VolumeSource, layerType: LayerTypes): Layer | undefined {
  const srcURL = `${volume.format}://${volume.url}`;

  // need to update the layerdatasource object to have a transform property
  const source: LayerDataSource2 = {url: srcURL,
                                   transform: SpatialTransformToNeuroglancer(volume.transform, outputDimensions),
                                  CoordinateSpaceTransform: SpatialTransformToNeuroglancer(volume.transform, outputDimensions)};
  
  const subsources = volume.subsources.map(subsource => {
    return {url: `precomputed://${subsource.url}`, transform: SpatialTransformToNeuroglancer(subsource.transform, outputDimensions), CoordinateSpaceTransform: SpatialTransformToNeuroglancer(subsource.transform, outputDimensions)}
  });
  let layer: Layer | undefined = undefined;
  const color = volume.displaySettings.color ?? undefined;
  if (layerType === 'image'){
    let shader: string | undefined = undefined;
    shader = makeShader(volume.displaySettings, volume.sampleType);
    layer = new ImageLayer('rendering',
                          undefined,
                          undefined,
                          volume.name,
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
                                    volume.name,
                                    [source, ...subsources],
                                    volume.subsources[0].ids,
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
                                    volume.name,
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

interface LayerDataSource2 extends LayerDataSource {
  transform: any
}

// A single n-dimensional array
export class Volume implements VolumeSource {
  url: string;
  name: string;
  transform: SpatialTransform;
  contentType: ContentType;
  sampleType: SampleType;
  format: VolumeStores;
  displaySettings: DisplaySettings;
  description: string;
  subsources: MeshSource[];
    constructor(
        url: string,
        name: string,
        transform: SpatialTransform,
        contentType: ContentType,
        sampleType: SampleType,
        format: VolumeStores,
        displaySettings: DisplaySettings,
        description: string,
        subsources: MeshSource[] | undefined
    ) {
      this.url = url;
      this.name = name;
      this.contentType = contentType;
      this.transform=transform;
      this.contentType=contentType;
      this.sampleType=sampleType;
      this.format=format;
      this.displaySettings=displaySettings;
      this.description=description;
      this.subsources = subsources? subsources : []
    }
}

// a collection of volumes, i.e. a collection of ndimensional arrays
