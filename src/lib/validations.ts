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

// GHL substitutes missing merge fields in several unhelpful ways:
//   - empty string ""
//   - the literal string "null"
//   - an unresolved "{{contact.x}}" template when the field slug is wrong
// Normalise all three to undefined so .optional() fields accept them.
const emptyToUndef = (v: unknown) => {
  if (v === "" || v === null) return undefined;
  if (typeof v === "string") {
    const trimmed = v.trim();
    if (trimmed === "" || trimmed.toLowerCase() === "null") return undefined;
    if (/^\{\{.*\}\}$/.test(trimmed)) return undefined;
  }
  return v;
};

// Prices from GHL can arrive with currency symbols, commas, or whitespace
// (e.g. "£2,495" or " 699 "). Strip those before number coercion.
const priceToNumber = (v: unknown) => {
  const cleaned = emptyToUndef(v);
  if (cleaned === undefined) return undefined;
  if (typeof cleaned === "string") {
    const stripped = cleaned.replace(/[£$€,\s]/g, "").trim();
    return stripped === "" ? undefined : stripped;
  }
  return cleaned;
};

const offerSchema = z.object({
  treatment_name: z.string().min(1),
  treatment_area: z.string().min(1),
  original_price: z.preprocess(priceToNumber, z.coerce.number().positive()),
  offered_price: z.preprocess(priceToNumber, z.coerce.number().positive()),
  bonus_inclusion: z.preprocess(emptyToUndef, z.string().optional()),
  is_primary: z.preprocess(emptyToUndef, z.coerce.boolean().optional()),
});

// Keep only offers that have all four required fields after normalisation.
// An offer with a blank treatment_name or missing offered_price is
// unusable on the portal, so drop it rather than 400 the whole webhook.
function isCompleteOffer(o: unknown): boolean {
  if (!o || typeof o !== "object") return false;
  const obj = o as Record<string, unknown>;
  const hasString = (val: unknown) =>
    emptyToUndef(val) !== undefined && typeof emptyToUndef(val) === "string";
  const hasPrice = (val: unknown) => {
    const p = priceToNumber(val);
    if (p === undefined) return false;
    const num = typeof p === "number" ? p : Number(p);
    return Number.isFinite(num) && num > 0;
  };
  return (
    hasString(obj.treatment_name) &&
    hasString(obj.treatment_area) &&
    hasPrice(obj.original_price) &&
    hasPrice(obj.offered_price)
  );
}

export const ghlWebhookSchema = z.object({
  contact_id: z.string().min(1),
  first_name: z.string().min(1),
  email: z.preprocess(emptyToUndef, z.string().email().optional()),
  phone: z.preprocess(emptyToUndef, z.string().optional()),
  consultation_date: z.preprocess(emptyToUndef, z.string().optional()),
  // GHL stores suitability score as a 0-100 value, not 1-10.
  suitability_score: z.preprocess(
    emptyToUndef,
    z.coerce.number().int().min(0).max(100).optional()
  ),
  countdown_days: z.preprocess(
    emptyToUndef,
    z.coerce.number().int().min(1).max(90).optional()
  ),
  doctor_name: z.preprocess(emptyToUndef, z.string().optional()),
  doctor_title: z.preprocess(emptyToUndef, z.string().optional()),
  doctor_credentials: z.preprocess(emptyToUndef, z.string().optional()),
  offers: z.preprocess(
    (v) => (Array.isArray(v) ? v.filter(isCompleteOffer) : v),
    z.array(offerSchema).min(1)
  ),
});
