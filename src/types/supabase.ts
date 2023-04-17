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
          acquisition_id: number
          created_at: string
          description: string
          id: number
          is_published: boolean
          name: string
          sample_id: number | null
          sample_json: Json
          thumbnail_url: string
        }
        Insert: {
          acquisition_id: number
          created_at?: string
          description: string
          id?: number
          is_published: boolean
          name: string
          sample_id?: number | null
          sample_json: Json
          thumbnail_url: string
        }
        Update: {
          acquisition_id?: number
          created_at?: string
          description?: string
          id?: number
          is_published?: boolean
          name?: string
          sample_id?: number | null
          sample_json?: Json
          thumbnail_url?: string
        }
      }
      image: {
        Row: {
          content_type: Database["public"]["Enums"]["content_type"]
          created_at: string
          dataset_name: string
          description: string
          display_settings: Json
          format: Database["public"]["Enums"]["array_container_format"]
          id: number
          institution: string
          name: string
          sample_type: Database["public"]["Enums"]["sample_type"]
          transform: Json
          url: string
        }
        Insert: {
          content_type: Database["public"]["Enums"]["content_type"]
          created_at?: string
          dataset_name: string
          description: string
          display_settings: Json
          format: Database["public"]["Enums"]["array_container_format"]
          id?: number
          institution: string
          name: string
          sample_type: Database["public"]["Enums"]["sample_type"]
          transform: Json
          url: string
        }
        Update: {
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string
          dataset_name?: string
          description?: string
          display_settings?: Json
          format?: Database["public"]["Enums"]["array_container_format"]
          id?: number
          institution?: string
          name?: string
          sample_type?: Database["public"]["Enums"]["sample_type"]
          transform?: Json
          url?: string
        }
      }
      image_acquisition: {
        Row: {
          grid_axes: string[]
          grid_dimensions: number[]
          grid_dimensions_unit: string
          grid_spacing: number[]
          grid_spacing_unit: string
          id: number
          institution: string
          name: string
          start_date: string
        }
        Insert: {
          grid_axes: string[]
          grid_dimensions: number[]
          grid_dimensions_unit: string
          grid_spacing: number[]
          grid_spacing_unit: string
          id?: number
          institution: string
          name: string
          start_date: string
        }
        Update: {
          grid_axes?: string[]
          grid_dimensions?: number[]
          grid_dimensions_unit?: string
          grid_spacing?: number[]
          grid_spacing_unit?: string
          id?: number
          institution?: string
          name?: string
          start_date?: string
        }
      }
      mesh: {
        Row: {
          created_at: string
          description: string
          format: Database["public"]["Enums"]["mesh_format"]
          id: number
          ids: number[]
          image_id: number
          name: string
          transform: Json
          url: string
        }
        Insert: {
          created_at?: string
          description: string
          format: Database["public"]["Enums"]["mesh_format"]
          id?: number
          ids: number[]
          image_id: number
          name: string
          transform: Json
          url: string
        }
        Update: {
          created_at?: string
          description?: string
          format?: Database["public"]["Enums"]["mesh_format"]
          id?: number
          ids?: number[]
          image_id?: number
          name?: string
          transform?: Json
          url?: string
        }
      }
      publication: {
        Row: {
          id: number
          name: string
          type: Database["public"]["Enums"]["publication_type"]
          url: string
        }
        Insert: {
          id?: number
          name: string
          type: Database["public"]["Enums"]["publication_type"]
          url: string
        }
        Update: {
          id?: number
          name?: string
          type?: Database["public"]["Enums"]["publication_type"]
          url?: string
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
          contributions: string
          description: string
          id: number
          organism: string[] | null
          protocol: string
          subtype: string[] | null
          treatment: string[] | null
          type: string[] | null
        }
        Insert: {
          contributions: string
          description: string
          id?: number
          organism?: string[] | null
          protocol: string
          subtype?: string[] | null
          treatment?: string[] | null
          type?: string[] | null
        }
        Update: {
          contributions?: string
          description?: string
          id?: number
          organism?: string[] | null
          protocol?: string
          subtype?: string[] | null
          treatment?: string[] | null
          type?: string[] | null
        }
      }
      taxon: {
        Row: {
          created_at: string | null
          id: number
          name: string
          short_name: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          short_name: string
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          short_name?: string
        }
      }
      view: {
        Row: {
          created_at: string
          dataset_name: string
          description: string
          id: number
          name: string
          orientation: number[] | null
          position: number[] | null
          scale: number | null
          thumbnail_url: string | null
        }
        Insert: {
          created_at?: string
          dataset_name: string
          description: string
          id?: number
          name: string
          orientation?: number[] | null
          position?: number[] | null
          scale?: number | null
          thumbnail_url?: string | null
        }
        Update: {
          created_at?: string
          dataset_name?: string
          description?: string
          id?: number
          name?: string
          orientation?: number[] | null
          position?: number[] | null
          scale?: number | null
          thumbnail_url?: string | null
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
      view_to_taxon: {
        Row: {
          taxon_id: number
          view_id: number
        }
        Insert: {
          taxon_id: number
          view_id: number
        }
        Update: {
          taxon_id?: number
          view_id?: number
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
      content_type: "lm" | "prediction" | "segmentation" | "em" | "analysis"
      mesh_format: "neuroglancer_multilod_draco" | "neuroglancer_legacy_mesh"
      publication_type: "paper" | "doi"
      sample_type: "scalar" | "label"
    }
    CompositeTypes: {
      display: {
        min: number
        max: number
      }
    }
  }
}
