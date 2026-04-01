-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Patients table
create table patients (
  id uuid primary key default gen_random_uuid(),
  token varchar(24) unique not null,
  ghl_contact_id varchar(255) not null,
  first_name varchar(255) not null,
  email varchar(255),
  phone varchar(50),
  consultation_date timestamptz,
  suitability_score integer,
  token_expires_at timestamptz not null default (now() + interval '90 days'),
  created_at timestamptz not null default now()
);

create index idx_patients_token on patients(token);
create index idx_patients_ghl_contact_id on patients(ghl_contact_id);

-- Offers table
create table offers (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id) on delete cascade,
  treatment_name varchar(255) not null,
  treatment_area varchar(100) not null,
  original_price decimal(10,2) not null,
  offered_price decimal(10,2) not null,
  bonus_inclusion varchar(500),
  countdown_days integer not null default 7,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_offers_patient_id on offers(patient_id);

-- Deposits table
create table deposits (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id) on delete cascade,
  offer_id uuid not null references offers(id) on delete cascade,
  stripe_payment_id varchar(255),
  amount decimal(10,2) not null default 50.00,
  status varchar(20) not null default 'pending',
  paid_at timestamptz,
  booking_redirect_url varchar(500),
  created_at timestamptz not null default now()
);

create index idx_deposits_patient_id on deposits(patient_id);
create index idx_deposits_stripe_payment_id on deposits(stripe_payment_id);

-- Page views table
create table page_views (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  device varchar(20),
  source varchar(50)
);

create index idx_page_views_patient_id on page_views(patient_id);
