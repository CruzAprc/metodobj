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
      anuncio_ads: {
        Row: {
          ad_id: string
          influencer_id: number
          midia_type: string | null
          plataforma_anuncio: string
          url_anuncio: string | null
        }
        Insert: {
          ad_id: string
          influencer_id: number
          midia_type?: string | null
          plataforma_anuncio: string
          url_anuncio?: string | null
        }
        Update: {
          ad_id?: string
          influencer_id?: number
          midia_type?: string | null
          plataforma_anuncio?: string
          url_anuncio?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "anuncio_ads_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      anuncio_brunosantos: {
        Row: {
          dia: string | null
          id: number
          id_anuncio: number | null
          name: string | null
          plataform: string | null
          telefone: number | null
        }
        Insert: {
          dia?: string | null
          id?: number
          id_anuncio?: number | null
          name?: string | null
          plataform?: string | null
          telefone?: number | null
        }
        Update: {
          dia?: string | null
          id?: number
          id_anuncio?: number | null
          name?: string | null
          plataform?: string | null
          telefone?: number | null
        }
        Relationships: []
      }
      anuncio_rafaelbrandao: {
        Row: {
          dia: string | null
          id: number
          id_anuncio: number | null
          name: string | null
          plataform: string | null
          telefone: number | null
        }
        Insert: {
          dia?: string | null
          id?: number
          id_anuncio?: number | null
          name?: string | null
          plataform?: string | null
          telefone?: number | null
        }
        Update: {
          dia?: string | null
          id?: number
          id_anuncio?: number | null
          name?: string | null
          plataform?: string | null
          telefone?: number | null
        }
        Relationships: []
      }
      anuncio_tenentebreno: {
        Row: {
          dia: string | null
          expert: string | null
          id: number
          id_anuncio: number | null
          name: string | null
          plataform: string | null
          status: string | null
          telefone: string
          valor: number | null
        }
        Insert: {
          dia?: string | null
          expert?: string | null
          id?: number
          id_anuncio?: number | null
          name?: string | null
          plataform?: string | null
          status?: string | null
          telefone: string
          valor?: number | null
        }
        Update: {
          dia?: string | null
          expert?: string | null
          id?: number
          id_anuncio?: number | null
          name?: string | null
          plataform?: string | null
          status?: string | null
          telefone?: string
          valor?: number | null
        }
        Relationships: []
      }
      app_bundinha_do_enzo: {
        Row: {
          almoco: Json | null
          altura: number | null
          cafe_da_manha: Json | null
          created_at: string
          id: string
          idade: number | null
          janta: Json | null
          lanche_tarde: Json | null
          nivel_atividade: string | null
          nome: string
          numero: string | null
          objetivo_peso: number | null
          peso: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          almoco?: Json | null
          altura?: number | null
          cafe_da_manha?: Json | null
          created_at?: string
          id?: string
          idade?: number | null
          janta?: Json | null
          lanche_tarde?: Json | null
          nivel_atividade?: string | null
          nome: string
          numero?: string | null
          objetivo_peso?: number | null
          peso?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          almoco?: Json | null
          altura?: number | null
          cafe_da_manha?: Json | null
          created_at?: string
          id?: string
          idade?: number | null
          janta?: Json | null
          lanche_tarde?: Json | null
          nivel_atividade?: string | null
          nome?: string
          numero?: string | null
          objetivo_peso?: number | null
          peso?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      app_juju_anamnese_alimentar: {
        Row: {
          almoco: Json
          cafe_da_manha: Json
          ceia: Json
          created_at: string
          id: string
          jantar: Json
          lanche: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          almoco?: Json
          cafe_da_manha?: Json
          ceia?: Json
          created_at?: string
          id?: string
          jantar?: Json
          lanche?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          almoco?: Json
          cafe_da_manha?: Json
          ceia?: Json
          created_at?: string
          id?: string
          jantar?: Json
          lanche?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      app_juju_anamnese_treino: {
        Row: {
          created_at: string
          desafio: string
          experiencia: string
          foco_regiao: string
          frequencia: string
          id: string
          intensidade: string
          lesao_especifica: string | null
          lesoes: string
          objetivo: string
          tempo_sessao: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          desafio: string
          experiencia: string
          foco_regiao: string
          frequencia: string
          id?: string
          intensidade: string
          lesao_especifica?: string | null
          lesoes: string
          objetivo: string
          tempo_sessao: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          desafio?: string
          experiencia?: string
          foco_regiao?: string
          frequencia?: string
          id?: string
          intensidade?: string
          lesao_especifica?: string | null
          lesoes?: string
          objetivo?: string
          tempo_sessao?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      app_juju_users: {
        Row: {
          created_at: string
          data_registro: string
          email: string
          id: string
          nome: string
          quiz_alimentar_concluido: boolean
          quiz_treino_concluido: boolean
          updated_at: string
          user_id: string
          whatsapp: string
        }
        Insert: {
          created_at?: string
          data_registro?: string
          email: string
          id?: string
          nome: string
          quiz_alimentar_concluido?: boolean
          quiz_treino_concluido?: boolean
          updated_at?: string
          user_id: string
          whatsapp: string
        }
        Update: {
          created_at?: string
          data_registro?: string
          email?: string
          id?: string
          nome?: string
          quiz_alimentar_concluido?: boolean
          quiz_treino_concluido?: boolean
          updated_at?: string
          user_id?: string
          whatsapp?: string
        }
        Relationships: []
      }
      contact_sending_details: {
        Row: {
          created_at: string
          id: string
          instancia: string
          mensagens_recebidas: Json
          telefone: string
          tipos_disparo: Json
          total_disparos: number
          ultimo_disparo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          instancia: string
          mensagens_recebidas?: Json
          telefone: string
          tipos_disparo?: Json
          total_disparos?: number
          ultimo_disparo?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          instancia?: string
          mensagens_recebidas?: Json
          telefone?: string
          tipos_disparo?: Json
          total_disparos?: number
          ultimo_disparo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      expert_voices: {
        Row: {
          etapa_audio: number | null
          expert_id: number
          file_key_s3: string | null
          id_voice: string | null
        }
        Insert: {
          etapa_audio?: number | null
          expert_id: number
          file_key_s3?: string | null
          id_voice?: string | null
        }
        Update: {
          etapa_audio?: number | null
          expert_id?: number
          file_key_s3?: string | null
          id_voice?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expert_voices_etapa_audio_fkey"
            columns: ["etapa_audio"]
            isOneToOne: false
            referencedRelation: "sales_funnel_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expert_voices_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: true
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      gorila: {
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
      influencer_types: {
        Row: {
          id: number
          nome: string
        }
        Insert: {
          id?: number
          nome: string
        }
        Update: {
          id?: number
          nome?: string
        }
        Relationships: []
      }
      influencers: {
        Row: {
          Genero: string | null
          id: number
          id_voz: string | null
          influencer_type_id: number
          jargoes: string | null
          nome: string
          tom_voz: string | null
        }
        Insert: {
          Genero?: string | null
          id?: number
          id_voz?: string | null
          influencer_type_id: number
          jargoes?: string | null
          nome: string
          tom_voz?: string | null
        }
        Update: {
          Genero?: string | null
          id?: number
          id_voz?: string | null
          influencer_type_id?: number
          jargoes?: string | null
          nome?: string
          tom_voz?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_influencer_type"
            columns: ["influencer_type_id"]
            isOneToOne: false
            referencedRelation: "influencer_types"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_payments: {
        Row: {
          ad_id: string
          data_pagamento: string
          id: number
          numero_telefone: number
          payload: Json | null
          valor_pagamento: number
        }
        Insert: {
          ad_id: string
          data_pagamento: string
          id?: number
          numero_telefone: number
          payload?: Json | null
          valor_pagamento: number
        }
        Update: {
          ad_id?: string
          data_pagamento?: string
          id?: number
          numero_telefone?: number
          payload?: Json | null
          valor_pagamento?: number
        }
        Relationships: [
          {
            foreignKeyName: "lead_payments_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "anuncio_ads"
            referencedColumns: ["ad_id"]
          },
          {
            foreignKeyName: "lead_payments_numero_telefone_fkey"
            columns: ["numero_telefone"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["numero_telefone"]
          },
        ]
      }
      lead_photos: {
        Row: {
          costas_foto_url: string | null
          fotos_envidas: boolean | null
          frente_foto_url: string | null
          id: number
          lado_foto_url: string | null
          lead_id: number
        }
        Insert: {
          costas_foto_url?: string | null
          fotos_envidas?: boolean | null
          frente_foto_url?: string | null
          id?: number
          lado_foto_url?: string | null
          lead_id: number
        }
        Update: {
          costas_foto_url?: string | null
          fotos_envidas?: boolean | null
          frente_foto_url?: string | null
          id?: number
          lado_foto_url?: string | null
          lead_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "lead_photos_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: true
            referencedRelation: "leads"
            referencedColumns: ["contact_id"]
          },
        ]
      }
      leads: {
        Row: {
          ad_id: string | null
          contact_id: number
          created_at: string | null
          foco: string | null
          fonte_contato: string | null
          genero: string | null
          idade: number | null
          influencer_account_id: number
          musculos_desejados: string | null
          nome: string | null
          numero_telefone: number | null
          objetivo: string | null
          physical_condition_id: number | null
          sales_funnel_stage_id: number
          sessionId: string | null
          updated_at: string | null
        }
        Insert: {
          ad_id?: string | null
          contact_id?: number
          created_at?: string | null
          foco?: string | null
          fonte_contato?: string | null
          genero?: string | null
          idade?: number | null
          influencer_account_id: number
          musculos_desejados?: string | null
          nome?: string | null
          numero_telefone?: number | null
          objetivo?: string | null
          physical_condition_id?: number | null
          sales_funnel_stage_id: number
          sessionId?: string | null
          updated_at?: string | null
        }
        Update: {
          ad_id?: string | null
          contact_id?: number
          created_at?: string | null
          foco?: string | null
          fonte_contato?: string | null
          genero?: string | null
          idade?: number | null
          influencer_account_id?: number
          musculos_desejados?: string | null
          nome?: string | null
          numero_telefone?: number | null
          objetivo?: string | null
          physical_condition_id?: number | null
          sales_funnel_stage_id?: number
          sessionId?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_physical_condition"
            columns: ["physical_condition_id"]
            isOneToOne: false
            referencedRelation: "physical_conditions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sales_funnel_stage"
            columns: ["sales_funnel_stage_id"]
            isOneToOne: false
            referencedRelation: "sales_funnel_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "anuncio_ads"
            referencedColumns: ["ad_id"]
          },
          {
            foreignKeyName: "leads_influencer_account_id_fkey"
            columns: ["influencer_account_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      physical_conditions: {
        Row: {
          descricao: string
          id: number
          tipo_de_fisico: string | null
        }
        Insert: {
          descricao: string
          id?: number
          tipo_de_fisico?: string | null
        }
        Update: {
          descricao?: string
          id?: number
          tipo_de_fisico?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          cargo: string | null
          created_at: string | null
          email: string
          id: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          cargo?: string | null
          created_at?: string | null
          email: string
          id: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          cargo?: string | null
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      prompts_etapas: {
        Row: {
          etapa_id: number | null
          etapa_prompt: string | null
          id_prompt: number
          influencer_id: number | null
          texto_prompt: string | null
        }
        Insert: {
          etapa_id?: number | null
          etapa_prompt?: string | null
          id_prompt?: number
          influencer_id?: number | null
          texto_prompt?: string | null
        }
        Update: {
          etapa_id?: number | null
          etapa_prompt?: string | null
          id_prompt?: number
          influencer_id?: number | null
          texto_prompt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "influencers_prompts_msg_etapa_id_fkey"
            columns: ["etapa_id"]
            isOneToOne: false
            referencedRelation: "sales_funnel_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "influencers_prompts_msg_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_funnel_stages: {
        Row: {
          id: number
          nome: string
        }
        Insert: {
          id?: number
          nome: string
        }
        Update: {
          id?: number
          nome?: string
        }
        Relationships: []
      }
      sending_history: {
        Row: {
          contatos: Json | null
          created_at: string
          id: string
          instancia: string
          mensagens: Json | null
          tipo_disparo: string
          total_contatos: number
          total_itens: number
          updated_at: string
          user_id: string
        }
        Insert: {
          contatos?: Json | null
          created_at?: string
          id?: string
          instancia: string
          mensagens?: Json | null
          tipo_disparo: string
          total_contatos?: number
          total_itens?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          contatos?: Json | null
          created_at?: string
          id?: string
          instancia?: string
          mensagens?: Json | null
          tipo_disparo?: string
          total_contatos?: number
          total_itens?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      teste_app: {
        Row: {
          created_at: string
          data_registro: string
          dias_no_app: number
          email: string
          id: string
          nome: string
          quiz_alimentar_concluido: boolean
          quiz_treino_concluido: boolean
          updated_at: string
          user_id: string
          whatsapp: string
        }
        Insert: {
          created_at?: string
          data_registro?: string
          dias_no_app?: number
          email: string
          id?: string
          nome: string
          quiz_alimentar_concluido?: boolean
          quiz_treino_concluido?: boolean
          updated_at?: string
          user_id: string
          whatsapp: string
        }
        Update: {
          created_at?: string
          data_registro?: string
          dias_no_app?: number
          email?: string
          id?: string
          nome?: string
          quiz_alimentar_concluido?: boolean
          quiz_treino_concluido?: boolean
          updated_at?: string
          user_id?: string
          whatsapp?: string
        }
        Relationships: []
      }
      teste_dieta: {
        Row: {
          almoco: Json
          cafe_da_manha: Json
          ceia: Json
          created_at: string
          id: string
          jantar: Json
          lanche: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          almoco?: Json
          cafe_da_manha?: Json
          ceia?: Json
          created_at?: string
          id?: string
          jantar?: Json
          lanche?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          almoco?: Json
          cafe_da_manha?: Json
          ceia?: Json
          created_at?: string
          id?: string
          jantar?: Json
          lanche?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      teste_treino: {
        Row: {
          created_at: string
          desafio: string
          experiencia: string
          foco_regiao: string
          frequencia: string
          id: string
          intensidade: string
          lesao_especifica: string | null
          lesoes: string
          objetivo: string
          tempo_sessao: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          desafio: string
          experiencia: string
          foco_regiao: string
          frequencia: string
          id?: string
          intensidade: string
          lesao_especifica?: string | null
          lesoes: string
          objetivo: string
          tempo_sessao: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          desafio?: string
          experiencia?: string
          foco_regiao?: string
          frequencia?: string
          id?: string
          intensidade?: string
          lesao_especifica?: string | null
          lesoes?: string
          objetivo?: string
          tempo_sessao?: string
          updated_at?: string
          user_id?: string
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
        Returns: string
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
      tipo_campo_enum: "frases" | "prompt" | "descrição tool" | "regra"
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
    Enums: {
      tipo_campo_enum: ["frases", "prompt", "descrição tool", "regra"],
    },
  },
} as const
