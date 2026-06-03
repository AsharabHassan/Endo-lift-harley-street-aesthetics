import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Offer } from "@/lib/types";
import { PortalShell } from "@/components/PortalShell";
import {
  TREATMENT_TYPES,
  getTreatment,
  getCaseStudy,
  isTreatmentType,
  type TreatmentType,
} from "@/lib/treatments";

/* ------------------------------------------------------------------ */
/*  Demo data — renders any treatment's full flow from the registry,   */
/*  with no database. Real /p/[token] pages use live Supabase data.    */
/* ------------------------------------------------------------------ */

const DEMO_FIRST_NAME = "Sarah";
const DEMO_CONSULTATION_DATE = "2026-03-28T10:00:00Z";
const DEMO_PATIENT_ID = "demo-patient-id";
const DEMO_TOKEN = "demo-token";
const DEMO_COUNTDOWN_DAYS = 14;

interface DemoOfferSeed {
  treatment_name: string;
  treatment_area: string;
  original_price: number;
  offered_price: number;
  bonus_inclusion: string | null;
}

const demoOffers: Record<
  TreatmentType,
  { primary: DemoOfferSeed; secondary: DemoOfferSeed }
> = {
  endolift: {
    primary: {
      treatment_name: "Full Face Endolift",
      treatment_area: "face",
      original_price: 3495,
      offered_price: 2795,
      bonus_inclusion: "Free upper jawline",
    },
    secondary: {
      treatment_name: "Periorbital Area",
      treatment_area: "periorbital",
      original_price: 1495,
      offered_price: 1495,
      bonus_inclusion: null,
    },
  },
  co2_laser: {
    primary: {
      treatment_name: "Full Face CO2 Laser Resurfacing",
      treatment_area: "full-face",
      original_price: 2900,
      offered_price: 2200,
      bonus_inclusion: "Free aftercare kit",
    },
    secondary: {
      treatment_name: "CO2 Laser for Acne Scarring",
      treatment_area: "acne-scarring",
      original_price: 1800,
      offered_price: 1800,
      bonus_inclusion: null,
    },
  },
};

function slugToType(slug: string): TreatmentType | null {
  const normalised = slug.toLowerCase().replace(/-/g, "_");
  return isTreatmentType(normalised) ? normalised : null;
}

function buildOffer(
  seed: DemoOfferSeed,
  isPrimary: boolean,
  createdAt: string
): Offer {
  return {
    id: `demo-offer-${isPrimary ? "primary" : "secondary"}`,
    patient_id: DEMO_PATIENT_ID,
    treatment_name: seed.treatment_name,
    treatment_area: seed.treatment_area,
    original_price: seed.original_price,
    offered_price: seed.offered_price,
    bonus_inclusion: seed.bonus_inclusion,
    countdown_days: DEMO_COUNTDOWN_DAYS,
    is_primary: isPrimary,
    created_at: createdAt,
  };
}

function formatConsultationDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function generateStaticParams() {
  return TREATMENT_TYPES.map((t) => ({ treatment: t.replace(/_/g, "-") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ treatment: string }>;
}): Promise<Metadata> {
  const { treatment } = await params;
  const type = slugToType(treatment);
  if (!type) return { title: "Demo | Harley Street Aesthetic Clinic" };
  const t = getTreatment(type);
  return { title: `Demo — ${t.metaTitle}`, description: t.metaDescription };
}

export default async function DemoTreatmentPage({
  params,
}: {
  params: Promise<{ treatment: string }>;
}) {
  const { treatment } = await params;
  const type = slugToType(treatment);

  if (!type) {
    notFound();
  }

  const config = getTreatment(type);
  const seeds = demoOffers[type];

  // Created "now" so the countdown is always live in the demo.
  const createdAt = new Date().toISOString();
  const primaryOffer = buildOffer(seeds.primary, true, createdAt);
  const secondaryOffer = buildOffer(seeds.secondary, false, createdAt);

  const countdownTarget = new Date(
    new Date(createdAt).getTime() +
      DEMO_COUNTDOWN_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();

  const caseStudy = getCaseStudy(config, primaryOffer.treatment_area);

  return (
    <PortalShell
      firstName={DEMO_FIRST_NAME}
      consultationDate={formatConsultationDate(DEMO_CONSULTATION_DATE)}
      countdownTarget={countdownTarget}
      primaryOffer={primaryOffer}
      secondaryOffers={[secondaryOffer]}
      patientId={DEMO_PATIENT_ID}
      token={DEMO_TOKEN}
      paidOfferIds={new Set()}
      beforeAfterPairs={caseStudy.beforeAfterPairs}
      treatmentArea={primaryOffer.treatment_area}
      patientStories={caseStudy.patientStories}
      welcomeBlurb={config.welcomeBlurb}
      doctorName={config.doctorDefaults.name}
      doctorTitle={config.doctorDefaults.title}
      doctorCredentials={config.doctorDefaults.credentials}
      doctorTreatmentAreas={config.doctorTreatmentAreas}
    />
  );
}
