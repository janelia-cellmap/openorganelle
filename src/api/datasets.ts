import { supabase } from "./supabase";
import {Camelized} from '../types/camel'
import {camelize, getStage} from "./util"
import { ContentType,
         Sample,
         DatasetQueryResult,
         ImageAcquisition} from "../types/database";
import { DatasetTag, OSet } from "../types/tags";

export interface ContentTypeMetadata {
  label: string
  description: string
}

export const contentTypeDescriptions = new Map<ContentType, ContentTypeMetadata>();

contentTypeDescriptions.set('em', { label: "EM Layers", description: "EM data." });
contentTypeDescriptions.set('lm', { label: "LM Layers", description: "Light microscopy data." });
contentTypeDescriptions.set('annotation', { label: "Annotation Layers", description: "Manual Annotations of regions of interest within volumetric EM/LM data." });
contentTypeDescriptions.set('segmentation', { label: "Segmentation Layers", description: "Predictions that have undergone refinements such as thresholding, smoothing, size filtering, and connected component analysis. Double Left Click a segmentation to turn on/off a 3D rendering." });
contentTypeDescriptions.set('prediction', { label: "Prediction Layers", description: "Raw distance transform inferences scaled from 0 to 255. A voxel value of 127 represent a predicted distance of 0 nm." });
contentTypeDescriptions.set('analysis', { label: "Analysis Layers", description: "Results of applying various analysis routines on raw data, predictions, or segmentations." });

type makeTagsProps = {
  acquisition: ImageAcquisition,
  institutions: string[],
  sample: Sample,
  challenge: boolean,
  softwareAvailability: "open" | "partially open" | "closed"
}

const resolutionTagThreshold = 6;
export function makeTags({acquisition,
                          institutions,
                          sample,
                          challenge,
                          softwareAvailability}: makeTagsProps): OSet<DatasetTag> {
  const tags: OSet<DatasetTag> = new OSet();
  let latvox = undefined;
  tags.add({value: acquisition.institution, category: 'Acquisition institution'});
  const axvox = acquisition.gridSpacing[2]
  let value = ''
  if (axvox <= resolutionTagThreshold){value = `<= ${resolutionTagThreshold} nm`}
  else {value = `> ${resolutionTagThreshold} nm`}
  
  tags.add({value: value, category: 'Axial voxel size'});
  latvox =  Math.min(acquisition.gridSpacing[1], acquisition.gridSpacing[0]);
  tags.add({value: latvox.toString(), category: 'Lateral voxel size'});
  
  for (const val of institutions) {tags.add({value: val, category: 'Contributing institution'})}
  if (sample.organism !== null) {
    for (const val of sample.organism) {
      tags.add({value: val, category: 'Sample: Organism'})
    }
  }
  if (sample.type !== null) {
    for (const val of sample.type) {
      tags.add({value: val, category: 'Sample: Type'})
    }
  }
  if (sample.subtype !== null) {
    for (const val of sample.subtype) {
      tags.add({value: val, category: 'Sample: Subtype'})
    }
  }
  if (sample.treatment !== null) {
    for (const val of sample.treatment) {
      tags.add({value: val, category: 'Sample: Treatment'})
    }
  }  
  if (challenge == true) {
    tags.add({value: 'CellMap segmentation challenge', category: 'Other'})
  }
  tags.add({value: softwareAvailability, category: 'Software Availability'});

  return tags
}


async function queryDatasets(){
  const stage = getStage()
  let stageFilter: ['dev', 'prod'] | ['prod']
  if (stage == 'dev') {
    stageFilter = ['dev', 'prod']
  }
  else {
    stageFilter = ['prod']
  }
  const { data, error } = await supabase
    .from('dataset')
    .select(`
            name,
            description,
            thumbnail_url,
            created_at,
            stage,
            segmentation_challenge,
            sample:sample(
              name,
              description,
              protocol,
              contributions,
              type,
              subtype,
              treatment,
              organism
            ),
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
                source,
                grid_scale,
                grid_translation,
                grid_dims,
                grid_units,
                display_settings,
                sample_type,
                content_type,
                institution,
                created_at,
                stage,
                image_stack,
                meshes:mesh(
                    name,
                    description,
                    url,
                    source,
                    grid_scale,
                    grid_translation,
                    grid_dims,
                    grid_units,
                    created_at,
                    format,
                    stage,
                    ids
                    )
            ),
            publications:publication(
                name,
                url,
                type,
                stage
            )`)
            .in('stage', stageFilter)
            .in('images.stage', stageFilter)
            .in('images.meshes.stage', stageFilter)
            .in('publications.stage', stageFilter)
            .returns<DatasetQueryResult>()
              
            if (error === null) {
              return data

  }
  else {
    throw new Error(`Oops! ${JSON.stringify(error)}`)
  }
}

export async function fetchDatasets() {
    const data = await queryDatasets()
    // convert snake_case keys to camelCase
    const camelized = camelize(data) as Camelized<typeof data>
    const dsets = new Map(camelized.map(d => {
      return [d.name, {...d, tags: makeTags({acquisition: d.imageAcquisition,
                                             institutions: [d.imageAcquisition.institution],
                                             sample: d.sample,
                                             challenge: d.segmentationChallenge,
                                             softwareAvailability: "open"})}]
    }))
    return dsets
}