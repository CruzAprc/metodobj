export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      arsenal_nutricional: {
        Row: {
          almoco: Json | null
          cafe_da_manha: Json | null
          ceia: Json | null
          created_at: string
          id: number
          jantar: Json | null
          lanche_da_manha: Json | null
          lanche_da_tarde: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          almoco?: Json | null
          cafe_da_manha?: Json | null
          ceia?: Json | null
          created_at?: string
          id?: number
          jantar?: Json | null
          lanche_da_manha?: Json | null
          lanche_da_tarde?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          almoco?: Json | null
          cafe_da_manha?: Json | null
          ceia?: Json | null
          created_at?: string
          id?: number
          jantar?: Json | null
          lanche_da_manha?: Json | null
          lanche_da_tarde?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "arsenal_nutricional_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      operacao_fitness: {
        Row: {
          created_at: string
          domingo: Json | null
          id: number
          quarta_feira: Json | null
          quinta_feira: Json | null
          sabado: Json | null
          segunda_feira: Json | null
          sexta_feira: Json | null
          terca_feira: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          domingo?: Json | null
          id?: number
          quarta_feira?: Json | null
          quinta_feira?: Json | null
          sabado?: Json | null
          segunda_feira?: Json | null
          sexta_feira?: Json | null
          terca_feira?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          domingo?: Json | null
          id?: number
          quarta_feira?: Json | null
          quinta_feira?: Json | null
          sabado?: Json | null
          segunda_feira?: Json | null
          sexta_feira?: Json | null
          terca_feira?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "operacao_fitness_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      ragnutri: {
        Row: {
          content: string | null
          embedding: string | null
          fts: unknown | null
          id: number
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          fts?: unknown | null
          id?: never
        }
        Update: {
          content?: string | null
          embedding?: string | null
          fts?: unknown | null
          id?: never
        }
        Relationships: []
      }
      ragtreino: {
        Row: {
          content: string | null
          embedding: string | null
          fts: unknown | null
          id: number
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          fts?: unknown | null
          id?: never
        }
        Update: {
          content?: string | null
          embedding?: string | null
          fts?: unknown | null
          id?: never
        }
        Relationships: []
      }
      user_access_control: {
        Row: {
          created_at: string
          first_month_unlocked_at: string | null
          fourth_month_unlocked_at: string | null
          id: string
          interaction_days: number | null
          last_daily_mission_reset: string | null
          last_interaction_date: string | null
          last_photo_evaluation_at: string | null
          morale_percentage: number | null
          photo_evaluation_blocked_until: string | null
          second_month_unlocked_at: string | null
          third_month_unlocked_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          first_month_unlocked_at?: string | null
          fourth_month_unlocked_at?: string | null
          id?: string
          interaction_days?: number | null
          last_daily_mission_reset?: string | null
          last_interaction_date?: string | null
          last_photo_evaluation_at?: string | null
          morale_percentage?: number | null
          photo_evaluation_blocked_until?: string | null
          second_month_unlocked_at?: string | null
          third_month_unlocked_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          first_month_unlocked_at?: string | null
          fourth_month_unlocked_at?: string | null
          id?: string
          interaction_days?: number | null
          last_daily_mission_reset?: string | null
          last_interaction_date?: string | null
          last_photo_evaluation_at?: string | null
          morale_percentage?: number | null
          photo_evaluation_blocked_until?: string | null
          second_month_unlocked_at?: string | null
          third_month_unlocked_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_access_control_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      user_daily_missions: {
        Row: {
          alimentacao_completed: boolean
          all_missions_completed_at: string | null
          created_at: string
          descanso_completed: boolean
          hidratacao_completed: boolean
          id: string
          mission_date: string
          treino_matinal_completed: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          alimentacao_completed?: boolean
          all_missions_completed_at?: string | null
          created_at?: string
          descanso_completed?: boolean
          hidratacao_completed?: boolean
          id?: string
          mission_date?: string
          treino_matinal_completed?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          alimentacao_completed?: boolean
          all_missions_completed_at?: string | null
          created_at?: string
          descanso_completed?: boolean
          hidratacao_completed?: boolean
          id?: string
          mission_date?: string
          treino_matinal_completed?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          acao_combate_rejeitados: string[] | null
          acao_matinal_rejeitados: string[] | null
          acao_noturna_rejeitados: string[] | null
          acao_principal_rejeitados: string[] | null
          acao_vespertina_rejeitados: string[] | null
          altura: number | null
          auth_user_id: string
          created_at: string
          diet_quiz_completed: boolean | null
          id: string
          idade: number | null
          nome: string | null
          peso: number | null
          question_1: string | null
          question_2: string | null
          question_3: string | null
          question_4: string | null
          question_5: string | null
          question_6: string | null
          question_7: string | null
          question_8: string | null
          updated_at: string
        }
        Insert: {
          acao_combate_rejeitados?: string[] | null
          acao_matinal_rejeitados?: string[] | null
          acao_noturna_rejeitados?: string[] | null
          acao_principal_rejeitados?: string[] | null
          acao_vespertina_rejeitados?: string[] | null
          altura?: number | null
          auth_user_id: string
          created_at?: string
          diet_quiz_completed?: boolean | null
          id?: string
          idade?: number | null
          nome?: string | null
          peso?: number | null
          question_1?: string | null
          question_2?: string | null
          question_3?: string | null
          question_4?: string | null
          question_5?: string | null
          question_6?: string | null
          question_7?: string | null
          question_8?: string | null
          updated_at?: string
        }
        Update: {
          acao_combate_rejeitados?: string[] | null
          acao_matinal_rejeitados?: string[] | null
          acao_noturna_rejeitados?: string[] | null
          acao_principal_rejeitados?: string[] | null
          acao_vespertina_rejeitados?: string[] | null
          altura?: number | null
          auth_user_id?: string
          created_at?: string
          diet_quiz_completed?: boolean | null
          id?: string
          idade?: number | null
          nome?: string | null
          peso?: number | null
          question_1?: string | null
          question_2?: string | null
          question_3?: string | null
          question_4?: string | null
          question_5?: string | null
          question_6?: string | null
          question_7?: string | null
          question_8?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          access_expires_at: string | null
          auth_user_id: string | null
          created_at: string
          email: string
          first_access_at: string | null
          id: string
          is_access_blocked: boolean | null
          last_payment_at: string | null
          nome: string
          numero: string
          payment_status: string | null
          senha: string
          updated_at: string
        }
        Insert: {
          access_expires_at?: string | null
          auth_user_id?: string | null
          created_at?: string
          email: string
          first_access_at?: string | null
          id?: string
          is_access_blocked?: boolean | null
          last_payment_at?: string | null
          nome: string
          numero: string
          payment_status?: string | null
          senha: string
          updated_at?: string
        }
        Update: {
          access_expires_at?: string | null
          auth_user_id?: string | null
          created_at?: string
          email?: string
          first_access_at?: string | null
          id?: string
          is_access_blocked?: boolean | null
          last_payment_at?: string | null
          nome?: string
          numero?: string
          payment_status?: string | null
          senha?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      calculate_morale_percentage: {
        Args: { days_interacted: number }
        Returns: number
      }
      calculate_rank_from_days: {
        Args: { account_created_at: string }
        Returns: string
      }
      change_user_password: {
        Args: {
          p_email: string
          p_old_password: string
          p_new_password: string
        }
        Returns: Json
      }
      check_user_access_expired: {
        Args: { user_auth_id: string }
        Returns: boolean
      }
      get_user_access_info: {
        Args: { user_auth_id: string }
        Returns: Json
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      hybrid_search: {
        Args: {
          query_text: string
          query_embedding: string
          match_count: number
          full_text_weight?: number
          semantic_weight?: number
          rrf_k?: number
        }
        Returns: {
          content: string | null
          embedding: string | null
          fts: unknown | null
          id: number
        }[]
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      renew_user_access: {
        Args: { user_auth_id: string; days_to_add?: number }
        Returns: Json
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
