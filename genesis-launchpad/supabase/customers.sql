-- =====================================================================
-- Paid-customer allowlist + organization paid flag.
--
-- Run this in the Supabase SQL editor, same as onboarding.sql. Additive —
-- schema.sql and onboarding.sql have already been run.
--
-- `customers` is the manual record of who has actually bought a package,
-- written only by the internal admin page (/v2/admin) via the service-role
-- key. There's no billing processor wired up yet, so this is filled in by
-- hand after a Calendly call closes.
-- =====================================================================

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  plan text not null,
  paid_at timestamptz not null default now(),
  -- set once an account claims this row (either because the account
  -- already existed when marked paid, or because onboarding matched it
  -- later) — makes re-running "mark as paid" for the same email safe.
  claimed_org_id uuid references public.organizations,
  created_at timestamptz not null default now()
);

alter table public.customers enable row level security;
-- Deliberately no policies: only the service-role key touches this table.

alter table public.organizations
  add column if not exists paid boolean not null default false;

-- Grandfather in every org that exists today (Green City, any existing
-- test orgs) so this change doesn't lock out current clients.
update public.organizations set paid = true where paid = false;
