import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Patient, Offer, Deposit } from "@/lib/types";
import { getTreatment, getCaseStudy } from "@/lib/treatments";

import { PageViewTracker } from "./PageViewTracker";
import { PortalShell } from "@/components/PortalShell";

/* ------------------------------------------------------------------ */
/*  Case study content now lives per-treatment in src/lib/treatments  */
/*  and is selected by the patient's treatment_type.                  */
/* ------------------------------------------------------------------ */

function formatConsultationDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function computeCountdownTarget(offer: Offer): string {
  const createdMs = new Date(offer.created_at).getTime();
  const countdownMs = offer.countdown_days * 24 * 60 * 60 * 1000;
  return new Date(createdMs + countdownMs).toISOString();
}

async function getPatientByToken(token: string): Promise<Patient | null> {
  const { data } = await supabase
    .from("patients")
    .select("*")
    .eq("token", token)
    .single<Patient>();
  return data ?? null;
}

/* ------------------------------------------------------------------ */
/*  Per-treatment metadata (browser tab title)                        */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const patient = await getPatientByToken(token);
  const treatment = getTreatment(patient?.treatment_type);
  return {
    title: treatment.metaTitle,
    description: treatment.metaDescription,
  };
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default async function PortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const patient = await getPatientByToken(token);

  if (!patient) {
    notFound();
  }

  const treatment = getTreatment(patient.treatment_type);

  const isExpired = new Date(patient.token_expires_at) < new Date();

  if (isExpired) {
    return (
      <main className="min-h-screen bg-hsa-bg flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-hsa-card-primary border border-hsa-border-subtle flex items-center justify-center">
            <span className="text-hsa-text-muted text-2xl">&#9203;</span>
          </div>
          <h1 className="font-serif italic text-2xl text-hsa-cream">
            This Link Has Expired
          </h1>
          <p className="font-mono text-[10px] text-hsa-cream/40 leading-relaxed tracking-[0.05em]">
            Your personalised offer is no longer available through this link.
            Please contact us to discuss your treatment options.
          </p>
          <a
            href="tel:02071234567"
            className="btn-gold inline-block"
          >
            Call Us: 020 7123 4567
          </a>
        </div>
      </main>
    );
  }

  const [{ data: offers }, { data: deposits }] = await Promise.all([
    supabase
      .from("offers")
      .select("*")
      .eq("patient_id", patient.id)
      .order("is_primary", { ascending: false })
      .returns<Offer[]>(),
    supabase
      .from("deposits")
      .select("*")
      .eq("patient_id", patient.id)
      .eq("status", "completed")
      .returns<Deposit[]>(),
  ]);

  const allOffers = offers ?? [];
  const completedDeposits = deposits ?? [];

  const paidOfferIds = new Set(completedDeposits.map((d) => d.offer_id));
  const primaryOffer = allOffers.find((o) => o.is_primary) ?? allOffers[0];
  const secondaryOffers = allOffers.filter((o) => o.id !== primaryOffer?.id);

  if (!primaryOffer) {
    notFound();
  }

  const caseStudy = getCaseStudy(treatment, primaryOffer.treatment_area);
  const countdownTarget = computeCountdownTarget(primaryOffer);
  const consultationDateFormatted = patient.consultation_date
    ? formatConsultationDate(patient.consultation_date)
    : null;

  return (
    <>
      <PageViewTracker patientId={patient.id} />
      <PortalShell
        firstName={patient.first_name}
        consultationDate={consultationDateFormatted}
        countdownTarget={countdownTarget}
        primaryOffer={primaryOffer}
        secondaryOffers={secondaryOffers}
        patientId={patient.id}
        token={token}
        paidOfferIds={paidOfferIds}
        beforeAfterPairs={caseStudy.beforeAfterPairs}
        treatmentArea={primaryOffer.treatment_area}
        patientStories={caseStudy.patientStories}
        welcomeBlurb={treatment.welcomeBlurb}
        doctorName={patient.doctor_name ?? treatment.doctorDefaults.name}
        doctorTitle={patient.doctor_title ?? treatment.doctorDefaults.title}
        doctorCredentials={
          patient.doctor_credentials ?? treatment.doctorDefaults.credentials
        }
        doctorTreatmentAreas={treatment.doctorTreatmentAreas}
      />
    </>
  );
}
