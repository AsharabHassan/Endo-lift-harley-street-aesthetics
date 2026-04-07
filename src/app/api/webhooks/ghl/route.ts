import { supabase } from "@/lib/supabase";
import { generateToken } from "@/lib/tokens";
import { updateGhlContactField } from "@/lib/ghl";
import { ghlWebhookSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = ghlWebhookSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid payload", details: parsed.error.flatten().fieldErrors },
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

  const { data: patient, error: patientError } = await supabase
    .from("patients")
    .insert({
      token,
      ghl_contact_id: payload.contact_id,
      first_name: payload.first_name,
      email: payload.email || null,
      phone: payload.phone || null,
      consultation_date: payload.consultation_date || null,
      suitability_score: payload.suitability_score || null,
      doctor_name: payload.doctor_name || null,
      doctor_title: payload.doctor_title || null,
      doctor_credentials: payload.doctor_credentials || null,
      token_expires_at: tokenExpiresAt,
    })
    .select("id, token")
    .single();

  if (patientError || !patient) {
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
