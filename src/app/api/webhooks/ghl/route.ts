import { supabase } from "@/lib/supabase";
import { generateToken } from "@/lib/tokens";
import { updateGhlContactField } from "@/lib/ghl";

interface GhlWebhookPayload {
  contact_id: string;
  first_name: string;
  email?: string;
  phone?: string;
  consultation_date?: string;
  suitability_score?: number;
  offers: {
    treatment_name: string;
    treatment_area: string;
    original_price: number;
    offered_price: number;
    bonus_inclusion?: string;
    is_primary?: boolean;
  }[];
}

export async function POST(request: Request) {
  const webhookSecret = request.headers.get("x-webhook-secret");
  if (webhookSecret !== process.env.GHL_WEBHOOK_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload: GhlWebhookPayload = await request.json();
  const token = generateToken();

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
