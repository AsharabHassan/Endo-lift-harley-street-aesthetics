import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Patient, Offer, Deposit } from "@/lib/types";

import { PageViewTracker } from "./PageViewTracker";
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
/*  Hard-coded case study content matched by treatment area            */
/* ------------------------------------------------------------------ */

interface CaseStudy {
  beforeAfterPairs: {
    beforeUrl: string;
    afterUrl: string;
    quote: string;
    attribution: string;
  }[];
  patientStory: {
    quote: string;
    fullStory: string;
    attribution: string;
    treatment: string;
  };
}

const caseStudies: Record<string, CaseStudy> = {
  face: {
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
  },
  neck: {
    beforeAfterPairs: [
      {
        beforeUrl: "/case-studies/neck-before-1.jpg",
        afterUrl: "/case-studies/neck-after-1.jpg",
        quote:
          "The sagging under my chin has completely gone. I feel confident again.",
        attribution: "Rachel, 51",
      },
      {
        beforeUrl: "/case-studies/neck-before-2.jpg",
        afterUrl: "/case-studies/neck-after-2.jpg",
        quote:
          "I can finally wear open-neck tops without feeling self-conscious.",
        attribution: "Louise, 47",
      },
    ],
    patientStory: {
      quote:
        "My neck was always the area that bothered me most. Now it matches how young I feel inside.",
      fullStory:
        "I had been considering a surgical neck lift for years but the downtime and risks always held me back. When I heard about Endolift I thought it sounded too good to be true. But the results speak for themselves — my jawline is more defined, the loose skin is tightened, and I had barely any downtime. The whole experience from consultation to aftercare was exceptional.",
      attribution: "Rachel, 51",
      treatment: "Neck Endolift",
    },
  },
  periorbital: {
    beforeAfterPairs: [
      {
        beforeUrl: "/case-studies/periorbital-before-1.jpg",
        afterUrl: "/case-studies/periorbital-after-1.jpg",
        quote:
          "People keep telling me I look so well-rested. The under-eye area is transformed.",
        attribution: "Claire, 45",
      },
      {
        beforeUrl: "/case-studies/periorbital-before-2.jpg",
        afterUrl: "/case-studies/periorbital-after-2.jpg",
        quote: "No more heavy, droopy eyelids. The difference is remarkable.",
        attribution: "Diana, 53",
      },
    ],
    patientStory: {
      quote:
        "I always looked tired no matter how much sleep I got. Endolift changed that completely.",
      fullStory:
        "The skin around my eyes had become my biggest insecurity — heavy upper lids and dark hollows underneath made me look exhausted all the time. After the periorbital Endolift, the improvement was dramatic but natural-looking. My eyes look more open and brighter, and people just think I have been on holiday. The procedure itself was much less daunting than I imagined.",
      attribution: "Claire, 45",
      treatment: "Periorbital Endolift",
    },
  },
};

function getCaseStudy(treatmentArea: string): CaseStudy {
  const key = treatmentArea.toLowerCase();
  if (key in caseStudies) return caseStudies[key];

  // Fuzzy matching for common variations
  if (key.includes("neck")) return caseStudies.neck;
  if (key.includes("eye") || key.includes("periorbital"))
    return caseStudies.periorbital;

  // Default to face
  return caseStudies.face;
}

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
/*  Deposit-secured badge                                              */
/* ------------------------------------------------------------------ */

