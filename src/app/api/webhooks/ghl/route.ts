import { supabase } from "@/lib/supabase";
import { generateToken } from "@/lib/tokens";
import { updateGhlContactField } from "@/lib/ghl";
import { ghlWebhookSchema } from "@/lib/validations";

// GHL sends consultation_date in UK format ("9/3/2026" = 9 March 2026).
// Supabase timestamptz prefers ISO, so normalise DD/MM/YYYY here.
function normaliseConsultationDate(input: string | undefined): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Already ISO-ish — let Postgres handle it.
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed;

  const ukMatch = trimmed.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})$/);
  if (ukMatch) {
    const [, dd, mm, yyyy] = ukMatch;
    const year = yyyy.length === 2 ? `20${yyyy}` : yyyy;
    const iso = `${year}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    // Sanity check — if Date can't parse it, drop the value rather than 500.
    if (!Number.isNaN(Date.parse(iso))) return iso;
  }

  return null;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch (err) {
    console.error("[GHL webhook] failed to parse JSON body", err);
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ghlWebhookSchema.safeParse(body);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    console.error("[GHL webhook] validation failed", {
      fieldErrors,
      body: JSON.stringify(body),
    });
    return Response.json(
      { error: "Invalid payload", details: fieldErrors },
      { status: 400 }
    );
  }

  const payload = parsed.data;
  const token = generateToken();

  // Token expires based on countdown_days (default 30 days)
  const countdownDays = payload.countdown_days ?? 30;
  const tokenExpiresAt = new Date(
    Date.now() + countdownDays * 24 * 60 * 60 * 1000
  ).toISOString();

  const patientRow = {
    token,
    ghl_contact_id: payload.contact_id,
    first_name: payload.first_name,
    email: payload.email || null,
    phone: payload.phone || null,
    consultation_date: normaliseConsultationDate(payload.consultation_date),
    suitability_score: payload.suitability_score ?? null,
    doctor_name: payload.doctor_name || null,
    doctor_title: payload.doctor_title || null,
    doctor_credentials: payload.doctor_credentials || null,
    token_expires_at: tokenExpiresAt,
  };

  const { data: patient, error: patientError } = await supabase
    .from("patients")
    .insert(patientRow)
    .select("id, token")
    .single();

  if (patientError || !patient) {
    console.error("[GHL webhook] patient insert failed", {
      error: patientError,
      row: patientRow,
    });
    return Response.json(
      { error: "Failed to create patient", details: patientError?.message },
      { status: 500 }
    );
  }

  const offersToInsert = payload.offers.map((offer) => ({
    patient_id: patient.id,
    treatment_name: offer.treatment_name,
    treatment_area: offer.treatment_area,
    original_price: offer.original_price,
    offered_price: offer.offered_price,
    bonus_inclusion: offer.bonus_inclusion || null,
    is_primary: offer.is_primary || false,
  }));

  const { error: offersError } = await supabase
    .from("offers")
    .insert(offersToInsert);

  if (offersError) {
    console.error("[GHL webhook] offers insert failed", {
      error: offersError,
      rows: offersToInsert,
    });
    return Response.json(
      { error: "Failed to create offers", details: offersError.message },
      { status: 500 }
    );
  }

  const portalUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/p/${token}`;

  // Store portal link back in GHL (fire-and-forget)
  updateGhlContactField(
    payload.contact_id,
    "portal_link",
    portalUrl
  ).catch(console.error);

  return Response.json({ token, portal_url: portalUrl }, { status: 200 });
}
