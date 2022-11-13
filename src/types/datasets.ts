import { DatasetTag, OSet } from "./tags";

export type ArrayContainerFormat = "n5" 
                                 | "zarr" 
                                 | "precomputed";

export type ContentType = "em" 
                        | "lm" 
                        | "prediction" 
                        | "segmentation" 
                        | "analysis";

export type ContrastLimits = {
      start: number;
      end: number;
      min: number;
      max: number;
    }

export type Dataset = {
      name: string;
      description: string;
      institutions: string[];
      softwareAvailability: SoftwareAvailability;
      acquisition: FIBSEMAcquisition
      sample: Sample
      publications: Publication[];
      images: Image[];
      thumbnailUrl: string;
      published: boolean;
      tags?: OSet<DatasetTag>
    }

export type DisplaySettings = {
      contrastLimits: ContrastLimits
      color?: string;
      invertLut: boolean;
    }

export type FIBSEMAcquisition = {
      name: string
      institution: string
      startDate?: string
      gridSpacing: UnitfulVector
      dimensions: UnitfulVector
      durationDays?: number
      biasVoltage?: number
      scanRate?: number
      current?: number
      primaryEnergy?: number
}

export type Image = {
      name: string;
      description: string;
      url: string;
      format: ArrayContainerFormat
      transform: SpatialTransform
      sampleType: SampleType
      contentType: ContentType
      displaySettings: DisplaySettings;
      meshes: Mesh[]
    }

export type Mesh = {
      name: string;
      description: string;
      url: string;
      format: MeshFormat
      transform: SpatialTransform
      ids: number[];
    };

export type MeshFormat = "neuroglancer_legacy_mesh" | "neuroglancer_multilod_draco";

export type Publication = {
      name: string;
      type: PublicationType
      url: string;
    }
export type PublicationType = "doi" | "paper";

export type Sample = {
      description: string;
      protocol: string;
      contributions: string;
      organism: string[];
      type: string[];
      subtype: string[];
      treatment: string[];
    }

export type SampleType = "scalar" | "label";

export type SoftwareAvailability = "open" | "partially open" | "closed";

export type SpatialTransform = {
      axes: string[];
      units: string[];
      translate: number[];
      scale: number[];
    }
export type UnitfulVector = {
      unit: string;
      values: { [key: string]: number };
    }
export type View = {
      name: string;
      description: string;
      images: Image[];
      position?: number[];
      scale?: number;
      orientation?: number[];
      thumbnailUrl? : string
    }

export type LayerType = "image" | "segmentation"