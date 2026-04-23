import { z } from "zod";

export const depositSchema = z.object({
  patient_id: z.string().uuid(),
  offer_id: z.string().uuid(),
  token: z.string().min(1),
});

export const trackingSchema = z.object({
  patient_id: z.string().uuid(),
  device: z.string().optional(),
  source: z.string().optional(),
});

// GHL substitutes missing merge fields as empty strings and also sends
// unresolved "{{contact.x}}" literals when a custom field name is wrong.
// Normalise both to undefined so .optional() fields accept them cleanly.
const emptyToUndef = (v: unknown) => {
  if (v === "" || v === null) return undefined;
  if (typeof v === "string" && /^\{\{.*\}\}$/.test(v.trim())) return undefined;
  return v;
};

const offerSchema = z.object({
  treatment_name: z.string().min(1),
  treatment_area: z.string().min(1),
  original_price: z.coerce.number().positive(),
  offered_price: z.coerce.number().positive(),
  bonus_inclusion: z.preprocess(emptyToUndef, z.string().optional()),
  is_primary: z.preprocess(emptyToUndef, z.coerce.boolean().optional()),
});

export const ghlWebhookSchema = z.object({
  contact_id: z.string().min(1),
  first_name: z.string().min(1),
  email: z.preprocess(emptyToUndef, z.string().email().optional()),
  phone: z.preprocess(emptyToUndef, z.string().optional()),
  consultation_date: z.preprocess(emptyToUndef, z.string().optional()),
  suitability_score: z.preprocess(
    emptyToUndef,
    z.coerce.number().int().min(1).max(10).optional()
  ),
  countdown_days: z.preprocess(
    emptyToUndef,
    z.coerce.number().int().min(1).max(90).optional()
  ),
  doctor_name: z.preprocess(emptyToUndef, z.string().optional()),
  doctor_title: z.preprocess(emptyToUndef, z.string().optional()),
  doctor_credentials: z.preprocess(emptyToUndef, z.string().optional()),
  offers: z.preprocess(
    (v) => {
      if (!Array.isArray(v)) return v;
      return v.filter((o) => {
        if (!o || typeof o !== "object") return false;
        const name = (o as { treatment_name?: unknown }).treatment_name;
        return typeof name === "string" && name.trim() !== "" && !/^\{\{.*\}\}$/.test(name.trim());
      });
    },
    z.array(offerSchema).min(1)
  ),
});
