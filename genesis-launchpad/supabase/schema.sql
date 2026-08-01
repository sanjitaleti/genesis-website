-- =====================================================================
-- Genesis LP portal schema
--
-- Run this once in the Supabase SQL editor. It creates the tables the
-- dashboard reads, and locks them down so a signed-in client can only ever
-- see their own organisation's rows.
--
-- Writes come from the ElevenLabs webhook, which uses the service-role key
-- and therefore bypasses RLS. Nothing in the browser can insert.
-- =====================================================================

-- ------------------------------------------------------------ tenants

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  plan text not null default 'Lunar',
  phone text,
  service_area text,
  -- how an inbound webhook is matched to a client: one ElevenLabs agent
  -- per organisation
  elevenlabs_agent_id text unique,
  created_at timestamptz not null default now()
);

-- One row per signed-in user, tying them to the org whose data they may read.
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  org_id uuid not null references public.organizations on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------------- calls

create table if not exists public.calls (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations on delete cascade,
  -- ElevenLabs conversation id: the natural key that makes webhook
  -- delivery idempotent, since the same event can arrive more than once
  conversation_id text not null unique,
  agent_id text,
  started_at timestamptz not null,
  duration_secs integer not null default 0,
  caller_name text,
  caller_phone text,
  reason text,
  outcome text not null default 'handled'
    check (outcome in ('booked', 'quoted', 'handled', 'passed_on')),
  -- money in cents, so no floating point ever touches a currency
  value_cents integer,
  summary text,
  transcript jsonb,
  raw jsonb,
  created_at timestamptz not null default now()
);

create index if not exists calls_org_started_idx
  on public.calls (org_id, started_at desc);

-- ------------------------------------------------------- appointments

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations on delete cascade,
  -- unique so a redelivered webhook updates the booking instead of
  -- creating a second one
  call_id uuid unique references public.calls on delete set null,
  starts_at timestamptz not null,
  duration_mins integer not null default 60,
  customer_name text,
  title text not null,
  kind text not null default 'book'
    check (kind in ('book', 'quote', 'service')),
  created_at timestamptz not null default now()
);

create index if not exists appointments_org_start_idx
  on public.appointments (org_id, starts_at);

-- ---------------------------------------------------------------- RLS

alter table public.organizations enable row level security;
alter table public.profiles      enable row level security;
alter table public.calls         enable row level security;
alter table public.appointments  enable row level security;

-- Resolving the caller's org in a security-definer function keeps the
-- policies from recursing back through profiles' own RLS.
create or replace function public.current_org_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select org_id from public.profiles where id = auth.uid()
$$;

drop policy if exists "read own org" on public.organizations;
create policy "read own org" on public.organizations
  for select using (id = public.current_org_id());

drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles
  for select using (id = auth.uid());

drop policy if exists "read org calls" on public.calls;
create policy "read org calls" on public.calls
  for select using (org_id = public.current_org_id());

drop policy if exists "read org appointments" on public.appointments;
create policy "read org appointments" on public.appointments
  for select using (org_id = public.current_org_id());

-- Deliberately no insert/update/delete policies: only the service role
-- (the webhook) writes, and it is not subject to RLS.
