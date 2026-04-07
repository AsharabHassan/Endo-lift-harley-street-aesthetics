export interface Patient {
  id: string;
  token: string;
  ghl_contact_id: string;
  first_name: string;
  email: string | null;
  phone: string | null;
  consultation_date: string | null;
  suitability_score: number | null;
  doctor_name: string | null;
  doctor_title: string | null;
  doctor_credentials: string | null;
  token_expires_at: string;
  created_at: string;
}

export interface Offer {
  id: string;
  patient_id: string;
  treatment_name: string;
  treatment_area: string;
  original_price: number;
  offered_price: number;
  bonus_inclusion: string | null;
  countdown_days: number;
  is_primary: boolean;
  created_at: string;
}

export interface Deposit {
  id: string;
  patient_id: string;
  offer_id: string;
  stripe_payment_id: string | null;
  amount: number;
  status: "pending" | "completed" | "refunded";
  paid_at: string | null;
  booking_redirect_url: string | null;
  created_at: string;
}

export interface PageView {
  id: string;
  patient_id: string;
  viewed_at: string;
  device: string | null;
  source: string | null;
}

export interface PatientWithOffers extends Patient {
  offers: Offer[];
  deposits: Deposit[];
}
