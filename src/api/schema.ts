/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/datasets/": {
    get: operations["get_datasets_datasets__get"];
  };
  "/datasets/{dataset_name}": {
    get: operations["get_dataset_by_name_datasets__dataset_name__get"];
  };
}

export interface components {
  schemas: {
    /**
     * ArrayContainerTypeEnum
     * @description An enumeration.
     * @enum {string}
     */
    ArrayContainerTypeEnum: "n5" | "zarr" | "precomputed";
    /**
     * ContentTypeEnum
     * @description An enumeration.
     * @enum {string}
     */
    ContentTypeEnum: "em" | "lm" | "prediction" | "segmentation" | "analysis";
    /** ContrastLimits */
    ContrastLimits: {
      /** Start */
      start: number;
      /** End */
      end: number;
      /** Min */
      min: number;
      /** Max */
      max: number;
    };
    /** Dataset */
    Dataset: {
      /** Name */
      name: string;
      /** Description */
      description: string;
      /** Institutions */
      institutions: string[];
      software_availability: components["schemas"]["SoftwareAvailability"];
      acquisition?: components["schemas"]["FIBSEMAcquisition"];
      sample?: components["schemas"]["Sample"];
      /** Publications */
      publications: components["schemas"]["Publication"][];
      /** Volumes */
      volumes: components["schemas"]["Volume"][];
      /** Views */
      views: components["schemas"]["View"][];
    };
    /**
     * DisplaySettings
     * @description Metadata for display settings
     */
    DisplaySettings: {
      contrast_limits: components["schemas"]["ContrastLimits"];
      /**
       * Color
       * Format: color
       */
      color?: string;
      /** Invert Lut */
      invert_lut: boolean;
    };
    /**
     * FIBSEMAcquisition
     * @description Metadata describing the FIB-SEM imaging process.
     */
    FIBSEMAcquisition: {
      /** Name */
      name: string;
      /** Institution */
      institution: string;
      /**
       * Start Date
       * Format: date
       */
      start_date?: string;
      grid_spacing: components["schemas"]["UnitfulVector"];
      dimensions: components["schemas"]["UnitfulVector"];
      /** Duration Days */
      duration_days?: number;
      /** Bias Voltage */
      bias_voltage?: number;
      /** Scan Rate */
      scan_rate?: number;
      /** Current */
      current?: number;
      /** Primary Energy */
      primary_energy?: number;
    };
    /** HTTPValidationError */
    HTTPValidationError: {
      /** Detail */
      detail?: components["schemas"]["ValidationError"][];
    };
    /** Mesh */
    Mesh: {
      /** Name */
      name: string;
      /** Description */
      description: string;
      /** Url */
      url: string;
      format: components["schemas"]["MeshTypeEnum"];
      transform: components["schemas"]["SpatialTransform"];
      /** Ids */
      ids: number[];
    };
    /**
     * MeshTypeEnum
     * @description Strings representing supported mesh formats
     * @enum {string}
     */
    MeshTypeEnum: "neuroglancer_legacy_mesh" | "neuroglancer_multilod_draco";
    /** Publication */
    Publication: {
      /** Name */
      name: string;
      type: components["schemas"]["PublicationTypeEnum"];
      /**
       * Url
       * Format: uri
       */
      url: string;
    };
    /**
     * PublicationTypeEnum
     * @description An enumeration.
     * @enum {string}
     */
    PublicationTypeEnum: "doi" | "paper";
    /**
     * Sample
     * @description Metadata describing the sample and sample preparation.
     */
    Sample: {
      /** Description */
      description: string;
      /** Protocol */
      protocol: string;
      /** Contributions */
      contributions: string;
      /** Organism */
      organism: string[];
      /** Type */
      type: string[];
      /** Subtype */
      subtype: string[];
      /** Treatment */
      treatment: string[];
    };
    /**
     * SampleTypeEnum
     * @description An enumeration.
     * @enum {string}
     */
    SampleTypeEnum: "scalar" | "label";
    /**
     * SoftwareAvailability
     * @description An enumeration.
     * @enum {string}
     */
    SoftwareAvailability: "open" | "partially open" | "closed";
    /**
     * SpatialTransform
     * @description Representation of an N-dimensional scaling + translation transform for labelled axes with units.
     */
    SpatialTransform: {
      /** Axes */
      axes: string[];
      /** Units */
      units: string[];
      /** Translate */
      translate: number[];
      /** Scale */
      scale: number[];
    };
    /** UnitfulVector */
    UnitfulVector: {
      /** Unit */
      unit: string;
      /** Values */
      values: { [key: string]: number };
    };
    /** ValidationError */
    ValidationError: {
      /** Location */
      loc: (Partial<string> & Partial<number>)[];
      /** Message */
      msg: string;
      /** Error Type */
      type: string;
    };
    /** View */
    View: {
      /** Name */
      name: string;
      /** Description */
      description: string;
      /** Source Names */
      source_names: string[];
      /** Position */
      position?: number[];
      /** Scale */
      scale?: number;
      /** Orientation */
      orientation?: number[];
    };
    /** Volume */
    Volume: {
      /** Name */
      name: string;
      /** Description */
      description: string;
      /** Url */
      url: string;
      format: components["schemas"]["ArrayContainerTypeEnum"];
      transform: components["schemas"]["SpatialTransform"];
      sample_type: components["schemas"]["SampleTypeEnum"];
      content_type: components["schemas"]["ContentTypeEnum"];
      display_settings: components["schemas"]["DisplaySettings"];
      /** Subsources */
      subsources: components["schemas"]["Mesh"][];
    };
  };
}

export interface operations {
  get_datasets_datasets__get: {
    parameters: {
      query: {
        skip: number;
        limit: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["Dataset"][];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  get_dataset_by_name_datasets__dataset_name__get: {
    parameters: {
      path: {
        dataset_name: string;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["Dataset"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
}

export interface external {}
