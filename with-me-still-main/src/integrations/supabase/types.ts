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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          actor: string
          id: string
          input_hash: string | null
          metadata: Json | null
          policy_refs: string[]
          result: string
          session_id: string
          ts: string
        }
        Insert: {
          action: string
          actor: string
          id?: string
          input_hash?: string | null
          metadata?: Json | null
          policy_refs?: string[]
          result: string
          session_id: string
          ts?: string
        }
        Update: {
          action?: string
          actor?: string
          id?: string
          input_hash?: string | null
          metadata?: Json | null
          policy_refs?: string[]
          result?: string
          session_id?: string
          ts?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      check_ins: {
        Row: {
          created_at: string
          energy_level: number | null
          id: string
          mood_score: number | null
          notes: string | null
          session_id: string
          skipped: boolean | null
          sleep_quality: number | null
          stress_level: number | null
        }
        Insert: {
          created_at?: string
          energy_level?: number | null
          id?: string
          mood_score?: number | null
          notes?: string | null
          session_id: string
          skipped?: boolean | null
          sleep_quality?: number | null
          stress_level?: number | null
        }
        Update: {
          created_at?: string
          energy_level?: number | null
          id?: string
          mood_score?: number | null
          notes?: string | null
          session_id?: string
          skipped?: boolean | null
          sleep_quality?: number | null
          stress_level?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "check_ins_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      crisis_events: {
        Row: {
          created_at: string
          detected_signals: string[]
          id: string
          message_id: string | null
          resources_shown: Json
          session_id: string
          trigger_content: string
        }
        Insert: {
          created_at?: string
          detected_signals: string[]
          id?: string
          message_id?: string | null
          resources_shown: Json
          session_id: string
          trigger_content: string
        }
        Update: {
          created_at?: string
          detected_signals?: string[]
          id?: string
          message_id?: string | null
          resources_shown?: Json
          session_id?: string
          trigger_content?: string
        }
        Relationships: [
          {
            foreignKeyName: "crisis_events_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crisis_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      memories: {
        Row: {
          consent: Json | null
          content: string | null
          created_at: string
          emotion: Json | null
          id: string
          memory_type: string
          metadata: Json | null
          session_id: string
          source: string | null
          source_message_id: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          consent?: Json | null
          content?: string | null
          created_at?: string
          emotion?: Json | null
          id?: string
          memory_type: string
          metadata?: Json | null
          session_id: string
          source?: string | null
          source_message_id?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          consent?: Json | null
          content?: string | null
          created_at?: string
          emotion?: Json | null
          id?: string
          memory_type?: string
          metadata?: Json | null
          session_id?: string
          source?: string | null
          source_message_id?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "memories_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memories_source_message_id_fkey"
            columns: ["source_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_crisis_flagged: boolean | null
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_crisis_flagged?: boolean | null
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_crisis_flagged?: boolean | null
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      nebulae: {
        Row: {
          created_at: string
          dominant_emotion: string | null
          id: string
          label: string
          memory_ids: string[]
          session_id: string
          summary: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          dominant_emotion?: string | null
          id?: string
          label: string
          memory_ids?: string[]
          session_id: string
          summary?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          dominant_emotion?: string | null
          id?: string
          label?: string
          memory_ids?: string[]
          session_id?: string
          summary?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nebulae_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          anonymous_id: string | null
          companion_name: string | null
          companion_traits: Json | null
          created_at: string
          id: string
          onboarding_completed: boolean | null
          region: string | null
          theme: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          anonymous_id?: string | null
          companion_name?: string | null
          companion_traits?: Json | null
          created_at?: string
          id?: string
          onboarding_completed?: boolean | null
          region?: string | null
          theme?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          anonymous_id?: string | null
          companion_name?: string | null
          companion_traits?: Json | null
          created_at?: string
          id?: string
          onboarding_completed?: boolean | null
          region?: string | null
          theme?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      thought_loop: {
        Row: {
          id: string
          open_loops: string[]
          recent_entries: Json
          session_id: string
          themes: string[]
          updated_at: string
        }
        Insert: {
          id?: string
          open_loops?: string[]
          recent_entries?: Json
          session_id: string
          themes?: string[]
          updated_at?: string
        }
        Update: {
          id?: string
          open_loops?: string[]
          recent_entries?: Json
          session_id?: string
          themes?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "thought_loop_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
