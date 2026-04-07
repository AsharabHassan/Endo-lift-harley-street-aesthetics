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

export const ghlWebhookSchema = z.object({
  contact_id: z.string().min(1),
  first_name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  consultation_date: z.string().optional(),
  suitability_score: z.coerce.number().int().min(1).max(10).optional(),
  countdown_days: z.coerce.number().int().min(1).max(90).optional(),
  doctor_name: z.string().optional(),
  doctor_title: z.string().optional(),
  doctor_credentials: z.string().optional(),
  offers: z
    .array(
      z.object({
        treatment_name: z.string().min(1),
        treatment_area: z.string().min(1),
        original_price: z.coerce.number().positive(),
        offered_price: z.coerce.number().positive(),
        bonus_inclusion: z.string().optional(),
        is_primary: z.coerce.boolean().optional(),
      })
    )
    .min(1),
});
