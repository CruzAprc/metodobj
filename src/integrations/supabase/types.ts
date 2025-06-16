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
      dieta: {
        Row: {
          almoco: Json | null
          ativa: boolean | null
          cafe_da_manha: Json | null
          calorias_totais: number | null
          ceia: Json | null
          created_at: string
          descricao: string | null
          id: string
          jantar: Json | null
          lanche: Json | null
          nome_dieta: string
          refeicoes: Json
          universal_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          almoco?: Json | null
          ativa?: boolean | null
          cafe_da_manha?: Json | null
          calorias_totais?: number | null
          ceia?: Json | null
          created_at?: string
          descricao?: string | null
          id?: string
          jantar?: Json | null
          lanche?: Json | null
          nome_dieta: string
          refeicoes?: Json
          universal_id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          almoco?: Json | null
          ativa?: boolean | null
          cafe_da_manha?: Json | null
          calorias_totais?: number | null
          ceia?: Json | null
          created_at?: string
          descricao?: string | null
          id?: string
          jantar?: Json | null
          lanche?: Json | null
          nome_dieta?: string
          refeicoes?: Json
          universal_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      evaluation_photos: {
        Row: {
          ai_analysis: Json | null
          created_at: string | null
          evaluation_period: string
          id: string
          photo_type: string | null
          photo_url: string
          universal_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_analysis?: Json | null
          created_at?: string | null
          evaluation_period: string
          id?: string
          photo_type?: string | null
          photo_url: string
          universal_id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_analysis?: Json | null
          created_at?: string | null
          evaluation_period?: string
          id?: string
          photo_type?: string | null
          photo_url?: string
          universal_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      teste_app: {
        Row: {
          created_at: string | null
          data_registro: string | null
          email: string | null
          id: string
          nome: string | null
          universal_id: string
          updated_at: string | null
          user_id: string
          whatsapp: string | null
        }
        Insert: {
          created_at?: string | null
          data_registro?: string | null
          email?: string | null
          id?: string
          nome?: string | null
          universal_id?: string
          updated_at?: string | null
          user_id: string
          whatsapp?: string | null
        }
        Update: {
          created_at?: string | null
          data_registro?: string | null
          email?: string | null
          id?: string
          nome?: string | null
          universal_id?: string
          updated_at?: string | null
          user_id?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      treino: {
        Row: {
          ativo: boolean | null
          created_at: string
          descricao: string | null
          domingo: Json | null
          id: string
          nome_plano: string | null
          quarta_feira: Json | null
          quinta_feira: Json | null
          quiz_data: Json | null
          sabado: Json | null
          segunda_feira: Json | null
          sexta_feira: Json | null
          terca_feira: Json | null
          treino_a: Json | null
          treino_b: Json | null
          treino_c: Json | null
          treino_d: Json | null
          treino_e: Json | null
          universal_id: string
          updated_at: string
          user_id: string
          webhook_received_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string
          descricao?: string | null
          domingo?: Json | null
          id?: string
          nome_plano?: string | null
          quarta_feira?: Json | null
          quinta_feira?: Json | null
          quiz_data?: Json | null
          sabado?: Json | null
          segunda_feira?: Json | null
          sexta_feira?: Json | null
          terca_feira?: Json | null
          treino_a?: Json | null
          treino_b?: Json | null
          treino_c?: Json | null
          treino_d?: Json | null
          treino_e?: Json | null
          universal_id?: string
          updated_at?: string
          user_id: string
          webhook_received_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string
          descricao?: string | null
          domingo?: Json | null
          id?: string
          nome_plano?: string | null
          quarta_feira?: Json | null
          quinta_feira?: Json | null
          quiz_data?: Json | null
          sabado?: Json | null
          segunda_feira?: Json | null
          sexta_feira?: Json | null
          terca_feira?: Json | null
          treino_a?: Json | null
          treino_b?: Json | null
          treino_c?: Json | null
          treino_d?: Json | null
          treino_e?: Json | null
          universal_id?: string
          updated_at?: string
          user_id?: string
          webhook_received_at?: string | null
        }
        Relationships: []
      }
      user_complete_data: {
        Row: {
          all_data_completed: boolean | null
          altura: number | null
          created_at: string
          dados_pessoais_completed: boolean | null
          id: string
          idade: number | null
          nome_completo: string | null
          peso: number | null
          quiz_alimentar_completed: boolean | null
          quiz_alimentar_completed_at: string | null
          quiz_alimentar_data: Json | null
          quiz_treino_completed: boolean | null
          quiz_treino_completed_at: string | null
          quiz_treino_data: Json | null
          universal_id: string
          updated_at: string
          user_id: string
          webhook_response: Json | null
          webhook_sent: boolean | null
          webhook_sent_at: string | null
        }
        Insert: {
          all_data_completed?: boolean | null
          altura?: number | null
          created_at?: string
          dados_pessoais_completed?: boolean | null
          id?: string
          idade?: number | null
          nome_completo?: string | null
          peso?: number | null
          quiz_alimentar_completed?: boolean | null
          quiz_alimentar_completed_at?: string | null
          quiz_alimentar_data?: Json | null
          quiz_treino_completed?: boolean | null
          quiz_treino_completed_at?: string | null
          quiz_treino_data?: Json | null
          universal_id?: string
          updated_at?: string
          user_id: string
          webhook_response?: Json | null
          webhook_sent?: boolean | null
          webhook_sent_at?: string | null
        }
        Update: {
          all_data_completed?: boolean | null
          altura?: number | null
          created_at?: string
          dados_pessoais_completed?: boolean | null
          id?: string
          idade?: number | null
          nome_completo?: string | null
          peso?: number | null
          quiz_alimentar_completed?: boolean | null
          quiz_alimentar_completed_at?: string | null
          quiz_alimentar_data?: Json | null
          quiz_treino_completed?: boolean | null
          quiz_treino_completed_at?: string | null
          quiz_treino_data?: Json | null
          universal_id?: string
          updated_at?: string
          user_id?: string
          webhook_response?: Json | null
          webhook_sent?: boolean | null
          webhook_sent_at?: string | null
        }
        Relationships: []
      }
      user_daily_progress: {
        Row: {
          created_at: string | null
          date: string
          dieta_seguida: boolean | null
          id: string
          treino_realizado: boolean | null
          universal_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          dieta_seguida?: boolean | null
          id?: string
          treino_realizado?: boolean | null
          universal_id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          dieta_seguida?: boolean | null
          id?: string
          treino_realizado?: boolean | null
          universal_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_evaluation_access: {
        Row: {
          created_at: string | null
          days_required: number | null
          id: string
          is_unlocked: boolean | null
          universal_id: string
          unlock_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          days_required?: number | null
          id?: string
          is_unlocked?: boolean | null
          universal_id?: string
          unlock_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          days_required?: number | null
          id?: string
          is_unlocked?: boolean | null
          universal_id?: string
          unlock_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          record_id: string | null
          table_reference: string | null
          universal_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          record_id?: string | null
          table_reference?: string | null
          universal_id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          record_id?: string | null
          table_reference?: string | null
          universal_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_personal_data: {
        Row: {
          altura: number | null
          completed_at: string | null
          created_at: string | null
          data_nascimento: string | null
          historico_medico: string | null
          id: string
          idade: number | null
          nivel_atividade: string | null
          nome_completo: string | null
          objetivo_principal: string | null
          peso: number | null
          peso_atual: number | null
          restricoes_alimentares: string | null
          sexo: string | null
          universal_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          altura?: number | null
          completed_at?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          historico_medico?: string | null
          id?: string
          idade?: number | null
          nivel_atividade?: string | null
          nome_completo?: string | null
          objetivo_principal?: string | null
          peso?: number | null
          peso_atual?: number | null
          restricoes_alimentares?: string | null
          sexo?: string | null
          universal_id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          altura?: number | null
          completed_at?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          historico_medico?: string | null
          id?: string
          idade?: number | null
          nivel_atividade?: string | null
          nome_completo?: string | null
          objetivo_principal?: string | null
          peso?: number | null
          peso_atual?: number | null
          restricoes_alimentares?: string | null
          sexo?: string | null
          universal_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_quiz_data: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          quiz_data: Json
          quiz_type: string
          universal_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          quiz_data: Json
          quiz_type: string
          universal_id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          quiz_data?: Json
          quiz_type?: string
          universal_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      log_user_event: {
        Args: {
          p_user_id: string
          p_event_type: string
          p_event_data?: Json
          p_table_reference?: string
          p_record_id?: string
        }
        Returns: string
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
