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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          ask_amount: number | null
          burn_rate: number | null
          city: string | null
          created_at: string
          customer_segment: string | null
          deck_url: string | null
          email: string
          founder_name: string
          id: string
          monthly_revenue: number | null
          mrr: number | null
          phone: string | null
          pitch: string
          product_service: string | null
          product_stage: string | null
          reviewed_by: string | null
          reviewer_notes: string | null
          sector: string | null
          stage: string | null
          startup_name: string
          status: Database["public"]["Enums"]["submission_status"]
          valuation: number | null
        }
        Insert: {
          ask_amount?: number | null
          burn_rate?: number | null
          city?: string | null
          created_at?: string
          customer_segment?: string | null
          deck_url?: string | null
          email: string
          founder_name: string
          id?: string
          monthly_revenue?: number | null
          mrr?: number | null
          phone?: string | null
          pitch: string
          product_service?: string | null
          product_stage?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          sector?: string | null
          stage?: string | null
          startup_name: string
          status?: Database["public"]["Enums"]["submission_status"]
          valuation?: number | null
        }
        Update: {
          ask_amount?: number | null
          burn_rate?: number | null
          city?: string | null
          created_at?: string
          customer_segment?: string | null
          deck_url?: string | null
          email?: string
          founder_name?: string
          id?: string
          monthly_revenue?: number | null
          mrr?: number | null
          phone?: string | null
          pitch?: string
          product_service?: string | null
          product_stage?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          sector?: string | null
          stage?: string | null
          startup_name?: string
          status?: Database["public"]["Enums"]["submission_status"]
          valuation?: number | null
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          author_id: string
          body: string
          comment_count: number
          created_at: string
          episode_id: string | null
          id: string
          media_url: string | null
          reaction_count: number
          status: Database["public"]["Enums"]["post_status"]
          updated_at: string
        }
        Insert: {
          author_id: string
          body: string
          comment_count?: number
          created_at?: string
          episode_id?: string | null
          id?: string
          media_url?: string | null
          reaction_count?: number
          status?: Database["public"]["Enums"]["post_status"]
          updated_at?: string
        }
        Update: {
          author_id?: string
          body?: string
          comment_count?: number
          created_at?: string
          episode_id?: string | null
          id?: string
          media_url?: string | null
          reaction_count?: number
          status?: Database["public"]["Enums"]["post_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
        ]
      }
      episode_founders: {
        Row: {
          episode_id: string
          feedback: string | null
          founder_id: string
          verdict: Database["public"]["Enums"]["episode_outcome"] | null
        }
        Insert: {
          episode_id: string
          feedback?: string | null
          founder_id: string
          verdict?: Database["public"]["Enums"]["episode_outcome"] | null
        }
        Update: {
          episode_id?: string
          feedback?: string | null
          founder_id?: string
          verdict?: Database["public"]["Enums"]["episode_outcome"] | null
        }
        Relationships: [
          {
            foreignKeyName: "episode_founders_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "episode_founders_founder_id_fkey"
            columns: ["founder_id"]
            isOneToOne: false
            referencedRelation: "founders"
            referencedColumns: ["id"]
          },
        ]
      }
      episode_panelists: {
        Row: {
          episode_id: string
          equity_pct: number | null
          investment_amount: number | null
          notes: string | null
          panelist_id: string
          verdict: string | null
        }
        Insert: {
          episode_id: string
          equity_pct?: number | null
          investment_amount?: number | null
          notes?: string | null
          panelist_id: string
          verdict?: string | null
        }
        Update: {
          episode_id?: string
          equity_pct?: number | null
          investment_amount?: number | null
          notes?: string | null
          panelist_id?: string
          verdict?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "episode_panelists_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "episode_panelists_panelist_id_fkey"
            columns: ["panelist_id"]
            isOneToOne: false
            referencedRelation: "panelists"
            referencedColumns: ["id"]
          },
        ]
      }
      episodes: {
        Row: {
          air_date: string | null
          city: string
          created_at: string
          funded_label: string | null
          hero_img: string | null
          id: string
          lap_time: string | null
          outcome: Database["public"]["Enums"]["episode_outcome"] | null
          recap: string | null
          round_code: string
          sector: string | null
          slug: string
          status: Database["public"]["Enums"]["episode_status"]
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          air_date?: string | null
          city: string
          created_at?: string
          funded_label?: string | null
          hero_img?: string | null
          id?: string
          lap_time?: string | null
          outcome?: Database["public"]["Enums"]["episode_outcome"] | null
          recap?: string | null
          round_code: string
          sector?: string | null
          slug: string
          status?: Database["public"]["Enums"]["episode_status"]
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          air_date?: string | null
          city?: string
          created_at?: string
          funded_label?: string | null
          hero_img?: string | null
          id?: string
          lap_time?: string | null
          outcome?: Database["public"]["Enums"]["episode_outcome"] | null
          recap?: string | null
          round_code?: string
          sector?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["episode_status"]
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      founders: {
        Row: {
          ask: string | null
          bio: string | null
          city: string | null
          created_at: string
          funded_label: string | null
          headshot: string | null
          heat: number | null
          id: string
          name: string
          position: number | null
          position_delta: string | null
          sector: string | null
          slug: string
          stage: string | null
          startup: string
          status: Database["public"]["Enums"]["founder_status"]
          traction: string | null
          updated_at: string
          valuation: string | null
        }
        Insert: {
          ask?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          funded_label?: string | null
          headshot?: string | null
          heat?: number | null
          id?: string
          name: string
          position?: number | null
          position_delta?: string | null
          sector?: string | null
          slug: string
          stage?: string | null
          startup: string
          status?: Database["public"]["Enums"]["founder_status"]
          traction?: string | null
          updated_at?: string
          valuation?: string | null
        }
        Update: {
          ask?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          funded_label?: string | null
          headshot?: string | null
          heat?: number | null
          id?: string
          name?: string
          position?: number | null
          position_delta?: string | null
          sector?: string | null
          slug?: string
          stage?: string | null
          startup?: string
          status?: Database["public"]["Enums"]["founder_status"]
          traction?: string | null
          updated_at?: string
          valuation?: string | null
        }
        Relationships: []
      }
      panelists: {
        Row: {
          aka: string | null
          appetite: string | null
          aum: string | null
          bio: string | null
          city: string | null
          created_at: string
          deals: number | null
          firm: string | null
          headshot: string | null
          id: string
          name: string
          quote: string | null
          record_kos: number | null
          record_wins: number | null
          roast_meter: number | null
          slug: string
          tag: string | null
          updated_at: string
          years: number | null
        }
        Insert: {
          aka?: string | null
          appetite?: string | null
          aum?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          deals?: number | null
          firm?: string | null
          headshot?: string | null
          id?: string
          name: string
          quote?: string | null
          record_kos?: number | null
          record_wins?: number | null
          roast_meter?: number | null
          slug: string
          tag?: string | null
          updated_at?: string
          years?: number | null
        }
        Update: {
          aka?: string | null
          appetite?: string | null
          aum?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          deals?: number | null
          firm?: string | null
          headshot?: string | null
          id?: string
          name?: string
          quote?: string | null
          record_kos?: number | null
          record_wins?: number | null
          roast_meter?: number | null
          slug?: string
          tag?: string | null
          updated_at?: string
          years?: number | null
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          author_id: string
          body: string
          created_at: string
          id: string
          post_id: string
          status: Database["public"]["Enums"]["post_status"]
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          id?: string
          post_id: string
          status?: Database["public"]["Enums"]["post_status"]
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          id?: string
          post_id?: string
          status?: Database["public"]["Enums"]["post_status"]
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reactions: {
        Row: {
          created_at: string
          kind: Database["public"]["Enums"]["reaction_kind"]
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          kind: Database["public"]["Enums"]["reaction_kind"]
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          kind?: Database["public"]["Enums"]["reaction_kind"]
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          handle: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          handle?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          handle?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          id: string
          reason: string
          reporter_id: string
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["report_status"]
          target_id: string
          target_type: Database["public"]["Enums"]["report_target"]
        }
        Insert: {
          created_at?: string
          id?: string
          reason: string
          reporter_id: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          target_id: string
          target_type: Database["public"]["Enums"]["report_target"]
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string
          reporter_id?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          target_id?: string
          target_type?: Database["public"]["Enums"]["report_target"]
        }
        Relationships: []
      }
      sponsor_inquiries: {
        Row: {
          brand: string
          budget_range: string | null
          contact_name: string
          created_at: string
          email: string
          id: string
          message: string | null
          phone: string | null
          status: Database["public"]["Enums"]["submission_status"]
          tier: string | null
        }
        Insert: {
          brand: string
          budget_range?: string | null
          contact_name: string
          created_at?: string
          email: string
          id?: string
          message?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          tier?: string | null
        }
        Update: {
          brand?: string
          budget_range?: string | null
          contact_name?: string
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          tier?: string | null
        }
        Relationships: []
      }
      sponsor_packages: {
        Row: {
          active: boolean
          color: string | null
          created_at: string
          id: string
          name: string
          price: string
          scope: string
          sort_order: number
          tier: string
          units: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          color?: string | null
          created_at?: string
          id?: string
          name: string
          price: string
          scope: string
          sort_order?: number
          tier: string
          units?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          price?: string
          scope?: string
          sort_order?: number
          tier?: string
          units?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sponsor_partners: {
        Row: {
          active: boolean
          created_at: string
          id: string
          logo_url: string | null
          name: string
          sort_order: number
          updated_at: string
          website: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          sort_order?: number
          updated_at?: string
          website?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          sort_order?: number
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      ticket_inquiries: {
        Row: {
          created_at: string
          email: string
          episode_round: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          seats: number
          status: Database["public"]["Enums"]["submission_status"]
          tier: string
        }
        Insert: {
          created_at?: string
          email: string
          episode_round?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          seats?: number
          status?: Database["public"]["Enums"]["submission_status"]
          tier: string
        }
        Update: {
          created_at?: string
          email?: string
          episode_round?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          seats?: number
          status?: Database["public"]["Enums"]["submission_status"]
          tier?: string
        }
        Relationships: []
      }
      user_bans: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          reason: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      episode_outcome:
        | "TERMINATED"
        | "TERM SHEET"
        | "VIRAL"
        | "STANDING OVATION"
        | "WALK-OFF"
      episode_status: "draft" | "scheduled" | "aired"
      founder_status: "active" | "eliminated" | "champion" | "withdrew"
      post_status: "live" | "removed" | "pending"
      reaction_kind: "fire" | "roast" | "clap"
      report_status: "open" | "resolved" | "dismissed"
      report_target: "post" | "comment"
      submission_status:
        | "new"
        | "reviewing"
        | "accepted"
        | "rejected"
        | "archived"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["admin", "moderator", "user"],
      episode_outcome: [
        "TERMINATED",
        "TERM SHEET",
        "VIRAL",
        "STANDING OVATION",
        "WALK-OFF",
      ],
      episode_status: ["draft", "scheduled", "aired"],
      founder_status: ["active", "eliminated", "champion", "withdrew"],
      post_status: ["live", "removed", "pending"],
      reaction_kind: ["fire", "roast", "clap"],
      report_status: ["open", "resolved", "dismissed"],
      report_target: ["post", "comment"],
      submission_status: [
        "new",
        "reviewing",
        "accepted",
        "rejected",
        "archived",
      ],
    },
  },
} as const
