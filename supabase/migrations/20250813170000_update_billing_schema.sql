-- Final simplified billing schema migration
-- Drops interim cobrancas if existed
drop table if exists public.cobrancas cascade;

-- Ensure required extension for gen_random_uuid
create extension if not exists pgcrypto;

-- Tabela instrutores_webapp conforme especificação do documento
create table if not exists public.instrutores_webapp (
  id uuid primary key default gen_random_uuid(),
  nome_completo varchar not null,
  email varchar unique not null,
  celular varchar not null,
  senha_hash varchar not null,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Tabela cobrancas conforme especificação do documento
create table public.cobrancas (
  id uuid primary key default gen_random_uuid(),
  instrutor_id uuid not null references public.instrutores_webapp(id) on delete cascade,
  atividade_servico varchar not null,
  nome_aluno varchar not null,
  numero_aluno varchar not null,
  valor decimal(12,2) not null,
  data_vencimento date not null,
  data_emissao date not null default now(),
  link_pagamento_stripe varchar,
  pix_qrcode_url varchar,
  pix_copia_cola varchar,
  gateway_transacao_id varchar,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
	new.updated_at = now();
	return new;
end;
$$ language plpgsql;

create trigger trg_set_updated_at_instrutores
before update on public.instrutores_webapp
for each row execute function public.set_updated_at();

create trigger trg_set_updated_at_cobrancas
before update on public.cobrancas
for each row execute function public.set_updated_at();

alter table public.instrutores_webapp enable row level security;
alter table public.cobrancas enable row level security;

-- RLS policies ajustadas para usar email como identificador
create policy "instrutor can select self" on public.instrutores_webapp for select using (email = auth.jwt()->>'email');
create policy "instrutor can insert self" on public.instrutores_webapp for insert with check (email = auth.jwt()->>'email');
create policy "instrutor can update self" on public.instrutores_webapp for update using (email = auth.jwt()->>'email');

-- Policies para cobrancas baseadas no instrutor_id
create policy "own charges select" on public.cobrancas for select using (
  instrutor_id in (select id from instrutores_webapp where email = auth.jwt()->>'email')
);
create policy "own charges insert" on public.cobrancas for insert with check (
  instrutor_id in (select id from instrutores_webapp where email = auth.jwt()->>'email')
);
create policy "own charges update" on public.cobrancas for update using (
  instrutor_id in (select id from instrutores_webapp where email = auth.jwt()->>'email')
);
create policy "own charges delete" on public.cobrancas for delete using (
  instrutor_id in (select id from instrutores_webapp where email = auth.jwt()->>'email')
);

create index if not exists idx_cobrancas_instrutor on public.cobrancas(instrutor_id);
create index if not exists idx_cobrancas_vencimento on public.cobrancas(data_vencimento);
