import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Patient, Offer, Deposit } from "@/lib/types";

import { PageViewTracker } from "./PageViewTracker";
import { PortalShell } from "@/components/PortalShell";

/* ------------------------------------------------------------------ */
/*  Case study content matched by treatment area                      */
/* ------------------------------------------------------------------ */

interface PatientStoryData {
  quote: string;
  fullStory: string;
  attribution: string;
  treatment: string;
}

interface CaseStudy {
  beforeAfterPairs: {
    beforeUrl: string;
    afterUrl: string;
    quote: string;
    attribution: string;
  }[];
  patientStories: PatientStoryData[];
}

const caseStudies: Record<string, CaseStudy> = {
  face: {
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
  },
  neck: {
    beforeAfterPairs: [
      {
        beforeUrl: "/case-studies/neck-before-1.webp",
        afterUrl: "/case-studies/neck-after-1.webp",
        quote: "The sagging under my chin has completely gone. I feel confident again.",
        attribution: "Rachel, 51",
      },
      {
        beforeUrl: "/case-studies/neck-before-2.webp",
        afterUrl: "/case-studies/neck-after-2.webp",
        quote: "I can finally wear open-neck tops without feeling self-conscious.",
        attribution: "Louise, 47",
      },
    ],
    patientStories: [
      {
        quote: "My neck was always the area that bothered me most. Now it matches how young I feel inside.",
        fullStory: "I had been considering a surgical neck lift for years but the downtime and risks always held me back. When I heard about Endolift I thought it sounded too good to be true. But the results speak for themselves — my jawline is more defined, the loose skin is tightened, and I had barely any downtime. The whole experience from consultation to aftercare was exceptional.",
        attribution: "Rachel, 51",
        treatment: "Neck Endolift",
      },
      {
        quote: "I used to hold my hand under my chin in every photo. I don't do that any more.",
        fullStory: "The loose skin under my chin had been getting worse year after year and it was the first thing I noticed in the mirror every morning. A friend recommended Dr Nassab after having her own Endolift, so I booked a consultation. He was incredibly reassuring and realistic about outcomes. The procedure was so much simpler than I'd imagined — local anaesthetic, minimal discomfort, and I drove myself home afterwards. By week six the difference was remarkable. My neck looks clean and defined again.",
        attribution: "Louise, 47",
        treatment: "Neck Endolift",
      },
      {
        quote: "I genuinely look ten years younger. The change in my neckline is extraordinary.",
        fullStory: "I'd almost accepted that a saggy neck was just part of getting older, but my daughter encouraged me to look into non-surgical options. From the moment I walked into the Harley Street clinic I felt in safe hands. The team explained everything clearly, there was no hard sell, and the aftercare was second to none. Four months post-procedure, the skin on my neck is tighter than it has been in over a decade. I feel so much more confident in high-definition video calls for work, and I've started wearing necklaces again for the first time in years.",
        attribution: "Margaret, 58",
        treatment: "Neck Endolift",
      },
    ],
  },
  periorbital: {
    beforeAfterPairs: [
      {
        beforeUrl: "/case-studies/periorbital-before-1.jpg",
        afterUrl: "/case-studies/periorbital-after-1.jpg",
        quote: "People keep telling me I look so well-rested. The under-eye area is transformed.",
        attribution: "Claire, 45",
      },
      {
        beforeUrl: "/case-studies/periorbital-before-2.jpg",
        afterUrl: "/case-studies/periorbital-after-2.jpg",
        quote: "No more heavy, droopy eyelids. The difference is remarkable.",
        attribution: "Diana, 53",
      },
    ],
    patientStories: [
      {
        quote: "I always looked tired no matter how much sleep I got. Endolift changed that completely.",
        fullStory: "The skin around my eyes had become my biggest insecurity — heavy upper lids and dark hollows underneath made me look exhausted all the time. After the periorbital Endolift, the improvement was dramatic but natural-looking. My eyes look more open and brighter, and people just think I have been on holiday. The procedure itself was much less daunting than I imagined.",
        attribution: "Claire, 45",
        treatment: "Periorbital Endolift",
      },
      {
        quote: "My eyelids were starting to hood and it made me look permanently cross. Not any more.",
        fullStory: "I'd been self-conscious about my heavy eyelids for years. They made me look stern and tired even when I was perfectly happy. I didn't want to go under the knife for a blepharoplasty, so when I discovered the periorbital Endolift I was intrigued. The consultation was thorough — Dr Nassab showed me exactly what could be achieved. The procedure was comfortable and over before I knew it. Within a couple of months my upper lids had lifted noticeably, opening up my whole face. Colleagues have commented that I look brighter and more approachable. I couldn't be happier.",
        attribution: "Diana, 53",
        treatment: "Periorbital Endolift",
      },
      {
        quote: "I used to pile on concealer every morning to hide the dark hollows. Now I barely need any make-up.",
        fullStory: "The under-eye hollows and crepey skin had bothered me since my early forties. I tried every eye cream on the market and even had filler, which never looked quite right. The Endolift approach was completely different — it works from beneath the skin to tighten and stimulate collagen. Recovery was straightforward, just some mild swelling for a few days. By the three-month mark the transformation was clear: smoother, firmer skin around both eyes and a natural, refreshed look. I feel like I've got my confidence back.",
        attribution: "Annabel, 46",
        treatment: "Periorbital Endolift",
      },
    ],
  },
};

function getCaseStudy(treatmentArea: string): CaseStudy {
  const key = treatmentArea.toLowerCase();
  if (key in caseStudies) return caseStudies[key];
  if (key.includes("neck")) return caseStudies.neck;
  if (key.includes("eye") || key.includes("periorbital"))
    return caseStudies.periorbital;
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
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default async function PortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const { data: patient } = await supabase
    .from("patients")
    .select("*")
    .eq("token", token)
    .single<Patient>();

  if (!patient) {
    notFound();
  }

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

  const caseStudy = getCaseStudy(primaryOffer?.treatment_area ?? "face");
  const countdownTarget = primaryOffer
    ? computeCountdownTarget(primaryOffer)
    : null;
  const consultationDateFormatted = patient.consultation_date
    ? formatConsultationDate(patient.consultation_date)
    : null;

  if (!primaryOffer) {
    notFound();
  }

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
        doctorName={patient.doctor_name ?? "Dr. Ayda Soltanzadeh"}
        doctorTitle={patient.doctor_title ?? "Lead Aesthetic Practitioner"}
        doctorCredentials={patient.doctor_credentials ?? "FRCS (Plast), GMC Registered Specialist. Over 15 years of experience in aesthetic and reconstructive procedures. Pioneer of Endolift laser technology in the UK."}
      />
    </>
  );
}
