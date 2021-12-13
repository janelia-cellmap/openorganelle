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
import {DatasetMetadata, GithubDatasetAPI} from "./dataset_metadata";
import { DisplaySettings, 
         ContentTypeEnum as ContentType, 
         SampleTypeEnum as SampleType,
         SpatialTransform, 
         VolumeSource,
         DatasetView as IDatasetView, 
         MeshSource } from "./manifest";
import {isUri} from "valid-url";

export type DataFormats = "n5" | "zarr" | "precomputed" | "neuroglancer_legacy_mesh"
export type LayerTypes = 'image' | 'segmentation' | 'annotation' | 'mesh';
export type VolumeStores = "n5" | "precomputed" | "zarr";

const resolutionTagThreshold = 6;
export interface titled {
  title: string
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

export const contentTypeDescriptions = new Map<ContentType, ContentTypeMetadata>();
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
        public url: string,
        public name: string,
        public transform: SpatialTransform,
        public contentType: ContentType,
        public sampleType: SampleType,
        public format: VolumeStores,
        public displaySettings: DisplaySettings,
        public description: string,
        public subsources: MeshSource[]
    ) {}

    // todo: remove handling of spatial metadata, or at least don't pass it on to the neuroglancer
    // viewer state construction

    toLayer(layerType: LayerTypes): Layer | undefined {
        const srcURL = `${this.format}://${this.url}`;

        // need to update the layerdatasource object to have a transform property
        const source: LayerDataSource2 = {url: srcURL,
                                         transform: SpatialTransformToNeuroglancer(this.transform, outputDimensions),
                                        CoordinateSpaceTransform: SpatialTransformToNeuroglancer(this.transform, outputDimensions)};

        const subsources = this.subsources.map(subsource => {
          return {url: `precomputed://${subsource.url}`, transform: SpatialTransformToNeuroglancer(subsource.transform, outputDimensions), CoordinateSpaceTransform: SpatialTransformToNeuroglancer(subsource.transform, outputDimensions)}
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


function makeVolume(volumeMeta: VolumeSource): Volume {
  return new Volume(volumeMeta.url,
                    volumeMeta.name,
                    volumeMeta.transform,
                    volumeMeta.contentType,
                    volumeMeta.sampleType,
                    volumeMeta.format,
                    volumeMeta.displaySettings,
                    volumeMeta.description,
                    volumeMeta.subsources)
}

export async function makeDatasets(metadataEndpoint: string): Promise<Map<string, Dataset>> {
  const API = new GithubDatasetAPI(metadataEndpoint);
  const datasets: Map<string, Dataset> = new Map();
  
  await Promise.all(
    [...API.datasets.keys()].map(async key => {
      let {thumbnail, manifest} = await API.datasets.get(key)!;

      try {
        const views: DatasetView[] = [];
        // make sure that the default view is at the beginning of the list
        for (let v of manifest.views) {
          let vObj = new DatasetView(v.name, v.description, v.volumeNames, v.orientation, v.position, v.scale);
          if (vObj.name === 'Default View'){
            views.unshift(vObj)
          }
          else views.push(vObj)
        }
        const volumes: Map<string, Volume> = new Map();
        manifest.volumes.forEach(v => volumes.set(v.name, makeVolume(v)));

        if (views.length === 0){
          let defaultView = new DatasetView('Default view', '', Array.from(volumes.keys()), undefined, undefined, undefined);
          views.push(defaultView)
        }

        datasets.set(key, new Dataset(key, outputDimensions, volumes, description, thumbnail.toString(), views));
      }
      catch (error) {
        console.log(error)
      }
    })
  );
  return datasets;
}
