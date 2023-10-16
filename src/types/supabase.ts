export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      dataset: {
        Row: {
          id: number
          name: string
          description: string
          thumbnail_url: string
          created_at: string
          acquisition_id: number
          sample_id: number | null
          stage: Database["public"]["Enums"]["stage"]
        }
        Insert: {
          id?: number
          name: string
          description: string
          thumbnail_url: string
          created_at?: string
          acquisition_id: number
          sample_id?: number | null
          stage?: Database["public"]["Enums"]["stage"]
        }
        Update: {
          id?: number
          name?: string
          description?: string
          thumbnail_url?: string
          created_at?: string
          acquisition_id?: number
          sample_id?: number | null
          stage?: Database["public"]["Enums"]["stage"]
        }
      }
      fibsem_acquisition: {
        Row: {
          id: number
          instrument: string | null
          start_date: string | null
          stop_date: string | null
          fib_milling_thickness_nm: number | null
          sem_y_step_nm: number | null
          sem_x_step_nm: number | null
          sem_sampling_rate_mhz: number | null
          sem_primary_energy_ev: number | null
          sem_dwell_time_ms: number | null
          sem_current_na: number | null
          sem_bias_v: number | null
          notes: string | null
        }
        Insert: {
          id?: number
          instrument?: string | null
          start_date?: string | null
          stop_date?: string | null
          fib_milling_thickness_nm?: number | null
          sem_y_step_nm?: number | null
          sem_x_step_nm?: number | null
          sem_sampling_rate_mhz?: number | null
          sem_primary_energy_ev?: number | null
          sem_dwell_time_ms?: number | null
          sem_current_na?: number | null
          sem_bias_v?: number | null
          notes?: string | null
        }
        Update: {
          id?: number
          instrument?: string | null
          start_date?: string | null
          stop_date?: string | null
          fib_milling_thickness_nm?: number | null
          sem_y_step_nm?: number | null
          sem_x_step_nm?: number | null
          sem_sampling_rate_mhz?: number | null
          sem_primary_energy_ev?: number | null
          sem_dwell_time_ms?: number | null
          sem_current_na?: number | null
          sem_bias_v?: number | null
          notes?: string | null
        }
      }
      image: {
        Row: {
          id: number
          name: string
          description: string
          url: string
          format: Database["public"]["Enums"]["array_container_format"]
          display_settings: Json
          created_at: string
          sample_type: Database["public"]["Enums"]["sample_type"]
          content_type: Database["public"]["Enums"]["content_type"]
          dataset_name: string
          institution: string
          source: Json | null
          grid_dims: string[]
          grid_scale: number[]
          grid_translation: number[]
          grid_units: string[]
          grid_index_order: string
          stage: Database["public"]["Enums"]["stage"]
        }
        Insert: {
          id?: number
          name: string
          description: string
          url: string
          format: Database["public"]["Enums"]["array_container_format"]
          display_settings: Json
          created_at?: string
          sample_type: Database["public"]["Enums"]["sample_type"]
          content_type: Database["public"]["Enums"]["content_type"]
          dataset_name: string
          institution: string
          source?: Json | null
          grid_dims: string[]
          grid_scale: number[]
          grid_translation: number[]
          grid_units: string[]
          grid_index_order?: string
          stage?: Database["public"]["Enums"]["stage"]
        }
        Update: {
          id?: number
          name?: string
          description?: string
          url?: string
          format?: Database["public"]["Enums"]["array_container_format"]
          display_settings?: Json
          created_at?: string
          sample_type?: Database["public"]["Enums"]["sample_type"]
          content_type?: Database["public"]["Enums"]["content_type"]
          dataset_name?: string
          institution?: string
          source?: Json | null
          grid_dims?: string[]
          grid_scale?: number[]
          grid_translation?: number[]
          grid_units?: string[]
          grid_index_order?: string
          stage?: Database["public"]["Enums"]["stage"]
        }
      }
      image_acquisition: {
        Row: {
          id: number
          name: string
          institution: string
          start_date: string | null
          grid_axes: string[]
          grid_spacing: number[]
          grid_spacing_unit: string
          grid_dimensions: number[]
          grid_dimensions_unit: string
        }
        Insert: {
          id?: number
          name: string
          institution: string
          start_date?: string | null
          grid_axes: string[]
          grid_spacing: number[]
          grid_spacing_unit: string
          grid_dimensions: number[]
          grid_dimensions_unit: string
        }
        Update: {
          id?: number
          name?: string
          institution?: string
          start_date?: string | null
          grid_axes?: string[]
          grid_spacing?: number[]
          grid_spacing_unit?: string
          grid_dimensions?: number[]
          grid_dimensions_unit?: string
        }
      }
      imagery: {
        Row: {
          id: number
          name: string
          description: string
          url: string
          format: Database["public"]["Enums"]["imagery_format"]
          display_settings: Json
          created_at: string
          sample_type: Database["public"]["Enums"]["sample_type"]
          content_type: Database["public"]["Enums"]["content_type"]
          dataset_name: string
          institution: string
          source: Json
          grid_dims: string[]
          grid_scale: number[]
          grid_translation: number[]
          grid_units: string[]
          grid_index_order: string
          coordinate_space: string
          stage: Database["public"]["Enums"]["stage"]
        }
        Insert: {
          id?: number
          name: string
          description: string
          url: string
          format: Database["public"]["Enums"]["imagery_format"]
          display_settings?: Json
          created_at?: string
          sample_type: Database["public"]["Enums"]["sample_type"]
          content_type: Database["public"]["Enums"]["content_type"]
          dataset_name: string
          institution: string
          source?: Json
          grid_dims: string[]
          grid_scale: number[]
          grid_translation: number[]
          grid_units: string[]
          grid_index_order?: string
          coordinate_space?: string
          stage?: Database["public"]["Enums"]["stage"]
        }
        Update: {
          id?: number
          name?: string
          description?: string
          url?: string
          format?: Database["public"]["Enums"]["imagery_format"]
          display_settings?: Json
          created_at?: string
          sample_type?: Database["public"]["Enums"]["sample_type"]
          content_type?: Database["public"]["Enums"]["content_type"]
          dataset_name?: string
          institution?: string
          source?: Json
          grid_dims?: string[]
          grid_scale?: number[]
          grid_translation?: number[]
          grid_units?: string[]
          grid_index_order?: string
          coordinate_space?: string
          stage?: Database["public"]["Enums"]["stage"]
        }
      }
      mesh: {
        Row: {
          id: number
          name: string
          description: string
          created_at: string
          url: string
          image_id: number
          format: Database["public"]["Enums"]["mesh_format"]
          ids: number[]
          source: Json | null
          grid_dims: string[]
          grid_scale: number[]
          grid_translation: number[]
          grid_units: string[]
          grid_index_order: string
          stage: Database["public"]["Enums"]["stage"]
        }
        Insert: {
          id?: number
          name: string
          description: string
          created_at?: string
          url: string
          image_id: number
          format: Database["public"]["Enums"]["mesh_format"]
          ids: number[]
          source?: Json | null
          grid_dims: string[]
          grid_scale: number[]
          grid_translation: number[]
          grid_units: string[]
          grid_index_order?: string
          stage?: Database["public"]["Enums"]["stage"]
        }
        Update: {
          id?: number
          name?: string
          description?: string
          created_at?: string
          url?: string
          image_id?: number
          format?: Database["public"]["Enums"]["mesh_format"]
          ids?: number[]
          source?: Json | null
          grid_dims?: string[]
          grid_scale?: number[]
          grid_translation?: number[]
          grid_units?: string[]
          grid_index_order?: string
          stage?: Database["public"]["Enums"]["stage"]
        }
      }
      publication: {
        Row: {
          id: number
          name: string
          url: string
          type: Database["public"]["Enums"]["publication_type"]
          stage: Database["public"]["Enums"]["stage"]
        }
        Insert: {
          id?: number
          name: string
          url: string
          type: Database["public"]["Enums"]["publication_type"]
          stage?: Database["public"]["Enums"]["stage"]
        }
        Update: {
          id?: number
          name?: string
          url?: string
          type?: Database["public"]["Enums"]["publication_type"]
          stage?: Database["public"]["Enums"]["stage"]
        }
      }
      publication_to_dataset: {
        Row: {
          dataset_name: string
          publication_id: number
        }
        Insert: {
          dataset_name: string
          publication_id: number
        }
        Update: {
          dataset_name?: string
          publication_id?: number
        }
      }
      sample: {
        Row: {
          id: number
          name: string
          description: string
          protocol: string
          contributions: string
          organism: string[] | null
          type: string[] | null
          subtype: string[] | null
          treatment: string[] | null
        }
        Insert: {
          id?: number
          name: string
          description: string
          protocol: string
          contributions: string
          organism?: string[] | null
          type?: string[] | null
          subtype?: string[] | null
          treatment?: string[] | null
        }
        Update: {
          id?: number
          name?: string
          description?: string
          protocol?: string
          contributions?: string
          organism?: string[] | null
          type?: string[] | null
          subtype?: string[] | null
          treatment?: string[] | null
        }
      }
      taxon: {
        Row: {
          id: number
          created_at: string | null
          name: string
          short_name: string
          stage: Database["public"]["Enums"]["stage"]
        }
        Insert: {
          id?: number
          created_at?: string | null
          name: string
          short_name: string
          stage?: Database["public"]["Enums"]["stage"]
        }
        Update: {
          id?: number
          created_at?: string | null
          name?: string
          short_name?: string
          stage?: Database["public"]["Enums"]["stage"]
        }
      }
      view: {
        Row: {
          id: number
          name: string
          description: string
          created_at: string
          position: number[] | null
          scale: number | null
          orientation: number[] | null
          dataset_name: string
          thumbnail_url: string | null
          stage: Database["public"]["Enums"]["stage"]
        }
        Insert: {
          id?: number
          name: string
          description: string
          created_at?: string
          position?: number[] | null
          scale?: number | null
          orientation?: number[] | null
          dataset_name: string
          thumbnail_url?: string | null
          stage?: Database["public"]["Enums"]["stage"]
        }
        Update: {
          id?: number
          name?: string
          description?: string
          created_at?: string
          position?: number[] | null
          scale?: number | null
          orientation?: number[] | null
          dataset_name?: string
          thumbnail_url?: string | null
          stage?: Database["public"]["Enums"]["stage"]
        }
      }
      view_to_image: {
        Row: {
          image_id: number
          view_id: number
        }
        Insert: {
          image_id: number
          view_id: number
        }
        Update: {
          image_id?: number
          view_id?: number
        }
      }
      view_to_imagery: {
        Row: {
          imagery_id: number
          view_id: number
          display_settings: Json
        }
        Insert: {
          imagery_id: number
          view_id: number
          display_settings?: Json
        }
        Update: {
          imagery_id?: number
          view_id?: number
          display_settings?: Json
        }
      }
      view_to_taxon: {
        Row: {
          view_id: number
          taxon_id: number
        }
        Insert: {
          view_id: number
          taxon_id: number
        }
        Update: {
          view_id?: number
          taxon_id?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      array_container_format: "n5" | "zarr" | "precomputed"
      content_type:
        | "lm"
        | "prediction"
        | "segmentation"
        | "em"
        | "analysis"
        | "annotation"
        | "mesh"
      imagery_format:
        | "n5"
        | "zarr"
        | "neuroglancer_precomputed"
        | "neuroglancer_multilod_draco"
        | "neuroglancer_legacy_mesh"
      mesh_format: "neuroglancer_multilod_draco" | "neuroglancer_legacy_mesh"
      publication_type: "paper" | "doi"
      sample_type: "scalar" | "label" | "geometry"
      stage: "dev" | "prod"
    }
  }
}

