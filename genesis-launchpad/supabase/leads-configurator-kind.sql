-- =====================================================================
-- Adds 'configurator' as a valid `leads.kind` value.
--
-- Run this in the Supabase SQL editor, same as leads.sql. Additive: widens
-- the existing check constraint, touches no data.
-- =====================================================================

alter table public.leads
  drop constraint if exists leads_kind_check;

alter table public.leads
  add constraint leads_kind_check check (kind in ('contact', 'intake', 'configurator'));
