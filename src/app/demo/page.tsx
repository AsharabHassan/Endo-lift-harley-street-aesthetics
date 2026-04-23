import type { Offer } from "@/lib/types";
import { PortalShell } from "@/components/PortalShell";

const DEMO_FIRST_NAME = "Sarah";
const DEMO_CONSULTATION_DATE = "2026-03-28T10:00:00Z";
const DEMO_PATIENT_ID = "demo-patient-id";
const DEMO_TOKEN = "demo-token";

const primaryOffer: Offer = {
  id: "demo-offer-primary",
  patient_id: DEMO_PATIENT_ID,
  treatment_name: "Full Face Endolift",
  treatment_area: "face",
  original_price: 3495,
  offered_price: 2795,
  bonus_inclusion: "Free upper jawline",
  countdown_days: 7,
  is_primary: true,
  created_at: new Date().toISOString(),
};

const secondaryOffer: Offer = {
  id: "demo-offer-secondary",
  patient_id: DEMO_PATIENT_ID,
  treatment_name: "Periorbital Area",
  treatment_area: "periorbital",
  original_price: 1495,
  offered_price: 1495,
  bonus_inclusion: null,
  countdown_days: 7,
  is_primary: false,
  created_at: new Date().toISOString(),
};

const caseStudy = {
  beforeAfterPairs: [
    {
      beforeUrl: "/case-studies/face-before-1.jpg",
      afterUrl: "/case-studies/face-after-1.jpg",
      quote: "My skin feels tighter and more lifted — I look five years younger.",
      attribution: "Sarah, 42",
    },
    {
      beforeUrl: "/case-studies/face-before-2.jpg",
      afterUrl: "/case-studies/face-after-2.jpg",
      quote: "The results were visible within weeks. I'm so pleased.",
      attribution: "Emma, 38",
    },
  ],
  patientStories: [
    {
      quote: "I was nervous about having any procedure, but the team put me at ease from the very first consultation.",
      fullStory: "After years of noticing my skin losing its firmness, I finally decided to do something about it. The Endolift procedure was quick, virtually painless, and the recovery was so much easier than I expected. Within a few weeks my friends were commenting on how refreshed I looked. I only wish I had done it sooner.",
      attribution: "Sarah, 42",
      treatment: "Full Face Endolift",
    },
    {
      quote: "I didn't want anything drastic — just to look like a fresher version of myself. That's exactly what I got.",
      fullStory: "I'd been researching non-surgical options for months and kept coming back to Endolift. What sold me was the consultation — Dr Nassab took the time to explain every step and was honest about what to expect. The procedure itself took under an hour and I was back at work the next day. Three months on, the skin across my cheeks and jawline is noticeably firmer. My husband says I look like I did on our wedding day.",
      attribution: "Emma, 38",
      treatment: "Full Face Endolift",
    },
    {
      quote: "My friends keep asking what skincare I'm using. They can't believe it was a single treatment.",
      fullStory: "I've spent a fortune on creams and facials over the years, but nothing really turned back the clock. Endolift was different — I could actually see my face lifting and tightening over the weeks that followed. The nasolabial folds that used to bother me have softened considerably, and my skin has a glow I haven't seen in years. The clinic followed up with me at every stage which made me feel really looked after.",
      attribution: "Priya, 49",
      treatment: "Full Face Endolift",
    },
  ],
};

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

export default function DemoPage() {
  return (
    <PortalShell
      firstName={DEMO_FIRST_NAME}
      consultationDate={formatConsultationDate(DEMO_CONSULTATION_DATE)}
      countdownTarget={computeCountdownTarget(primaryOffer)}
      primaryOffer={primaryOffer}
      secondaryOffers={[secondaryOffer]}
      patientId={DEMO_PATIENT_ID}
      token={DEMO_TOKEN}
      paidOfferIds={new Set()}
      beforeAfterPairs={caseStudy.beforeAfterPairs}
      treatmentArea={primaryOffer.treatment_area}
      patientStories={caseStudy.patientStories}
      doctorName="Dr. Ayda Soltanzadeh"
      doctorTitle="Lead Aesthetic Practitioner"
      doctorCredentials="FRCS (Plast), GMC Registered Specialist. Over 15 years of experience in aesthetic and reconstructive procedures. Pioneer of Endolift laser technology in the UK."
    />
  );
}
