export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      praiativa_alunos: {
        Row: {
          atividade: string
          contato: string
          contato_instrutor: number | null
          created_at: string | null
          data_vencimento: string | null
          email: string | null
          nome: string
          numero_instrutor: string | null
          updated_at: string | null
          user_id: string | null
          validade: string | null
          valor: string | null
          valor_mensalidade: number | null
          whatsapp: string | null
        }
        Insert: {
          atividade: string
          contato: string
          contato_instrutor?: number | null
          created_at?: string | null
          data_vencimento?: string | null
          email?: string | null
          nome: string
          numero_instrutor?: string | null
          updated_at?: string | null
          user_id?: string | null
          validade?: string | null
          valor?: string | null
          valor_mensalidade?: number | null
          whatsapp?: string | null
        }
        Update: {
          atividade?: string
          contato?: string
          contato_instrutor?: number | null
          created_at?: string | null
          data_vencimento?: string | null
          email?: string | null
          nome?: string
          numero_instrutor?: string | null
          updated_at?: string | null
          user_id?: string | null
          validade?: string | null
          valor?: string | null
          valor_mensalidade?: number | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      praiativa_instrutores: {
        Row: {
          agencia: string | null
          atividade: string
          banco: string | null
          chave_pix: string | null
          conta: string | null
          contato: string
          cpf_cnpj: string | null
          created_at: string | null
          dia_horario: string
          instrutor_id: number
          localizacao: string
          nome: string
          numero_instrutor: string | null
          updated_at: string | null
          user_id: string | null
          valor: string
        }
        Insert: {
          agencia?: string | null
          atividade: string
          banco?: string | null
          chave_pix?: string | null
          conta?: string | null
          contato: string
          cpf_cnpj?: string | null
          created_at?: string | null
          dia_horario: string
          instrutor_id?: number
          localizacao: string
          nome: string
          numero_instrutor?: string | null
          updated_at?: string | null
          user_id?: string | null
          valor: string
        }
        Update: {
          agencia?: string | null
          atividade?: string
          banco?: string | null
          chave_pix?: string | null
          conta?: string | null
          contato?: string
          cpf_cnpj?: string | null
          created_at?: string | null
          dia_horario?: string
          instrutor_id?: number
          localizacao?: string
          nome?: string
          numero_instrutor?: string | null
          updated_at?: string | null
          user_id?: string | null
          valor?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          contato: string | null
          created_at: string
          id: string
          nome: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          contato?: string | null
          created_at?: string
          id?: string
          nome?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          contato?: string | null
          created_at?: string
          id?: string
          nome?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      instrutores_webapp: {
        Row: { id: string; nome_completo: string; email: string; celular: string; senha_hash: string; created_at: string | null; updated_at: string | null }
        Insert: { id: string; nome_completo: string; email: string; celular: string; senha_hash: string; created_at?: string | null; updated_at?: string | null }
        Update: { id?: string; nome_completo?: string; email?: string; celular?: string; senha_hash?: string; created_at?: string | null; updated_at?: string | null }
        Relationships: []
      }
      cobrancas: {
        Row: { id: string; instrutor_id: string; atividade_servico: string; nome_aluno: string; numero_aluno: string; valor: string; data_vencimento: string; data_emissao: string; link_pagamento_stripe: string | null; pix_qrcode_url: string | null; pix_copia_cola: string | null; gateway_transacao_id: string | null; created_at: string | null; updated_at: string | null }
        Insert: { id?: string; instrutor_id: string; atividade_servico: string; nome_aluno: string; numero_aluno: string; valor: string; data_vencimento: string; data_emissao?: string; link_pagamento_stripe?: string | null; pix_qrcode_url?: string | null; pix_copia_cola?: string | null; gateway_transacao_id?: string | null; created_at?: string | null; updated_at?: string | null }
        Update: { id?: string; instrutor_id?: string; atividade_servico?: string; nome_aluno?: string; numero_aluno?: string; valor?: string; data_vencimento?: string; data_emissao?: string; link_pagamento_stripe?: string | null; pix_qrcode_url?: string | null; pix_copia_cola?: string | null; gateway_transacao_id?: string | null; created_at?: string | null; updated_at?: string | null }
        Relationships: []
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
