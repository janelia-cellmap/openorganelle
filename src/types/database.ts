
import {ToDate} from "./stringtodate"
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
    invertLut: boolean;
  };


export type Taxon = {
    name: string,
    shortName: string
}

export type Sample = Omit<Tables["sample"]["Row"], "id">
export type ArrayContainerFormat = Database["public"]["Enums"]["array_container_format"]
export type ContentType = Database["public"]["Enums"]["content_type"]
export type SampleType = Database["public"]["Enums"]["sample_type"]

export type SpatialTransform = {
    units: string[]
    axes: string[]
    scale: number[]
    translate: number[]
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

export type ImageQueryResult = {
  name: string
  description: string
  url: string
  format: Database["public"]["Enums"]["array_container_format"]
  transform: SpatialTransform
  display_settings: DisplaySettings
  created_at: string
  sample_type: Database["public"]["Enums"]["sample_type"]
  content_type: Database["public"]["Enums"]["content_type"]
  dataset_name: string
  institution: string
  meshes: {
    name: string
    description: string
    created_at: string
    url: string
    transform: SpatialTransform
    image_id: number
    format: Database["public"]["Enums"]["mesh_format"]
    ids: number[]
  }[]
}

export type PublicationQueryResult = {
  name: string
  url: string
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
  taxa: {
    created_at: string | null
    name: string
    short_name: string
  }[]
  images: ImageQueryResult[]
}


export type Dataset = 
  ToDate<Camelized<DatasetQueryResult>> & {
    tags: OSet<DatasetTag>
  }

export type View = ToDate<Camelized<ViewQueryResult>>
export type Image = Dataset['images'][number]
export type Publication = Dataset['publications'][number]
export type ImageAcquisition = Dataset['imageAcquisition']