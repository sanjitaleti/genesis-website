-- Run this AFTER schema.sql, in the same SQL Editor.
--
-- Creates Green City's organization row with the real ElevenLabs agent id
-- already attached, so incoming webhooks and the backfill script immediately
-- know which client a call belongs to — no manual Table Editor step needed.

insert into public.organizations (name, slug, plan, phone, service_area, elevenlabs_agent_id, paid)
values (
  'Green City Window Door & Siding',
  'green-city-window-door-siding',
  'Orbit',
  '(425) 200-9191',
  'Bothell and Western Washington',
  'agent_5601ksgq55vweba9sh07bpz151x9',
  true
)
on conflict (elevenlabs_agent_id) do nothing
returning id, name;

-- Copy the "id" value this prints — you'll paste it into the profiles insert
-- in step 5 below to link your login to this organization.
