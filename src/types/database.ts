
import {ToDate} from "./stringtodate"
import { Camelized } from "./camel";
import { Database, Json} from "./supabase";
import { DatasetTag, OSet } from "./tags";
import {z} from "zod";

export type Modify<T, R> = Omit<T, keyof R> & R

type Tables = Database["public"]["Tables"]

type NoDisplaySettings = {}

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

export type MaybeDisplaySettings = DisplaySettings | NoDisplaySettings

 export const isDisplayEmpty = (b: MaybeDisplaySettings): b is NoDisplaySettings => {
    return Object.keys(b as NoDisplaySettings).length == 0
}

export type Taxon = {
    name: string,
    shortName: string
}

export type FibsemParams = {
  duration_days: number
  bias_V: number
  scan_hz: number
  current_nA: number
  landing_energy_eV: number
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
  start_date: string
  grid_axes: string[]
  grid_spacing: number[]
  grid_spacing_unit: string
  grid_dimensions: number[]
  grid_dimensions_unit: string
}

export type ImageryQueryResult = {
  name: string
  description: string
  url: string
  format: Database["public"]["Enums"]["imagery_format"]
  source: FibsemParams | null
  grid_scale: number[]
  grid_dims: string[]
  grid_translation: number[]
  grid_units: string[]
  created_at: string
  displaySettings: MaybeDisplaySettings
  sample_type: Database["public"]["Enums"]["sample_type"]
  content_type: Database["public"]["Enums"]["content_type"]
  dataset_name: string
  institution: string
  stage: Stage
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
  imagery: ImageryQueryResult[]
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
  imagery: ImageryQueryResult[]
}


export type Dataset = 
  ToDate<Camelized<DatasetQueryResult>> & {
    tags: OSet<DatasetTag>
  }

export type View = ToDate<Camelized<ViewQueryResult>>
/*
export const zView = z.object({
  name: z.string(),
  description: z.string(),
  created_at: z.date(),
  position: z.optional(z.array(z.number())),
  scale: z.optional(z.array(z.number())),
  orientation: z.optional(z.array(z.number())),
  tags: z.array(z.string()),
  dataset_name: z.string(),
  thumbnail_url: z.string(),
  stage: z.enum(['dev', 'prod'])
}) satisfies z.ZodType<View>
export type Imagery = Dataset['imagery'][number]
export const zImagery = z.object({
  name: z.string(),
  description: z.string(),
})
*/
export type Imagery = Dataset['imagery'][number]

export type Publication = Dataset['publications'][number]
export type ImageAcquisition = Dataset['imageAcquisition']