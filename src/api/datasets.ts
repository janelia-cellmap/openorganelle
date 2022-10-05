import { CoordinateSpace } from "@janelia-cosem/neuroglancer-url-tools";
import { Index } from ".";
import { DatasetMetadata, GithubDatasetAPI } from "./dataset_metadata";
import {
  DisplaySettings,
  ContentTypeEnum as ContentType,
  SampleTypeEnum as SampleType,
  SpatialTransform,
  VolumeSource,
  DatasetView as IDatasetView,
  MeshSource
} from "./manifest";
import { outputDimensions } from "./neuroglancer";
import { Tag, OSet } from "./tagging";

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

export type DatasetTag = Tag<TagCategories>


interface IDataset {
  name: string
  volumes: Map<string, VolumeSource>
  description: DatasetMetadata
  thumbnailURL: string | undefined
  views: DatasetView[]
  tags: OSet<DatasetTag>
}

const DefaultView: IDatasetView = {
  name: "Default view",
  description: "The default view of the data",
  sources: [],
  orientation: [0, 1, 0, 0],
  position: undefined,
  scale: undefined
};
export class DatasetView implements IDatasetView {
  name: string;
  description: string;
  sources: string[];
  position?: number[];
  scale?: number;
  orientation?: number[];
  constructor(blob: IDatasetView = DefaultView) {
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


export const contentTypeDescriptions = new Map<ContentType, ContentTypeMetadata>();

contentTypeDescriptions.set('em', { label: "EM Layers", description: "EM data." });
contentTypeDescriptions.set('lm', { label: "LM Layers", description: "Light microscopy data." });
contentTypeDescriptions.set('segmentation', { label: "Segmentation Layers", description: "Predictions that have undergone refinements such as thresholding, smoothing, size filtering, and connected component analysis. Double Left Click a segmentation to turn on/off a 3D rendering." });
contentTypeDescriptions.set('prediction', { label: "Prediction Layers", description: "Raw distance transform inferences scaled from 0 to 255. A voxel value of 127 represent a predicted distance of 0 nm." });
contentTypeDescriptions.set('analysis', { label: "Analysis Layers", description: "Results of applying various analysis routines on raw data, predictions, or segmentations." });


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
    this.transform = transform;
    this.contentType = contentType;
    this.sampleType = sampleType;
    this.format = format;
    this.displaySettings = displaySettings;
    this.description = description;
    this.subsources = subsources ? subsources : []
  }
}

// a collection of volumes, i.e. a collection of ndimensional arrays
export class Dataset implements IDataset {
  public name: string;
  public space: CoordinateSpace;
  public volumes: Map<string, VolumeSource>;
  public description: DatasetMetadata
  public thumbnailURL: string | undefined
  public views: DatasetView[]
  public tags: OSet<DatasetTag>
  constructor(name: string,
    space: CoordinateSpace,
    volumes: Map<string, VolumeSource>,
    description: DatasetMetadata,
    thumbnailURL: string | undefined,
    views: DatasetView[]) {
    this.name = name;
    this.space = space;
    this.volumes = volumes;
    this.description = description;
    this.thumbnailURL = thumbnailURL;
    this.views = [];
    if (views.length === 0) {
      this.views = [new DatasetView()]
    }
    else {
      this.views = views.map(v => new DatasetView(v));
    }
    this.tags = makeTags(this.description);
  }
}

export function makeTags({ imaging, institution, sample, softwareAvailability }: DatasetMetadata): OSet<DatasetTag> {
  const tags: OSet<DatasetTag> = new OSet();
  let latvox = undefined;
  tags.add({ value: imaging.institution, category: 'Acquisition institution' });
  for (let val of institution) { tags.add({ value: val, category: 'Contributing institution' }) }
  for (let val of sample.organism) { tags.add({ value: val, category: 'Sample: Organism' }) }
  for (let val of sample.type) { tags.add({ value: val, category: 'Sample: Type' }) }
  for (let val of sample.subtype) { tags.add({ value: val, category: 'Sample: Subtype' }) }
  for (let val of sample.treatment) { tags.add({ value: val, category: 'Sample: Treatment' }) }
  const axvox = imaging.gridSpacing.values.z
  if (axvox !== undefined) {
    let value = ''
    if (axvox <= resolutionTagThreshold) { value = `<= ${resolutionTagThreshold} nm` }
    else {
      value = `> ${resolutionTagThreshold} nm`
    }
    tags.add({ value: value, category: 'Axial voxel size' });
  }
  if ((imaging.gridSpacing.values.y !== undefined) || (imaging.gridSpacing.values.x !== undefined)) {
    latvox = Math.min(imaging.gridSpacing.values.y, imaging.gridSpacing.values.x!);
    tags.add({ value: latvox.toString(), category: 'Lateral voxel size' });
  }
  tags.add({ value: softwareAvailability, category: 'Software Availability' });
  return tags
}


export async function makeDatasets(metadataEndpoint: string): Promise<Map<string, Dataset>> {
  const API = new GithubDatasetAPI(metadataEndpoint);
  let datasets: Map<string, Dataset> = new Map();
  let index: Index;

  try {
    index = await API.index;
  }
  catch (error) {
    console.log(`It was not possible to load an index of the datasets due to the following error: ${error}`)
    return datasets;
  }

  const entries: [string, Dataset][] = await Promise.all([...Object.keys(index.datasets)].map(async dataset_key => {
    let { manifest } = await API.get(dataset_key)!;
    const result: [string, Dataset] = [dataset_key, new Dataset(dataset_key,
      outputDimensions,
      new Map([...Object.entries(manifest.sources)]),
      manifest.metadata,
      manifest.metadata.thumbnailURL || `https://janelia-cosem-datasets.s3.amazonaws.com/${dataset_key}/thumbnail.jpg`,
      manifest.views)];
    return result
  }))

  datasets = new Map<string, Dataset>(entries);
  return datasets;
}

