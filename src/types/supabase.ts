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
          is_published: boolean
          sample: Json
          created_at: string
          acquisition_id: number
        }
        Insert: {
          id?: number
          name: string
          description: string
          thumbnail_url: string
          is_published: boolean
          sample: Json
          created_at?: string
          acquisition_id: number
        }
        Update: {
          id?: number
          name?: string
          description?: string
          thumbnail_url?: string
          is_published?: boolean
          sample?: Json
          created_at?: string
          acquisition_id?: number
        }
      }
      image: {
        Row: {
          id: number
          name: string
          description: string
          url: string
          format: Database["public"]["Enums"]["array_container_format"]
          transform: Json
          display_settings: Json
          created_at: string
          sample_type: Database["public"]["Enums"]["sample_type"]
          content_type: Database["public"]["Enums"]["content_type"]
          dataset_name: string
          institution: string
        }
        Insert: {
          id?: number
          name: string
          description: string
          url: string
          format: Database["public"]["Enums"]["array_container_format"]
          transform: Json
          display_settings: Json
          created_at?: string
          sample_type: Database["public"]["Enums"]["sample_type"]
          content_type: Database["public"]["Enums"]["content_type"]
          dataset_name: string
          institution: string
        }
        Update: {
          id?: number
          name?: string
          description?: string
          url?: string
          format?: Database["public"]["Enums"]["array_container_format"]
          transform?: Json
          display_settings?: Json
          created_at?: string
          sample_type?: Database["public"]["Enums"]["sample_type"]
          content_type?: Database["public"]["Enums"]["content_type"]
          dataset_name?: string
          institution?: string
        }
      }
      image_acquisition: {
        Row: {
          id: number
          name: string
          institution: string
          start_date: string
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
          start_date: string
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
          start_date?: string
          grid_axes?: string[]
          grid_spacing?: number[]
          grid_spacing_unit?: string
          grid_dimensions?: number[]
          grid_dimensions_unit?: string
        }
      }
      mesh: {
        Row: {
          id: number
          name: string
          description: string
          created_at: string
          url: string
          transform: Json
          image_id: number
          format: Database["public"]["Enums"]["mesh_format"]
          ids: number[]
        }
        Insert: {
          id?: number
          name: string
          description: string
          created_at?: string
          url: string
          transform: Json
          image_id: number
          format: Database["public"]["Enums"]["mesh_format"]
          ids: number[]
        }
        Update: {
          id?: number
          name?: string
          description?: string
          created_at?: string
          url?: string
          transform?: Json
          image_id?: number
          format?: Database["public"]["Enums"]["mesh_format"]
          ids?: number[]
        }
      }
      publication: {
        Row: {
          id: number
          name: string
          url: string
          type: Database["public"]["Enums"]["publication_type"]
        }
        Insert: {
          id?: number
          name: string
          url: string
          type: Database["public"]["Enums"]["publication_type"]
        }
        Update: {
          id?: number
          name?: string
          url?: string
          type?: Database["public"]["Enums"]["publication_type"]
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
        }
        Insert: {
          id?: number
          created_at?: string | null
          name: string
          short_name: string
        }
        Update: {
          id?: number
          created_at?: string | null
          name?: string
          short_name?: string
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
          tags: string[] | null
          dataset_name: string
          thumbnail_url: string | null
        }
        Insert: {
          id?: number
          name: string
          description: string
          created_at?: string
          position?: number[] | null
          scale?: number | null
          orientation?: number[] | null
          tags?: string[] | null
          dataset_name: string
          thumbnail_url?: string | null
        }
        Update: {
          id?: number
          name?: string
          description?: string
          created_at?: string
          position?: number[] | null
          scale?: number | null
          orientation?: number[] | null
          tags?: string[] | null
          dataset_name?: string
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
      json_matches_schema: {
        Args: { schema: Json; instance: Json }
        Returns: boolean
      }
      jsonb_matches_schema: {
        Args: { schema: Json; instance: Json }
        Returns: boolean
      }
    }
    Enums: {
      array_container_format: "n5" | "zarr" | "precomputed"
      content_type: "lm" | "prediction" | "segmentation" | "em" | "analysis"
      mesh_format: "neuroglancer_multilod_draco" | "neuroglancer_legacy_mesh"
      publication_type: "paper" | "doi"
      sample_type: "scalar" | "label"
    }
  }
}
