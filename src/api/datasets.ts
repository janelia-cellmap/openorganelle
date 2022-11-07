import { Tag, OSet } from "./tagging";
import {components} from "../types/datasets"
import { supabase } from "./supabase";

import { Database } from '../types/supabase'
import {components as legacyComponents} from "../types/datasets"
import {camelize, Camelized} from './camel'

export type Dataset = components["schemas"]["Dataset"]
export type TaggedDataset = Dataset & {tags: OSet<DatasetTag>}
export type Image = components["schemas"]["Image"]
export type View = components["schemas"]["View"] & {thumbnailUrl?: String, tags?: string[]}
export type ContentType = components["schemas"]["ContentType"]
export type UnitfulVector = components["schemas"]["UnitfulVector"]
export type Publication = components["schemas"]["Publication"]

export type DataFormats = "n5" | "zarr" | "precomputed" | "neuroglancer_legacy_mesh"
export type LayerType = 'image' | 'segmentation' | 'annotation' | 'mesh';
export type SampleType = components["schemas"]["SampleType"]

type Modify<T, R> = Omit<T, keyof R> & R
type NoId<T> = Omit<T, "id">

type DisplaySettings = {
    contrastLimits: {min: number,
                     max: number,
                     start: number,
                     end: number};
    color: string;
    invertLut: boolean;
  };

export type Sample = {
    description: string;
    protocol: string;
    contributions: string;
    organism: string[];
    type: string[];
    subtype: string[];
    treatment: string[];
  };

export type SpatialTransform = {
    units: string[]
    axes: string[]
    scale: number[]
    translate: number[]
}

type ViewDb = Database["public"]["Tables"]["view"]["Row"]
type ImageDb = Modify<Database["public"]["Tables"]["image"]["Row"], {display_settings: DisplaySettings, transform: SpatialTransform}>
type MeshDb = Modify<Database["public"]["Tables"]["mesh"]["Row"], {transform: SpatialTransform}>
type DatasetDb = Modify<Database["public"]["Tables"]["dataset"]["Row"], {sample: Sample}>
type PublicationDb = Database["public"]["Tables"]["publication"]["Row"]
type ImageAcquisitionDb = Database["public"]["Tables"]["image_acquisition"]["Row"]

type ImageWithMeshDb = ImageDb & {meshes: NoId<Omit<MeshDb, "image_id">>[]}
type ViewWithImageDb = ViewDb & {images: {name: string}[]}

