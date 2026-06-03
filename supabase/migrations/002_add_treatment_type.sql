-- Multi-Treatment Retargeting — add treatment_type to patients
-- Run against your Supabase project via the SQL Editor or `supabase db push`.
--
-- This lets one portal (and one database) serve separate, fully-branded
-- retargeting experiences per treatment (e.g. Endolift, CO2 Laser).
-- The code-side treatment registry (src/lib/treatments.ts) maps each value
-- to its content + branding.

alter table patients
  add column if not exists treatment_type text not null default 'endolift';

-- Restrict to the treatment types the app knows how to render.
-- Add new values here (and to src/lib/treatments.ts) when adding a treatment.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'patients_treatment_type_check'
  ) then
    alter table patients
      add constraint patients_treatment_type_check
      check (treatment_type in ('endolift', 'co2_laser'));
  end if;
end $$;

create index if not exists idx_patients_treatment_type on patients (treatment_type);
