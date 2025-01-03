export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
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
          name: string
          sample_id: number | null
          stage: Database["public"]["Enums"]["stage"]
          thumbnail_url: string
          segmentation_challenge: boolean
        }
        Insert: {
          acquisition_id: number
          created_at?: string
          description: string
          id?: number
          name: string
          sample_id?: number | null
          stage?: Database["public"]["Enums"]["stage"]
          thumbnail_url: string
          segmentation_challenge: boolean
        }
        Update: {
          acquisition_id?: number
          created_at?: string
          description?: string
          id?: number
          name?: string
          sample_id?: number | null
          stage?: Database["public"]["Enums"]["stage"]
          thumbnail_url?: string
          segmentation_challenge: boolean
        }
        Relationships: [
          {
            foreignKeyName: "dataset_acquisition_id_fkey"
            columns: ["acquisition_id"]
            isOneToOne: false
            referencedRelation: "image_acquisition"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dataset_sample_id_fkey"
            columns: ["sample_id"]
            isOneToOne: false
            referencedRelation: "sample"
            referencedColumns: ["id"]
          }
        ]
      }
      fibsem_acquisition: {
        Row: {
          fib_milling_thickness_nm: number | null
          id: number
          instrument: string | null
          notes: string | null
          sem_bias_v: number | null
          sem_current_na: number | null
          sem_dwell_time_ms: number | null
          sem_primary_energy_ev: number | null
          sem_sampling_rate_mhz: number | null
          sem_x_step_nm: number | null
          sem_y_step_nm: number | null
          start_date: string | null
          stop_date: string | null
        }
        Insert: {
          fib_milling_thickness_nm?: number | null
          id?: number
          instrument?: string | null
          notes?: string | null
          sem_bias_v?: number | null
          sem_current_na?: number | null
          sem_dwell_time_ms?: number | null
          sem_primary_energy_ev?: number | null
          sem_sampling_rate_mhz?: number | null
          sem_x_step_nm?: number | null
          sem_y_step_nm?: number | null
          start_date?: string | null
          stop_date?: string | null
        }
        Update: {
          fib_milling_thickness_nm?: number | null
          id?: number
          instrument?: string | null
          notes?: string | null
          sem_bias_v?: number | null
          sem_current_na?: number | null
          sem_dwell_time_ms?: number | null
          sem_primary_energy_ev?: number | null
          sem_sampling_rate_mhz?: number | null
          sem_x_step_nm?: number | null
          sem_y_step_nm?: number | null
          start_date?: string | null
          stop_date?: string | null
        }
        Relationships: []
      }
      image: {
        Row: {
          content_type: Database["public"]["Enums"]["content_type"]
          created_at: string
          dataset_name: string
          description: string
          display_settings: Json
          format: Database["public"]["Enums"]["array_container_format"]
          grid_dims: string[]
          grid_index_order: string
          grid_scale: number[]
          grid_translation: number[]
          grid_units: string[]
          id: number
          institution: string
          name: string
          sample_type: Database["public"]["Enums"]["sample_type"]
          source: Json | null
          stage: Database["public"]["Enums"]["stage"]
          url: string
          image_stack: string
        }
        Insert: {
          content_type: Database["public"]["Enums"]["content_type"]
          created_at?: string
          dataset_name: string
          description: string
          display_settings: Json
          format: Database["public"]["Enums"]["array_container_format"]
          grid_dims: string[]
          grid_index_order?: string
          grid_scale: number[]
          grid_translation: number[]
          grid_units: string[]
          id?: number
          institution: string
          name: string
          sample_type: Database["public"]["Enums"]["sample_type"]
          source?: Json | null
          stage?: Database["public"]["Enums"]["stage"]
          url: string
          image_stack: string
        }
        Update: {
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string
          dataset_name?: string
          description?: string
          display_settings?: Json
          format?: Database["public"]["Enums"]["array_container_format"]
          grid_dims?: string[]
          grid_index_order?: string
          grid_scale?: number[]
          grid_translation?: number[]
          grid_units?: string[]
          id?: number
          institution?: string
          name?: string
          sample_type?: Database["public"]["Enums"]["sample_type"]
          source?: Json | null
          stage?: Database["public"]["Enums"]["stage"]
          url?: string
          image_stack?: string
        }
        Relationships: [
          {
            foreignKeyName: "image_dataset_name_fkey"
            columns: ["dataset_name"]
            isOneToOne: false
            referencedRelation: "dataset"
            referencedColumns: ["name"]
          }
        ]
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
          start_date: string | null
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
          start_date?: string | null
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
          start_date?: string | null
        }
        Relationships: []
      }
      imagery: {
        Row: {
          content_type: Database["public"]["Enums"]["content_type"]
          coordinate_space: string
          created_at: string
          dataset_name: string
          description: string
          display_settings: Json
          format: Database["public"]["Enums"]["imagery_format"]
          grid_dims: string[]
          grid_index_order: string
          grid_scale: number[]
          grid_translation: number[]
          grid_units: string[]
          id: number
          institution: string
          name: string
          sample_type: Database["public"]["Enums"]["sample_type"]
          source: Json
          stage: Database["public"]["Enums"]["stage"]
          url: string
        }
        Insert: {
          content_type: Database["public"]["Enums"]["content_type"]
          coordinate_space?: string
          created_at?: string
          dataset_name: string
          description: string
          display_settings?: Json
          format: Database["public"]["Enums"]["imagery_format"]
          grid_dims: string[]
          grid_index_order?: string
          grid_scale: number[]
          grid_translation: number[]
          grid_units: string[]
          id?: number
          institution: string
          name: string
          sample_type: Database["public"]["Enums"]["sample_type"]
          source?: Json
          stage?: Database["public"]["Enums"]["stage"]
          url: string
        }
        Update: {
          content_type?: Database["public"]["Enums"]["content_type"]
          coordinate_space?: string
          created_at?: string
          dataset_name?: string
          description?: string
          display_settings?: Json
          format?: Database["public"]["Enums"]["imagery_format"]
          grid_dims?: string[]
          grid_index_order?: string
          grid_scale?: number[]
          grid_translation?: number[]
          grid_units?: string[]
          id?: number
          institution?: string
          name?: string
          sample_type?: Database["public"]["Enums"]["sample_type"]
          source?: Json
          stage?: Database["public"]["Enums"]["stage"]
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "imagery_dataset_name_fkey"
            columns: ["dataset_name"]
            isOneToOne: false
            referencedRelation: "dataset"
            referencedColumns: ["name"]
          }
        ]
      }
      mesh: {
        Row: {
          created_at: string
          description: string
          format: Database["public"]["Enums"]["mesh_format"]
          grid_dims: string[]
          grid_index_order: string
          grid_scale: number[]
          grid_translation: number[]
          grid_units: string[]
          id: number
          ids: number[]
          image_id: number
          name: string
          source: Json | null
          stage: Database["public"]["Enums"]["stage"]
          url: string
        }
        Insert: {
          created_at?: string
          description: string
          format: Database["public"]["Enums"]["mesh_format"]
          grid_dims: string[]
          grid_index_order?: string
          grid_scale: number[]
          grid_translation: number[]
          grid_units: string[]
          id?: number
          ids: number[]
          image_id: number
          name: string
          source?: Json | null
          stage?: Database["public"]["Enums"]["stage"]
          url: string
        }
        Update: {
          created_at?: string
          description?: string
          format?: Database["public"]["Enums"]["mesh_format"]
          grid_dims?: string[]
          grid_index_order?: string
          grid_scale?: number[]
          grid_translation?: number[]
          grid_units?: string[]
          id?: number
          ids?: number[]
          image_id?: number
          name?: string
          source?: Json | null
          stage?: Database["public"]["Enums"]["stage"]
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "mesh_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "image"
            referencedColumns: ["id"]
          }
        ]
      }
      publication: {
        Row: {
          id: number
          name: string
          stage: Database["public"]["Enums"]["stage"]
          type: Database["public"]["Enums"]["publication_type"]
          url: string
        }
        Insert: {
          id?: number
          name: string
          stage?: Database["public"]["Enums"]["stage"]
          type: Database["public"]["Enums"]["publication_type"]
          url: string
        }
        Update: {
          id?: number
          name?: string
          stage?: Database["public"]["Enums"]["stage"]
          type?: Database["public"]["Enums"]["publication_type"]
          url?: string
        }
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "publication_to_dataset_dataset_name_fkey"
            columns: ["dataset_name"]
            isOneToOne: false
            referencedRelation: "dataset"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "publication_to_dataset_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publication"
            referencedColumns: ["id"]
          }
        ]
      }
      sample: {
        Row: {
          contributions: string
          description: string
          id: number
          name: string
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
          name: string
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
          name?: string
          organism?: string[] | null
          protocol?: string
          subtype?: string[] | null
          treatment?: string[] | null
          type?: string[] | null
        }
        Relationships: []
      }
      taxon: {
        Row: {
          created_at: string | null
          id: number
          name: string
          short_name: string
          stage: Database["public"]["Enums"]["stage"]
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          short_name: string
          stage?: Database["public"]["Enums"]["stage"]
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          short_name?: string
          stage?: Database["public"]["Enums"]["stage"]
        }
        Relationships: []
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
          stage: Database["public"]["Enums"]["stage"]
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
          stage?: Database["public"]["Enums"]["stage"]
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
          stage?: Database["public"]["Enums"]["stage"]
          thumbnail_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "view_dataset_name_fkey"
            columns: ["dataset_name"]
            isOneToOne: false
            referencedRelation: "dataset"
            referencedColumns: ["name"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "view_to_image_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "image"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "view_to_image_view_id_fkey"
            columns: ["view_id"]
            isOneToOne: false
            referencedRelation: "view"
            referencedColumns: ["id"]
          }
        ]
      }
      view_to_imagery: {
        Row: {
          display_settings: Json
          imagery_id: number
          view_id: number
        }
        Insert: {
          display_settings?: Json
          imagery_id: number
          view_id: number
        }
        Update: {
          display_settings?: Json
          imagery_id?: number
          view_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "view_to_imagery_image_id_fkey"
            columns: ["imagery_id"]
            isOneToOne: false
            referencedRelation: "imagery"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "view_to_imagery_view_id_fkey"
            columns: ["view_id"]
            isOneToOne: false
            referencedRelation: "view"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "view_to_taxon_taxon_id_fkey"
            columns: ["taxon_id"]
            isOneToOne: false
            referencedRelation: "taxon"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "view_to_taxon_view_id_fkey"
            columns: ["view_id"]
            isOneToOne: false
            referencedRelation: "view"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      display: {
        min: number
        max: number
      }
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
