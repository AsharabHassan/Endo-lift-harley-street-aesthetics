import { supabase } from "@/lib/supabase";
import { addGhlContactTag } from "@/lib/ghl";
import { trackingSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = trackingSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const { patient_id, device, source } = parsed.data;

  await supabase.from("page_views").insert({
    patient_id,
    device: device || null,
    source: source || null,
  });

  // Check if this is the first view — if so, tag in GHL
  const { count } = await supabase
    .from("page_views")
    .select("id", { count: "exact", head: true })
    .eq("patient_id", patient_id);

  if (count === 1) {
    const { data: patient } = await supabase
      .from("patients")
      .select("ghl_contact_id")
      .eq("id", patient_id)
      .single();

    if (patient) {
      addGhlContactTag(
        patient.ghl_contact_id,
        "Portal Viewed"
      ).catch(console.error);
    }
  }

  return Response.json({ tracked: true }, { status: 200 });
}
