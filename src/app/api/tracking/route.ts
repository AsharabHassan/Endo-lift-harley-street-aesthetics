import { supabase } from "@/lib/supabase";
import { addGhlContactTag } from "@/lib/ghl";

export async function POST(request: Request) {
  const { patient_id, device, source } = await request.json();

  if (!patient_id) {
    return Response.json({ error: "Missing patient_id" }, { status: 400 });
  }

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
