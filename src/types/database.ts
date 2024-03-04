
import { Camelized } from "./camel";
import { Database} from "./supabase";
import { DatasetTag, OSet } from "./tags";

export type Modify<T, R> = Omit<T, keyof R> & R

type Tables = Database["public"]["Tables"]

export type DisplaySettings = {
    contrastLimits: {
      min: number,
      max: number,
      start: number,
      end: number
    };
    color: string | null;
    invertLUT: boolean;
  };


export type Taxon = {
    name: string,
    shortName: string
}

export type FibsemParams = {
  duration_days: number | null
  bias_V: number | null
  scan_hz: number | null
  current_nA: number | null
  landing_energy_eV: number | null
}

export type Sample = Omit<Tables["sample"]["Row"], "id">
export type ArrayContainerFormat = Database["public"]["Enums"]["array_container_format"]
export type ContentType = Database["public"]["Enums"]["content_type"]
export type SampleType = Database["public"]["Enums"]["sample_type"]
export type Stage = Database["public"]["Enums"]["stage"]

export type STTransform = {
    units: string[]
    dims: string[]
    scale: number[]
    translation: number[]
}

export type SampleQueryResult = {
  name: string
  description: string
  protocol: string
  contributions: string
  organism: string[] | null
  type: string[] | null
  subtype: string[] | null
  treatment: string[] | null 
}

export type ImageAcquisitionQueryResult = {
  name: string
  institution: string
  start_date: string | null
  grid_axes: string[]
  grid_spacing: number[]
  grid_spacing_unit: string
  grid_dimensions: number[]
  grid_dimensions_unit: string
}

export type ImageQueryResult = {
  name: string
  description: string
  url: string
  format: Database["public"]["Enums"]["array_container_format"]
  source: FibsemParams | null
  grid_scale: number[]
  grid_dims: string[]
  grid_translation: number[]
  grid_units: string[]
  display_settings: DisplaySettings
  created_at: string
  sample_type: Database["public"]["Enums"]["sample_type"]
  content_type: Database["public"]["Enums"]["content_type"]
  dataset_name: string
  institution: string
  stage: Stage
  meshes: {
    name: string
    description: string
    created_at: string
    url: string
    source: null
    grid_scale: number[]
    grid_dims: string[]
    grid_translation: number[]
    grid_units: string[]
    image_id: number
    format: Database["public"]["Enums"]["mesh_format"]
    ids: number[]
    stage: Stage
  }[]
}

export type PublicationQueryResult = {
  name: string
  url: string
  stage: Stage
  type: Database["public"]["Enums"]["publication_type"]
}

export type DatasetQueryResult = {
  name: string
  description: string
  thumbnail_url: string
  created_at: string
  sample: SampleQueryResult
  image_acquisition: ImageAcquisitionQueryResult
  images: ImageQueryResult[]
  stage: Stage
  publications: PublicationQueryResult[]
}

export type ViewQueryResult = {
  name: string
  description: string
  created_at: string
  position: number[] | null
  scale: number | null
  orientation: number[] | null
  tags: string[] | null
  dataset_name: string
  thumbnail_url: string | null
  stage: Stage
  taxa: {
    created_at: string | null
    name: string
    short_name: string
    stage: Stage
  }[]
  images: ImageQueryResult[]
}


export type Dataset = 
  Camelized<DatasetQueryResult> & {
    tags: OSet<DatasetTag>
  }

export type View = Camelized<ViewQueryResult>
export type Image = Dataset['images'][number]
export type Publication = Dataset['publications'][number]
export type ImageAcquisition = Dataset['imageAcquisition']