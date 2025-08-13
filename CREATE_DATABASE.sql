-- EXECUTE ESTE SQL NO SUPABASE STUDIO > SQL EDITOR
-- =====================================================

-- Remove tabela cobrancas anterior se existir
DROP TABLE IF EXISTS public.cobrancas CASCADE;

-- Ensure required extension for gen_random_uuid
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 3.5.1. Tabela instrutores_webapp conforme especificação
CREATE TABLE IF NOT EXISTS public.instrutores_webapp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_completo VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  celular VARCHAR NOT NULL,
  senha_hash VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 3.5.2. Tabela cobrancas conforme especificação  
CREATE TABLE public.cobrancas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instrutor_id UUID NOT NULL REFERENCES public.instrutores_webapp(id) ON DELETE CASCADE,
  atividade_servico VARCHAR NOT NULL,
  nome_aluno VARCHAR NOT NULL,
  numero_aluno VARCHAR NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_emissao DATE NOT NULL DEFAULT now(),
  link_pagamento_stripe VARCHAR,
  pix_qrcode_url VARCHAR,
  pix_copia_cola VARCHAR,
  gateway_transacao_id VARCHAR,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER trg_set_updated_at_instrutores
BEFORE UPDATE ON public.instrutores_webapp
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_set_updated_at_cobrancas
BEFORE UPDATE ON public.cobrancas
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.instrutores_webapp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cobrancas ENABLE ROW LEVEL SECURITY;

-- RLS Policies para instrutores_webapp (usando auth.uid() do Supabase Auth)
CREATE POLICY "instrutor can select self" ON public.instrutores_webapp 
FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "instrutor can insert self" ON public.instrutores_webapp 
FOR INSERT WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "instrutor can update self" ON public.instrutores_webapp 
FOR UPDATE USING (auth.uid()::text = id::text);

-- RLS Policies para cobrancas (usando auth.uid() como instrutor_id)
CREATE POLICY "own charges select" ON public.cobrancas 
FOR SELECT USING (auth.uid()::text = instrutor_id::text);

CREATE POLICY "own charges insert" ON public.cobrancas 
FOR INSERT WITH CHECK (auth.uid()::text = instrutor_id::text);

CREATE POLICY "own charges update" ON public.cobrancas 
FOR UPDATE USING (auth.uid()::text = instrutor_id::text);

CREATE POLICY "own charges delete" ON public.cobrancas 
FOR DELETE USING (auth.uid()::text = instrutor_id::text);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_cobrancas_instrutor ON public.cobrancas(instrutor_id);
CREATE INDEX IF NOT EXISTS idx_cobrancas_vencimento ON public.cobrancas(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_instrutores_email ON public.instrutores_webapp(email);

-- Verificação final
SELECT 'Tabelas criadas com sucesso!' as status;
