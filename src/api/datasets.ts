import { supabase } from "./supabase";
import {camelize, Camelized} from './camel'
import { ContentType,
         Dataset,
         MeshFormat,
         PublicationType,
         Sample,
         SampleType,
         UnitfulVector,
         Image, 
         ArrayContainerFormat,
         FIBSEMAcquisition,
         SoftwareAvailability} from "../types/datasets";
import { ensureArray, ensureNotArray } from "./util";
import { DatasetTag, OSet } from "../types/tags";


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

type makeTagsProps = {
  acquisition: FIBSEMAcquisition
  institutions: string[],
  sample: Sample
  softwareAvailability: SoftwareAvailability
}

const resolutionTagThreshold = 6;
export function makeTags({acquisition,
                          institutions,
                          sample,
                          softwareAvailability}: makeTagsProps): OSet<DatasetTag> {
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

async function fetchDatasetsDirect(){
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
            )`).eq('is_published', true)
  if (error == null) {
    return data
  }
  else {
    throw new Error(`Oops! ${JSON.stringify(error)}`)
  }
}

type DatasetsFromDb = Awaited<ReturnType<typeof fetchDatasetsDirect>>

export async function fetchDatasets() {
    const data = await fetchDatasetsDirect()
    const camelized = camelize(data) as Camelized<typeof data>
    const legacy = new Map(camelized.map(d => {
      const legacyDataset = supabaseDatasetToLegacy(d)
      return [d.name, {...legacyDataset, tags: makeTags({acquisition: legacyDataset.acquisition,
                                                         institutions: legacyDataset.institutions,
                                                         sample: legacyDataset.sample,
                                                         softwareAvailability: legacyDataset.softwareAvailability})}]
    }))
    return legacy
}

function supabaseDatasetToLegacy(dataset: Camelized<DatasetsFromDb>[number]) {      
    const acq = ensureNotArray(dataset.imageAcquisition)
    const gridSpacing: UnitfulVector = {values: {}, unit: acq.gridSpacingUnit}
    const dimensions: UnitfulVector = {values: {}, unit: acq.gridSpacingUnit}

    acq.gridAxes?.forEach((axis, idx) => {
        gridSpacing.values[axis] = acq.gridSpacing![idx]
        dimensions.values[axis] = acq.gridDimensions![idx]
    })
    
    const publications = ensureArray(dataset.publications).map((p) => {
      return {
        name: p.name,
        type: (p.type == "DOI" ? "doi" : "paper") as PublicationType, 
        url: p.url
            }
    })
      const images: Image[] = ensureArray(dataset.images).map((im) => {
      return {
        name: im.name,
        description: im.description,
        url: im.url,
        format: (im.format === 'NEUROGLANCER_PRECOMPUTED') ? 'precomputed' : (im.format.toLowerCase()) as ArrayContainerFormat,
        transform: im.transform,
        sampleType: (im.sampleType.toLowerCase()) as SampleType,
        contentType: (im.contentType.toLowerCase()) as ContentType,
        displaySettings: {...im.displaySettings, color: im.displaySettings.color ?? undefined},
        meshes: ensureArray(im.meshes).map((m) => {
          return {
            name: m.name,
            description: m.description,
            url: m.url, 
            format: "neuroglancer_multilod_draco" as MeshFormat,
            transform: m.transform,
            ids: []}
          })
    }})
    return {
      name: dataset.name,
      description: dataset.description,
      institutions: [acq.institution],
      softwareAvailability: "open" as SoftwareAvailability,
      acquisition: {
        name: acq.name,
        institution: acq.institution,
        startDate: acq.startDate,
        gridSpacing: gridSpacing,
        dimensions: dimensions},
      sample: dataset.sample as Sample,
      publications: publications,
      images: images,
      thumbnailUrl: dataset.thumbnailUrl,
      published: true
    }
  }