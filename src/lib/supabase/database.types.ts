export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      agents: {
        Row: {
          created_at: string
          id: number
          name: string
          phone: string
          photo_url: string | null
          whatsapp: string
        }
        Insert: {
          created_at?: string
          id?: never
          name: string
          phone: string
          photo_url?: string | null
          whatsapp: string
        }
        Update: {
          created_at?: string
          id?: never
          name?: string
          phone?: string
          photo_url?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      auctions: {
        Row: {
          created_at: string
          department: string
          id: number
          image_url: string | null
          notes: string | null
          number: number
          starts_at: string
          status: Database["public"]["Enums"]["auction_status"]
          type: Database["public"]["Enums"]["auction_type"]
          venue: string
        }
        Insert: {
          created_at?: string
          department: string
          id?: never
          image_url?: string | null
          notes?: string | null
          number: number
          starts_at: string
          status?: Database["public"]["Enums"]["auction_status"]
          type: Database["public"]["Enums"]["auction_type"]
          venue: string
        }
        Update: {
          created_at?: string
          department?: string
          id?: never
          image_url?: string | null
          notes?: string | null
          number?: number
          starts_at?: string
          status?: Database["public"]["Enums"]["auction_status"]
          type?: Database["public"]["Enums"]["auction_type"]
          venue?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string | null
          id: number
          message: string
          name: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: never
          message: string
          name: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: never
          message?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      lot_photos: {
        Row: {
          id: number
          lot_id: number
          position: number
          url: string
        }
        Insert: {
          id?: never
          lot_id: number
          position?: number
          url: string
        }
        Update: {
          id?: never
          lot_id?: number
          position?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "lot_photos_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "lots"
            referencedColumns: ["id"]
          },
        ]
      }
      lots: {
        Row: {
          agent_id: number | null
          auction_id: number
          avg_weight_kg: number
          breed: string
          category: Database["public"]["Enums"]["lot_category"]
          created_at: string
          department: string
          description: string | null
          head_count: number
          id: number
          latitude: number | null
          location_label: string | null
          longitude: number | null
          number: number
          video_url: string | null
        }
        Insert: {
          agent_id?: number | null
          auction_id: number
          avg_weight_kg: number
          breed: string
          category: Database["public"]["Enums"]["lot_category"]
          created_at?: string
          department: string
          description?: string | null
          head_count: number
          id?: never
          latitude?: number | null
          location_label?: string | null
          longitude?: number | null
          number: number
          video_url?: string | null
        }
        Update: {
          agent_id?: number | null
          auction_id?: number
          avg_weight_kg?: number
          breed?: string
          category?: Database["public"]["Enums"]["lot_category"]
          created_at?: string
          department?: string
          description?: string | null
          head_count?: number
          id?: never
          latitude?: number | null
          location_label?: string | null
          longitude?: number | null
          number?: number
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lots_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lots_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auction_summaries"
            referencedColumns: ["auction_id"]
          },
          {
            foreignKeyName: "lots_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      auction_summaries: {
        Row: {
          auction_id: number | null
          categories: Database["public"]["Enums"]["lot_category"][] | null
          head_count: number | null
          lot_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      auction_status: "upcoming" | "live" | "finished"
      auction_type: "screen" | "fair"
      lot_category: "calves" | "steers" | "heifers" | "cows"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      auction_status: ["upcoming", "live", "finished"],
      auction_type: ["screen", "fair"],
      lot_category: ["calves", "steers", "heifers", "cows"],
    },
  },
} as const
