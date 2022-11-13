
import { Database as Schema, Json } from "./supabase";

export type Modify<T, R> = Omit<T, keyof R> & R

type Tables = Schema["public"]["Tables"]

export type DisplaySettings = {
    contrastLimits: {min: number,
                     max: number,
                     start: number,
                     end: number};
    color: string | null;
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

type DatasetRow = Modify<Tables["dataset"]["Row"], {sample: Sample}>
type ImageRow = Modify<Tables["image"]["Row"], {transform: SpatialTransform, display_settings: DisplaySettings}>
type MeshRow = Modify<Tables["mesh"]["Row"], {transform: SpatialTransform}>

type DatasetTable = Modify<Tables["dataset"], {Row: DatasetRow}>
type ImageTable = Modify<Tables["image"], {Row: ImageRow}>
type MeshTable = Modify<Tables["mesh"], {Row: MeshRow}>

type TablesModified = Modify<Schema["public"]["Tables"], {dataset: DatasetTable,
                                                          image: ImageTable,
                                                          mesh: MeshTable}>
type PublicModified = Modify<Schema["public"], {Tables: TablesModified}>

export type Database = Modify<Schema, {public: PublicModified}>