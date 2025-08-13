-- Migration: create cobrancas table for simplified billing control
create extension if not exists pgcrypto;

create table if not exists public.cobrancas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  service_name text not null,
  student_name text not null,
  student_phone text not null,
  amount_cents integer not null check (amount_cents > 0),
  due_date date not null,
  issue_date date not null default current_date,
  status text not null default 'pending' check (status in ('pending','paid','canceled')),
  payment_method text check (payment_method in ('card','boleto','pix')),
  external_payment_id text,
  payment_url text,
  pix_code text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists cobrancas_user_id_idx on public.cobrancas(user_id);

-- Trigger to auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end; $$ language plpgsql;

drop trigger if exists set_cobrancas_updated_at on public.cobrancas;
create trigger set_cobrancas_updated_at
before update on public.cobrancas
for each row execute procedure public.set_updated_at();

alter table public.cobrancas enable row level security;

-- Policies: each user manages only their own rows
drop policy if exists "cobrancas_select_own" on public.cobrancas;
create policy "cobrancas_select_own" on public.cobrancas
  for select using (auth.uid() = user_id);

drop policy if exists "cobrancas_insert_own" on public.cobrancas;
create policy "cobrancas_insert_own" on public.cobrancas
  for insert with check (auth.uid() = user_id);

drop policy if exists "cobrancas_update_own" on public.cobrancas;
create policy "cobrancas_update_own" on public.cobrancas
  for update using (auth.uid() = user_id);

drop policy if exists "cobrancas_delete_own" on public.cobrancas;
create policy "cobrancas_delete_own" on public.cobrancas
  for delete using (auth.uid() = user_id);
