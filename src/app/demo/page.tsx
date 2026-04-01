import type { Offer } from "@/lib/types";

import { Header } from "@/components/Header";
import { CountdownTimer } from "@/components/CountdownTimer";
import { OfferCard } from "@/components/OfferCard";
import { SecondaryOffer } from "@/components/SecondaryOffer";
import { DepositButton } from "@/components/DepositButton";
import { BeforeAfterGallery } from "@/components/BeforeAfterGallery";
import { TrustStats } from "@/components/TrustStats";
import { PatientStory } from "@/components/PatientStory";
import { DoctorProfile } from "@/components/DoctorProfile";
import { BrowseGallery } from "@/components/BrowseGallery";

/* ------------------------------------------------------------------ */
/*  Hard-coded sample data (no Supabase)                               */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Case study content (same as portal page, matched to "face")        */
/* ------------------------------------------------------------------ */

const caseStudy = {
  beforeAfterPairs: [
    {
      beforeUrl: "/case-studies/face-before-1.jpg",
      afterUrl: "/case-studies/face-after-1.jpg",
      quote:
        "My skin feels tighter and more lifted — I look five years younger.",
      attribution: "Sarah, 42",
    },
    {
      beforeUrl: "/case-studies/face-before-2.jpg",
      afterUrl: "/case-studies/face-after-2.jpg",
      quote: "The results were visible within weeks. I'm so pleased.",
      attribution: "Emma, 38",
    },
  ],
  patientStory: {
    quote:
      "I was nervous about having any procedure, but the team put me at ease from the very first consultation.",
    fullStory:
      "After years of noticing my skin losing its firmness, I finally decided to do something about it. The Endolift procedure was quick, virtually painless, and the recovery was so much easier than I expected. Within a few weeks my friends were commenting on how refreshed I looked. I only wish I had done it sooner.",
    attribution: "Sarah, 42",
    treatment: "Full Face Endolift",
  },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
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

/* ------------------------------------------------------------------ */
/*  Demo page component                                                */
/* ------------------------------------------------------------------ */

export default function DemoPage() {
  const consultationDateFormatted = formatConsultationDate(
    DEMO_CONSULTATION_DATE
  );
  const countdownTarget = computeCountdownTarget(primaryOffer);

  return (
    <main className="min-h-screen bg-hsa-bg">
      <div className="max-w-lg mx-auto px-5 pb-16">
        {/* No PageViewTracker for demo */}

        {/* 1. Demo banner */}
        <div className="bg-hsa-gold/10 border border-hsa-gold/30 rounded-lg px-4 py-2.5 mt-4 text-center">
          <p className="text-hsa-gold text-xs font-medium">
            Demo Preview &mdash; sample data, no database connection
          </p>
        </div>

        {/* 2. Header */}
        <Header />

        {/* 3. Personalized greeting */}
        <section className="text-center py-6 space-y-2">
          <h1 className="font-serif text-2xl text-white leading-snug">
            Your Personalised Treatment Plan
          </h1>
          <p className="text-hsa-text-secondary text-sm">
            Prepared for{" "}
            <span className="text-white font-medium">{DEMO_FIRST_NAME}</span>
            {" "}
            &mdash; consultation on{" "}
            <span className="text-white">{consultationDateFormatted}</span>
          </p>
        </section>

        {/* 4. Countdown timer */}
        <section className="mb-6">
          <CountdownTimer targetDate={countdownTarget} />
        </section>

        {/* 5. Primary offer */}
        <section className="mb-6">
          <OfferCard
            offer={primaryOffer}
            patientId={DEMO_PATIENT_ID}
            token={DEMO_TOKEN}
          />
        </section>

        {/* 6. Secondary offers */}
        <section className="space-y-4 mb-8">
          <h2 className="font-serif text-lg text-white">
            Additional Treatments
          </h2>
          <SecondaryOffer
            offer={secondaryOffer}
            patientId={DEMO_PATIENT_ID}
            token={DEMO_TOKEN}
          />
        </section>

        {/* 7. Gold gradient divider */}
        <div className="gold-gradient-divider my-10" />

        {/* 8. Before & After Gallery */}
        <section className="mb-10">
          <BeforeAfterGallery
            treatmentArea={primaryOffer.treatment_area}
            pairs={caseStudy.beforeAfterPairs}
          />
        </section>

        {/* 9. Trust Stats */}
        <section className="mb-10">
          <TrustStats />
        </section>

        {/* 10. Patient Story */}
        <section className="mb-10">
          <h3 className="font-serif text-lg text-white mb-4">
            Patient Story
          </h3>
          <PatientStory
            quote={caseStudy.patientStory.quote}
            fullStory={caseStudy.patientStory.fullStory}
            attribution={caseStudy.patientStory.attribution}
            treatment={caseStudy.patientStory.treatment}
          />
        </section>

        {/* 11. Doctor Profile */}
        <section className="mb-10">
          <h3 className="font-serif text-lg text-white mb-4">
            Your Practitioner
          </h3>
          <DoctorProfile
            name="Dr. Reza Nassab"
            title="Lead Aesthetic Practitioner"
            credentials="FRCS (Plast), GMC Registered Specialist. Over 15 years of experience in aesthetic and reconstructive procedures. Pioneer of Endolift laser technology in the UK."
          />
        </section>

        {/* 12. Browse Gallery */}
        <section className="mb-10">
          <BrowseGallery />
        </section>

        {/* 13. Final CTA */}
        <section className="space-y-5 text-center">
          <div className="gold-gradient-divider mb-6" />
          <h3 className="font-serif text-lg text-white">
            Ready to Secure Your Treatment?
          </h3>
          <p className="text-hsa-text-secondary text-sm leading-relaxed">
            Lock in your exclusive price with a fully refundable{" "}
            <span className="text-white font-medium">&pound;50 deposit</span>.
          </p>
          <DepositButton
            patientId={DEMO_PATIENT_ID}
            offerId={primaryOffer.id}
            token={DEMO_TOKEN}
            treatmentName={primaryOffer.treatment_name}
            isPrimary
          />
          <p className="text-hsa-text-muted text-xs">
            Or call us directly:{" "}
            <a
              href="tel:02071234567"
              className="text-hsa-gold hover:underline"
            >
              020 7123 4567
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