type FetchedDataset = Omit<NoId<DatasetDb>, "acquisition_id" | "is_published"> & {
    images: Omit<NoId<ImageWithMeshDb>, "dataset_name">[]
    views: Omit<NoId<ViewWithImageDb>, "dataset_name">[]
    publications: NoId<PublicationDb>[]
    image_acquisition: NoId<ImageAcquisitionDb>
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

export interface ContentTypeMetadata {
  label: string
  description: string
}

export const contentTypeDescriptions = new Map<ContentType, ContentTypeMetadata>();

contentTypeDescriptions.set('em', { label: "EM Layers", description: "EM data." });
contentTypeDescriptions.set('lm', { label: "LM Layers", description: "Light microscopy data." });
contentTypeDescriptions.set('segmentation', { label: "Segmentation Layers", description: "Predictions that have undergone refinements such as thresholding, smoothing, size filtering, and connected component analysis. Double Left Click a segmentation to turn on/off a 3D rendering." });
contentTypeDescriptions.set('prediction', { label: "Prediction Layers", description: "Raw distance transform inferences scaled from 0 to 255. A voxel value of 127 represent a predicted distance of 0 nm." });
contentTypeDescriptions.set('analysis', { label: "Analysis Layers", description: "Results of applying various analysis routines on raw data, predictions, or segmentations." });

const resolutionTagThreshold = 6;
export function makeTags({acquisition, institutions, sample, softwareAvailability}: Dataset): OSet<DatasetTag> {
  const tags: OSet<DatasetTag> = new OSet();
  let latvox = undefined;
  tags.add({value: acquisition.institution, category: 'Acquisition institution'});
  const axvox = acquisition.gridSpacing.values.z
  let value = ''
  if (axvox <= resolutionTagThreshold){value = `<= ${resolutionTagThreshold} nm`}
  else {value = `> ${resolutionTagThreshold} nm`}
  
  tags.add({value: value, category: 'Axial voxel size'});
  latvox =  Math.min(acquisition.gridSpacing.values.y, acquisition.gridSpacing.values.x!);
  tags.add({value: latvox.toString(), category: 'Lateral voxel size'});
  
  for (const val of institutions) {tags.add({value: val, category: 'Contributing institution'})}
  for (const val of sample.organism) {tags.add({value: val, category: 'Sample: Organism'})}
  for (const val of sample.type) {tags.add({value: val, category: 'Sample: Type'})}
  for (const val of sample.subtype) {tags.add({value: val, category: 'Sample: Subtype'})}
  for (const val of sample.treatment) {tags.add({value: val, category: 'Sample: Treatment'})}
  tags.add({value: softwareAvailability, category: 'Software Availability'});
  return tags
}

export async function fetchDatasets() {
    const { data, error } = await supabase
    .from('dataset')
    .select(`
            name,
            description,
            thumbnail_url,
            sample,
            created_at,
            image_acquisition:image_acquisition(
                name,
                institution,
                start_date,
                grid_axes,
                grid_spacing,
                grid_dimensions,
                grid_spacing_unit,
                grid_dimensions_unit
            ),
            images:image(
                name,
                description,
                url,
                format,
                transform,
                display_settings,
                sample_type,
                content_type,
                institution,
                created_at,
                meshes:mesh(
                    name,
                    description,
                    url,
                    transform,
                    created_at
                    )
            ),
            publications:publication(
                name,
                url,
                type
            ),
            views:view(
                name,
                description,
                thumbnail_url,
                position,
                scale,
                orientation,
                tags,
                created_at,
                images:image(name))`).eq('is_published', true)
  
if (error == null)
  {
    const camelized = camelize(data) as Camelized<FetchedDataset>[]
    const legacy = new Map(camelized.map( d => {
      const legacyDataset = supabaseDatasetToLegacy(d)
      return [d.name, {...legacyDataset, tags: makeTags(legacyDataset)}]}))
    return legacy
}
else{
    throw new Error(`Oops! ${JSON.stringify(error)}`)
}
}

function supabaseDatasetToLegacy(dataset: Camelized<FetchedDataset>): legacyComponents["schemas"]["Dataset"] {
    const acq = dataset.imageAcquisition
    const gridSpacing: UnitfulVector = {values: {}, unit: acq.gridSpacingUnit}
    const dimensions: UnitfulVector = {values: {}, unit: acq.gridSpacingUnit}

    acq.gridAxes?.forEach((axis, idx) => {
        gridSpacing.values[axis] = acq.gridSpacing![idx]
        dimensions.values[axis] = acq.gridDimensions![idx]
    })
    const pubs = dataset.publications.map((p) => {return {name: p.name, type: (p.type == "DOI" ? "doi" : "paper") as components["schemas"]["PublicationType"], url: p.url }})
    const ims = dataset.images.map((im) => {return {
        name: im.name,
        description: im.description,
        url: im.url,
        format: (im.format === 'NEUROGLANCER_PRECOMPUTED') ? 'precomputed' : (im.format.toLowerCase()) as components["schemas"]["ArrayContainerFormat"],
        transform: im.transform as components["schemas"]["SpatialTransform"],
        sampleType: (im.sampleType.toLowerCase()) as components["schemas"]["SampleType"],
        contentType: (im.contentType.toLowerCase()) as components["schemas"]["ContentType"],
        displaySettings: im.displaySettings as components["schemas"]["DisplaySettings"],
        subsources: im.meshes.map((m) => {return {name: m.name,
                                                      description: m.description,
                                                    url: m.url, format: "neuroglancer_multilod_draco" as components["schemas"]["MeshFormat"],
                                                transform: m.transform,
                                                ids: []}})
    }})

    const views = dataset.views.map((v) => {return {
        name: v.name,
        description: v.description,
        sourceNames: v.images.map((im) => {return im.name}),
        position: v.position ?? undefined,
        scale: v.scale ?? undefined,
        thumbnailUrl: v.thumbnailUrl,
        orientation: v.orientation ?? undefined
    }})
    return {name: dataset.name,
            description: dataset.description,
            institutions: [dataset.imageAcquisition.institution],
            softwareAvailability: "open",
            acquisition: {name: acq.name,
                          institution: acq.institution,
                          startDate: acq.startDate,
                          gridSpacing: gridSpacing,
                          dimensions:dimensions},
            sample: dataset.sample as components["schemas"]["Sample"],
            publications: pubs,
            images: ims,
            views: views,
            thumbnailUrl: dataset.thumbnailUrl,
            published: true
}}

export async function fetchViews() {
  const { data, error } = await supabase
  .from('view')
  .select(`
    name,
    description,
    thumbnail_url,
    position,
    scale,
    orientation,
    tags,
    created_at,
    images:image(name),
    dataset!inner(name)`).eq('dataset.is_published', true)
  if (error === null) {
    return data
  }
  else {
    throw new Error(`Oops! ${JSON.stringify(error)}`)
  }
}