-- GHL sends suitability score as a 0-100 percentage, not a 1-10 rating.
-- Drop the old CHECK constraint and add a wider one.
-- Run this in the Supabase SQL Editor.

alter table patients
  drop constraint if exists patients_suitability_score_check;

alter table patients
  add constraint patients_suitability_score_check
  check (suitability_score between 0 and 100);
