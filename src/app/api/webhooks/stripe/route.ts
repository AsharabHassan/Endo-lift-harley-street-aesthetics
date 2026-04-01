import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { addGhlContactTag } from "@/lib/ghl";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { patient_id, offer_id, treatment_name } = session.metadata!;

    // Update deposit status
    await supabase
      .from("deposits")
      .update({ status: "completed", paid_at: new Date().toISOString() })
      .eq("stripe_payment_id", session.id);

    // Push tag to GHL
    const { data: patient } = await supabase
      .from("patients")
      .select("ghl_contact_id")
      .eq("id", patient_id)
      .single();

    if (patient) {
      addGhlContactTag(
        patient.ghl_contact_id,
        `Deposit Paid — ${treatment_name}`
      ).catch(console.error);
    }
  }

  return Response.json({ received: true }, { status: 200 });
}
