/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Name = string;
export type Title = string;
export type Id = string;
export type Id1 = string;
export type Institution = string;
export type Unit = string;
export type Startdate = string;
export type Duration = number;
export type Biasvoltage = number;
export type Scanrate = number;
export type Current = number;
export type Primaryenergy = number;
export type Description = string;
export type Protocol = string;
export type Contributions = string;
export type Organism = string[];
export type Type = string[];
export type Subtype = string[];
export type Treatment = string[];
export type Institution1 = string[];
/**
 * An enumeration.
 */
export type SoftwareAvailability = "open" | "partially open" | "closed";
export type Id2 = string;
export type Doi1 = string;
export type Doi = DOI[];
export type Href = string;
export type Title1 = string;
export type Publications = (Hyperlink | string)[];
export type Name1 = string;
export type Description1 = string;
export type Url = string;
/**
 * An enumeration.
 */
export type ArrayContainerTypeEnum = "n5" | "zarr" | "precomputed";
export type Axes = string[];
export type Units = string[];
export type Translate = number[];
export type Scale = number[];
/**
 * An enumeration.
 */
export type SampleTypeEnum = "scalar" | "label";
/**
 * An enumeration.
 */
export type ContentTypeEnum = "em" | "lm" | "prediction" | "segmentation" | "analysis";
export type Start = number;
export type End = number;
export type Min = number;
export type Max = number;
export type Color = string;
export type Invertlut = boolean;
export type Name2 = string;
export type Description2 = string;
export type Url1 = string;
/**
 * Strings representing supported mesh formats
 */
export type MeshTypeEnum = "neuroglancer_legacy_mesh" | "neuroglancer_multilod_draco";
export type Ids = number[];
export type Subsources = MeshSource[];
export type Name3 = string;
export type Description3 = string;
export type Sources1 = string[];
export type Position = number[];
export type Scale1 = number;
export type Orientation = number[];
export type Views = DatasetView[];

export interface DatasetManifest {
  name: Name;
  metadata: DatasetMetadata;
  sources: Sources;
  views: Views;
}
/**
 * Metadata for a bioimaging dataset.
 */
export interface DatasetMetadata {
  title: Title;
  id: Id;
  imaging: FIBSEMImagingMetadata;
  sample: SampleMetadata;
  institution: Institution1;
  softwareAvailability: SoftwareAvailability;
  DOI: Doi;
  publications: Publications;
}
/**
 * Metadata describing the FIB-SEM imaging process.
 */
export interface FIBSEMImagingMetadata {
  id: Id1;
  institution: Institution;
  gridSpacing: UnitfulVector;
  dimensions: UnitfulVector;
  startDate: Startdate;
  duration: Duration;
  biasVoltage: Biasvoltage;
  scanRate: Scanrate;
  current: Current;
  primaryEnergy: Primaryenergy;
}
export interface UnitfulVector {
  unit: Unit;
  values: Values;
}
export interface Values {
  [k: string]: number;
}
/**
 * Metadata describing the sample and sample preparation.
 */
export interface SampleMetadata {
  description: Description;
  protocol: Protocol;
  contributions: Contributions;
  organism: Organism;
  type: Type;
  subtype: Subtype;
  treatment: Treatment;
}
export interface DOI {
  id: Id2;
  DOI: Doi1;
}
export interface Hyperlink {
  href: Href;
  title: Title1;
}
export interface Sources {
  [k: string]: VolumeSource;
}
export interface VolumeSource {
  name: Name1;
  description: Description1;
  url: Url;
  format: ArrayContainerTypeEnum;
  transform: SpatialTransform;
  sampleType: SampleTypeEnum;
  contentType: ContentTypeEnum;
  displaySettings: DisplaySettings;
  subsources: Subsources;
}
/**
 * Representation of an N-dimensional scaling + translation transform for labelled axes with units.
 */
export interface SpatialTransform {
  axes: Axes;
  units: Units;
  translate: Translate;
  scale: Scale;
}
/**
 * Metadata for display settings
 */
export interface DisplaySettings {
  contrastLimits: ContrastLimits;
  color?: Color;
  invertLUT: Invertlut;
}
export interface ContrastLimits {
  start: Start;
  end: End;
  min: Min;
  max: Max;
}
export interface MeshSource {
  name: Name2;
  description: Description2;
  url: Url1;
  format: MeshTypeEnum;
  transform: SpatialTransform;
  ids: Ids;
}
export interface DatasetView {
  name: Name3;
  description: Description3;
  sources: Sources1;
  position?: Position;
  scale?: Scale1;
  orientation?: Orientation;
}
