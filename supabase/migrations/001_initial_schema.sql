-- Endolift Re-targeting Portal — Initial Schema
-- Run against your Supabase project via the SQL Editor or supabase db push.

-- 1. patients
create table if not exists patients (
  id              uuid primary key default gen_random_uuid(),
  token           text not null unique,
  ghl_contact_id  text not null,
  first_name      text not null,
  email           text,
  phone           text,
  consultation_date timestamptz,
  suitability_score integer check (suitability_score between 1 and 10),
  doctor_name     text,
  doctor_title    text,
  doctor_credentials text,
  token_expires_at timestamptz not null,
  created_at      timestamptz not null default now()
);

create index if not exists idx_patients_token on patients (token);
create index if not exists idx_patients_ghl_contact_id on patients (ghl_contact_id);

-- 2. offers
create table if not exists offers (
  id              uuid primary key default gen_random_uuid(),
  patient_id      uuid not null references patients (id) on delete cascade,
  treatment_name  text not null,
  treatment_area  text not null,
  original_price  numeric(10,2) not null check (original_price > 0),
  offered_price   numeric(10,2) not null check (offered_price > 0),
  bonus_inclusion text,
  countdown_days  integer not null default 7 check (countdown_days between 1 and 90),
  is_primary      boolean not null default false,
  created_at      timestamptz not null default now()
);

create index if not exists idx_offers_patient_id on offers (patient_id);

-- 3. deposits
create table if not exists deposits (
  id                  uuid primary key default gen_random_uuid(),
  patient_id          uuid not null references patients (id) on delete cascade,
  offer_id            uuid not null references offers (id) on delete cascade,
  stripe_payment_id   text,
  amount              numeric(10,2) not null check (amount > 0),
  status              text not null default 'pending'
                        check (status in ('pending', 'completed', 'refunded')),
  paid_at             timestamptz,
  booking_redirect_url text,
  created_at          timestamptz not null default now()
);

create index if not exists idx_deposits_patient_id on deposits (patient_id);
create index if not exists idx_deposits_stripe_payment_id on deposits (stripe_payment_id);

-- 4. page_views
create table if not exists page_views (
  id          uuid primary key default gen_random_uuid(),
  patient_id  uuid not null references patients (id) on delete cascade,
  viewed_at   timestamptz not null default now(),
  device      text,
  source      text
);

create index if not exists idx_page_views_patient_id on page_views (patient_id);

-- 5. Row Level Security
-- The app uses the service_role key (bypasses RLS), but enabling RLS
-- ensures that if the anon key is ever accidentally exposed, no data leaks.

alter table patients enable row level security;
alter table offers enable row level security;
alter table deposits enable row level security;
alter table page_views enable row level security;
