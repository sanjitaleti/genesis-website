-- =====================================================================
-- Contact form + pricing intake submissions.
--
-- Run this in the Supabase SQL editor, same as schema.sql. Separate file
-- because schema.sql has already been run once — this is additive.
--
-- Both the contact form and the "Get started" intake page write here via a
-- server route using the service-role key, so there is no public insert
-- policy needed. No RLS select policy either: this table is read only from
-- the Supabase dashboard directly, not from the app.
-- =====================================================================

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('contact', 'intake')),
  -- which pricing tier they were looking at, if this came from the intake page
  plan text,
  name text not null,
  business text,
  email text not null,
  phone text,
  website text,
  message text,
  -- intake-specific answers (call volume, tools in use, timeline, etc), kept
  -- as jsonb so new questions don't need a schema migration to add
  answers jsonb,
  email_sent boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_idx on public.leads (created_at desc);

alter table public.leads enable row level security;
-- Deliberately no policies at all: only the service-role key (server-side
-- routes) can read or write this table.
