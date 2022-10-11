import { Tag, OSet } from "./tagging";
import {components} from "../types/datasets"
import { getObjectFromJSON } from "./util";

export type Dataset = components["schemas"]["Dataset"]
export type TaggedDataset = Dataset & {tags: OSet<DatasetTag>}
export type Image = components["schemas"]["Image"]
export type View = components["schemas"]["View"]
export type ContentType = components["schemas"]["ContentType"]
export type UnitfulVector = components["schemas"]["UnitfulVector"]
export type Publication = components["schemas"]["Publication"]
export type DataFormats = "n5" | "zarr" | "precomputed" | "neuroglancer_legacy_mesh"
export type LayerType = 'image' | 'segmentation' | 'annotation' | 'mesh';
export type SpatialTransform = components["schemas"]["SpatialTransform"]
export type SampleType = components["schemas"]["SampleType"]
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

const DefaultView: View = {
  name: "Default view",
  description: "The default view of the data",
  sourceNames: [],
  orientation: [0, 1, 0, 0],
  position: undefined,
  scale: undefined
};
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

const resolutionTagThreshold = 6;
function makeTags({acquisition, institutions, sample, softwareAvailability}: Dataset): OSet<DatasetTag> {
  const tags: OSet<DatasetTag> = new OSet();
  let latvox = undefined;
  if (acquisition !== undefined) {
  if (acquisition.institution !== undefined) {
      tags.add({value: acquisition?.institution, category: 'Acquisition institution'});
      const axvox = acquisition.gridSpacing.values.z
      if (axvox !== undefined) {
        let value = ''
        if (axvox <= resolutionTagThreshold)
        {value = `<= ${resolutionTagThreshold} nm`}
        else {
          value = `> ${resolutionTagThreshold} nm`
        }
        tags.add({value: value, category: 'Axial voxel size'});
      }
      if ((acquisition.gridSpacing.values.y !== undefined) || (acquisition.gridSpacing.values.x !== undefined)) {
       latvox =  Math.min(acquisition.gridSpacing.values.y, acquisition.gridSpacing.values.x!);
       tags.add({value: latvox.toString(), category: 'Lateral voxel size'});
      }
  }
}
  for (let val of institutions) {tags.add({value: val, category: 'Contributing institution'})}
  if (sample !== undefined) {
  for (let val of sample.organism) {tags.add({value: val, category: 'Sample: Organism'})}
  for (let val of sample.type) {tags.add({value: val, category: 'Sample: Type'})}
  for (let val of sample.subtype) {tags.add({value: val, category: 'Sample: Subtype'})}
  for (let val of sample.treatment) {tags.add({value: val, category: 'Sample: Treatment'})}
  }
  tags.add({value: softwareAvailability, category: 'Software Availability'});
  return tags
}

export async function getDatasets(metadataEndpoint: string) {
  const datasets = await getObjectFromJSON<Dataset[]>(new URL(metadataEndpoint));
  const taggedDatasets = datasets.map((d) => {
      return {...d, tags: makeTags(d)}
      })
  return new Map<string, TaggedDataset>(taggedDatasets.map((d) => [d.name, d]));
}