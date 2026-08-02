-- =====================================================================
-- Self-serve onboarding: theme preference on each organization.
--
-- Run this in the Supabase SQL editor, same as the earlier migrations.
-- Existing orgs (created by hand, like Green City) get sane defaults —
-- nothing breaks, they just haven't picked a theme yet and can from Settings.
-- =====================================================================

alter table public.organizations
  add column if not exists theme_accent text not null default 'punch'
    check (theme_accent in ('mono', 'punch', 'cyan', 'citrus')),
  add column if not exists theme_mode text not null default 'dark'
    check (theme_mode in ('dark', 'light'));
