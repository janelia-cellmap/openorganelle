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
          content_type: string
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
          content_type: string
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
          content_type?: string
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
          grid_axes: string[] | null
          grid_spacing: number[] | null
          grid_spacing_unit: string
          grid_dimensions: number[] | null
          grid_dimensions_unit: string
        }
        Insert: {
          id?: number
          name: string
          institution: string
          start_date: string
          grid_axes?: string[] | null
          grid_spacing?: number[] | null
          grid_spacing_unit: string
          grid_dimensions?: number[] | null
          grid_dimensions_unit: string
        }
        Update: {
          id?: number
          name?: string
          institution?: string
          start_date?: string
          grid_axes?: string[] | null
          grid_spacing?: number[] | null
          grid_spacing_unit?: string
          grid_dimensions?: number[] | null
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
        }
        Insert: {
          id?: number
          name: string
          description: string
          created_at?: string
          url: string
          transform: Json
          image_id: number
        }
        Update: {
          id?: number
          name?: string
          description?: string
          created_at?: string
          url?: string
          transform?: Json
          image_id?: number
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
    }
    Views: {
      image_out: {
        Row: {
          dataset_name: string | null
          name: string | null
          description: string | null
          url: string | null
          transform: Json | null
          displaySettings: Json | null
          sampleType: Database["public"]["Enums"]["sample_type"] | null
          contentType: string | null
          institution: string | null
          format: Database["public"]["Enums"]["array_container_format"] | null
        }
        Insert: {
          dataset_name?: string | null
          name?: string | null
          description?: string | null
          url?: string | null
          transform?: Json | null
          displaySettings?: Json | null
          sampleType?: Database["public"]["Enums"]["sample_type"] | null
          contentType?: string | null
          institution?: string | null
          format?: Database["public"]["Enums"]["array_container_format"] | null
        }
        Update: {
          dataset_name?: string | null
          name?: string | null
          description?: string | null
          url?: string | null
          transform?: Json | null
          displaySettings?: Json | null
          sampleType?: Database["public"]["Enums"]["sample_type"] | null
          contentType?: string | null
          institution?: string | null
          format?: Database["public"]["Enums"]["array_container_format"] | null
        }
      }
      test_view: {
        Row: {
          name: string | null
          images: Json | null
          description: string | null
          views: Json | null
          sample: Json | null
          created_at: string | null
          publications: Json | null
          imageAcquisition: Json | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      array_container_format: "N5" | "ZARR" | "NEUROGLANCER_PRECOMPUTED"
      publication_type: "PAPER" | "DOI"
      sample_type: "SCALAR" | "LABEL"
    }
  }
}