function DepositSecuredBadge({ treatmentName }: { treatmentName: string }) {
  return (
    <div className="bg-hsa-card-primary border border-hsa-success rounded-lg p-6 text-center space-y-2">
      <div className="text-hsa-success text-3xl">&#10003;</div>
      <h3 className="font-serif text-xl text-white">Deposit Secured</h3>
      <p className="text-hsa-text-secondary text-sm">
        Your place for <span className="text-white">{treatmentName}</span> is
        confirmed.
      </p>
    </div>
  );
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

  /* ---------- Fetch patient by token ---------- */
  const { data: patient } = await supabase
    .from("patients")
    .select("*")
    .eq("token", token)
    .single<Patient>();

  if (!patient) {
    notFound();
  }

  /* ---------- Check token expiry ---------- */
  const isExpired = new Date(patient.token_expires_at) < new Date();

  if (isExpired) {
    return (
      <main className="min-h-screen bg-hsa-bg flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-6">
          <h1 className="font-serif text-2xl text-white">
            This Link Has Expired
          </h1>
          <p className="text-hsa-text-secondary text-sm leading-relaxed">
            Your personalised offer is no longer available through this link.
            Please contact us to discuss your treatment options.
          </p>
          <a
            href="tel:02071234567"
            className="inline-block gold-gradient-button text-white font-semibold py-3 px-8 rounded-lg transition-opacity hover:opacity-90"
          >
            Call Us: 020 7123 4567
          </a>
        </div>
      </main>
    );
  }

  /* ---------- Fetch offers and deposits ---------- */
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
  const secondaryOffers = allOffers.filter(
    (o) => o.id !== primaryOffer?.id
  );

  /* ---------- Matched case study content ---------- */
  const caseStudy = getCaseStudy(primaryOffer?.treatment_area ?? "face");

  /* ---------- Countdown target ---------- */
  const countdownTarget = primaryOffer
    ? computeCountdownTarget(primaryOffer)
    : null;

  /* ---------- Formatted consultation date ---------- */
  const consultationDateFormatted = patient.consultation_date
    ? formatConsultationDate(patient.consultation_date)
    : null;

  /* ---------- Render ---------- */
  return (
    <main className="min-h-screen bg-hsa-bg">
      <div className="max-w-lg mx-auto px-5 pb-16">
        {/* 1. Page view tracker (fire-and-forget) */}
        <PageViewTracker patientId={patient.id} />

        {/* 2. Header */}
        <Header />

        {/* 3. Personalized greeting */}
        <section className="text-center py-6 space-y-2">
          <h1 className="font-serif text-2xl text-white leading-snug">
            Your Personalised Treatment Plan
          </h1>
          <p className="text-hsa-text-secondary text-sm">
            Prepared for{" "}
            <span className="text-white font-medium">
              {patient.first_name}
            </span>
            {consultationDateFormatted && (
              <>
                {" "}
                &mdash; consultation on{" "}
                <span className="text-white">{consultationDateFormatted}</span>
              </>
            )}
          </p>
        </section>

        {/* 4. Countdown timer */}
        {countdownTarget && (
          <section className="mb-6">
            <CountdownTimer targetDate={countdownTarget} />
          </section>
        )}

        {/* 5. Primary offer (or deposit secured) */}
        {primaryOffer && (
          <section className="mb-6">
            {paidOfferIds.has(primaryOffer.id) ? (
              <DepositSecuredBadge treatmentName={primaryOffer.treatment_name} />
            ) : (
              <OfferCard
                offer={primaryOffer}
                patientId={patient.id}
                token={token}
              />
            )}
          </section>
        )}

        {/* 6. Secondary offers */}
        {secondaryOffers.length > 0 && (
          <section className="space-y-4 mb-8">
            <h2 className="font-serif text-lg text-white">
              Additional Treatments
            </h2>
            {secondaryOffers.map((offer) =>
              paidOfferIds.has(offer.id) ? (
                <DepositSecuredBadge
                  key={offer.id}
                  treatmentName={offer.treatment_name}
                />
              ) : (
                <SecondaryOffer
                  key={offer.id}
                  offer={offer}
                  patientId={patient.id}
                  token={token}
                />
              )
            )}
          </section>
        )}

        {/* 7. Gold gradient divider */}
        <div className="gold-gradient-divider my-10" />

        {/* 8. Before & After Gallery */}
        <section className="mb-10">
          <BeforeAfterGallery
            treatmentArea={primaryOffer?.treatment_area ?? "face"}
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
          {primaryOffer && !paidOfferIds.has(primaryOffer.id) && (
            <DepositButton
              patientId={patient.id}
              offerId={primaryOffer.id}
              token={token}
              treatmentName={primaryOffer.treatment_name}
              isPrimary
            />
          )}
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
