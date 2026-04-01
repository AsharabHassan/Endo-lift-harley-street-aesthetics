import { supabase } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const { patient_id, offer_id, token } = await request.json();

  const { data: patient, error: patientError } = await supabase
    .from("patients")
    .select("id, email, first_name")
    .eq("id", patient_id)
    .single();

  if (patientError || !patient) {
    return Response.json({ error: "Patient not found" }, { status: 404 });
  }

  const { data: offer, error: offerError } = await supabase
    .from("offers")
    .select("id, treatment_name, offered_price, patient_id")
    .eq("id", offer_id)
    .single();

  if (offerError || !offer || offer.patient_id !== patient_id) {
    return Response.json({ error: "Offer not found" }, { status: 404 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: patient.email || undefined,
    line_items: [
      {
        price_data: {
          currency: "gbp",
          product_data: {
            name: `Deposit — ${offer.treatment_name}`,
            description: `Treatment deposit for ${patient.first_name} at Harley Street Aesthetic Clinic`,
          },
          unit_amount: 5000, // £50.00 in pence
        },
        quantity: 1,
      },
    ],
    metadata: {
      patient_id,
      offer_id,
      treatment_name: offer.treatment_name,
    },
    success_url: `${baseUrl}/p/${token}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/p/${token}`,
  });

  const { error: depositError } = await supabase.from("deposits").insert({
    patient_id,
    offer_id,
    stripe_payment_id: session.id,
    amount: 50.0,
    status: "pending",
  });

  if (depositError) {
    return Response.json(
      { error: "Failed to record deposit" },
      { status: 500 }
    );
  }

  return Response.json({ checkout_url: session.url }, { status: 200 });
}
