/* ------------------------------------------------------------------ */
/*  Treatment Registry                                                  */
/*                                                                      */
/*  Single source of truth for every treatment campaign the portal can */
/*  render. One Supabase database, one app, one /p/[token] route — the  */
/*  patient's `treatment_type` selects the matching content + branding  */
/*  from here.                                                          */
/*                                                                      */
/*  To add a new treatment:                                            */
/*   1. add its key to `TreatmentType` below,                          */
/*   2. add it to the DB check constraint (see migration 002),         */
/*   3. add one entry to `TREATMENTS`.                                  */
/* ------------------------------------------------------------------ */

export type TreatmentType = "endolift" | "co2_laser";

export const TREATMENT_TYPES: readonly TreatmentType[] = [
  "endolift",
  "co2_laser",
] as const;

export interface BeforeAfterPair {
  beforeUrl: string;
  afterUrl: string;
  quote: string;
  attribution: string;
}

export interface PatientStoryData {
  quote: string;
  fullStory: string;
  attribution: string;
  treatment: string;
}

export interface CaseStudy {
  beforeAfterPairs: BeforeAfterPair[];
  patientStories: PatientStoryData[];
}

export interface DoctorDefaults {
  name: string;
  title: string;
  credentials: string;
}

export interface TreatmentAreaItem {
  id: string;
  name: string;
}

export interface TreatmentConfig {
  id: TreatmentType;
  /** Human label, e.g. "Endolift" / "CO2 Laser". */
  displayName: string;
  /** Browser tab title for the portal. */
  metaTitle: string;
  metaDescription: string;
  /** Replaces the hardcoded WelcomeScreen description. */
  welcomeBlurb: string;
  /** Used when a patient has no doctor_* fields of their own. */
  doctorDefaults: DoctorDefaults;
  /** The "Treatment Areas" list on the Doctor screen. */
  doctorTreatmentAreas: TreatmentAreaItem[];
  /**
   * Booking-system URL for this treatment. Falls back to BOOKING_SYSTEM_URL.
   * Override per treatment with an env var named in `bookingUrlEnvKey`.
   */
  bookingUrlEnvKey: string;
  /** Before/after + testimonials, keyed by treatment_area. */
  caseStudies: Record<string, CaseStudy>;
  /** Case study used when an offer's treatment_area has no exact match. */
  defaultCaseStudyKey: string;
}

/* ================================================================== */
/*  ENDOLIFT                                                            */
/* ================================================================== */

const endoliftCaseStudies: Record<string, CaseStudy> = {
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
    patientStories: [
      {
        quote:
          "I was nervous about having any procedure, but the team put me at ease from the very first consultation.",
        fullStory:
          "After years of noticing my skin losing its firmness, I finally decided to do something about it. The Endolift procedure was quick, virtually painless, and the recovery was so much easier than I expected. Within a few weeks my friends were commenting on how refreshed I looked. I only wish I had done it sooner.",
        attribution: "Sarah, 42",
        treatment: "Full Face Endolift",
      },
      {
        quote:
          "I didn't want anything drastic — just to look like a fresher version of myself. That's exactly what I got.",
        fullStory:
          "I'd been researching non-surgical options for months and kept coming back to Endolift. What sold me was the consultation — Dr Nassab took the time to explain every step and was honest about what to expect. The procedure itself took under an hour and I was back at work the next day. Three months on, the skin across my cheeks and jawline is noticeably firmer. My husband says I look like I did on our wedding day.",
        attribution: "Emma, 38",
        treatment: "Full Face Endolift",
      },
      {
        quote:
          "My friends keep asking what skincare I'm using. They can't believe it was a single treatment.",
        fullStory:
          "I've spent a fortune on creams and facials over the years, but nothing really turned back the clock. Endolift was different — I could actually see my face lifting and tightening over the weeks that followed. The nasolabial folds that used to bother me have softened considerably, and my skin has a glow I haven't seen in years. The clinic followed up with me at every stage which made me feel really looked after.",
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
        quote:
          "The sagging under my chin has completely gone. I feel confident again.",
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
        quote:
          "My neck was always the area that bothered me most. Now it matches how young I feel inside.",
        fullStory:
          "I had been considering a surgical neck lift for years but the downtime and risks always held me back. When I heard about Endolift I thought it sounded too good to be true. But the results speak for themselves — my jawline is more defined, the loose skin is tightened, and I had barely any downtime. The whole experience from consultation to aftercare was exceptional.",
        attribution: "Rachel, 51",
        treatment: "Neck Endolift",
      },
      {
        quote:
          "I used to hold my hand under my chin in every photo. I don't do that any more.",
        fullStory:
          "The loose skin under my chin had been getting worse year after year and it was the first thing I noticed in the mirror every morning. A friend recommended Dr Nassab after having her own Endolift, so I booked a consultation. He was incredibly reassuring and realistic about outcomes. The procedure was so much simpler than I'd imagined — local anaesthetic, minimal discomfort, and I drove myself home afterwards. By week six the difference was remarkable. My neck looks clean and defined again.",
        attribution: "Louise, 47",
        treatment: "Neck Endolift",
      },
      {
        quote:
          "I genuinely look ten years younger. The change in my neckline is extraordinary.",
        fullStory:
          "I'd almost accepted that a saggy neck was just part of getting older, but my daughter encouraged me to look into non-surgical options. From the moment I walked into the Harley Street clinic I felt in safe hands. The team explained everything clearly, there was no hard sell, and the aftercare was second to none. Four months post-procedure, the skin on my neck is tighter than it has been in over a decade. I feel so much more confident in high-definition video calls for work, and I've started wearing necklaces again for the first time in years.",
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
    patientStories: [
      {
        quote:
          "I always looked tired no matter how much sleep I got. Endolift changed that completely.",
        fullStory:
          "The skin around my eyes had become my biggest insecurity — heavy upper lids and dark hollows underneath made me look exhausted all the time. After the periorbital Endolift, the improvement was dramatic but natural-looking. My eyes look more open and brighter, and people just think I have been on holiday. The procedure itself was much less daunting than I imagined.",
        attribution: "Claire, 45",
        treatment: "Periorbital Endolift",
      },
      {
        quote:
          "My eyelids were starting to hood and it made me look permanently cross. Not any more.",
        fullStory:
          "I'd been self-conscious about my heavy eyelids for years. They made me look stern and tired even when I was perfectly happy. I didn't want to go under the knife for a blepharoplasty, so when I discovered the periorbital Endolift I was intrigued. The consultation was thorough — Dr Nassab showed me exactly what could be achieved. The procedure was comfortable and over before I knew it. Within a couple of months my upper lids had lifted noticeably, opening up my whole face. Colleagues have commented that I look brighter and more approachable. I couldn't be happier.",
        attribution: "Diana, 53",
        treatment: "Periorbital Endolift",
      },
      {
        quote:
          "I used to pile on concealer every morning to hide the dark hollows. Now I barely need any make-up.",
        fullStory:
          "The under-eye hollows and crepey skin had bothered me since my early forties. I tried every eye cream on the market and even had filler, which never looked quite right. The Endolift approach was completely different — it works from beneath the skin to tighten and stimulate collagen. Recovery was straightforward, just some mild swelling for a few days. By the three-month mark the transformation was clear: smoother, firmer skin around both eyes and a natural, refreshed look. I feel like I've got my confidence back.",
        attribution: "Annabel, 46",
        treatment: "Periorbital Endolift",
      },
    ],
  },
};

const endolift: TreatmentConfig = {
  id: "endolift",
  displayName: "Endolift",
  metaTitle: "Your Treatment Plan | Harley Street Aesthetic Clinic",
  metaDescription:
    "Your personalised Endolift treatment plan from Harley Street Aesthetic Clinic.",
  welcomeBlurb:
    "Your personalised Endolift treatment plan has been curated by our specialist team at Harley Street Aesthetic Clinic.",
  doctorDefaults: {
    name: "Dr. Ayda Soltanzadeh",
    title: "Lead Aesthetic Practitioner",
    credentials:
      "FRCS (Plast), GMC Registered Specialist. Over 15 years of experience in aesthetic and reconstructive procedures. Pioneer of Endolift laser technology in the UK.",
  },
  doctorTreatmentAreas: [
    { id: "01", name: "Full Face" },
    { id: "02", name: "Neck" },
    { id: "03", name: "Jawline" },
    { id: "04", name: "Periorbital" },
  ],
  bookingUrlEnvKey: "BOOKING_SYSTEM_URL_ENDOLIFT",
  caseStudies: endoliftCaseStudies,
  defaultCaseStudyKey: "face",
};

/* ================================================================== */
/*  CO2 LASER                                                           */
/*                                                                      */
/*  TODO: Replace all placeholder copy and /case-studies/co2-* image    */
/*  paths below with real CO2 Laser marketing content. Everything the   */
/*  CO2 campaign renders is contained in this single block.             */
/* ================================================================== */

// NOTE: The copy below is professionally written sample/representative
// testimonial content so the CO2 flow reads as finished while real assets are
// gathered. Before publishing, replace with GENUINE, consented patient
// testimonials (UK ASA/CAP rules require testimonials to be real, documented
// and held on file). Image paths are placeholders until the real before/after
// photos are added to /public/case-studies/.
const co2CaseStudies: Record<string, CaseStudy> = {
  "full-face": {
    beforeAfterPairs: [
      {
        beforeUrl: "/case-studies/co2-fullface-before-1.jpg",
        afterUrl: "/case-studies/co2-fullface-after-1.jpg",
        quote:
          "My complexion looks lit from within — the dullness and sun spots that aged me have genuinely faded.",
        attribution: "Helen, 54",
      },
      {
        beforeUrl: "/case-studies/co2-fullface-before-2.jpg",
        afterUrl: "/case-studies/co2-fullface-after-2.jpg",
        quote:
          "The fine lines around my mouth and cheeks are softened and my skin feels firmer to the touch.",
        attribution: "Joanne, 49",
      },
    ],
    patientStories: [
      {
        quote:
          "I finally look as well as I feel. People assume I have been away on a long holiday.",
        fullStory:
          "Decades of sun worship had left my skin mottled, dull and lined, and no amount of expensive serums made a difference. Dr Soltanzadeh talked me through exactly what CO2 laser resurfacing could and could not achieve, which I really appreciated. The treatment itself was straightforward with numbing cream, and yes, the first few days were red and a little raw — rather like bad sunburn — but the team prepared me thoroughly. By the end of the first week the new skin underneath was astonishing: brighter, smoother and far more even. Three months on the improvement is still building as the collagen does its work.",
        attribution: "Helen, 54",
        treatment: "Full Face CO2 Laser Resurfacing",
      },
      {
        quote:
          "My pores look smaller and my make-up sits so much better now.",
        fullStory:
          "I had enlarged pores and a rough, congested texture that I had battled since my thirties. I was nervous about downtime as I run my own business, so I scheduled the procedure before a quiet fortnight. The redness settled within about five days and I was comfortable wearing a tinted SPF by day six. What surprised me most was how refined my skin became — the texture is genuinely smoother and my foundation no longer clings to dry patches. I only wish I had done it sooner.",
        attribution: "Yasmin, 44",
        treatment: "Full Face CO2 Laser Resurfacing",
      },
      {
        quote:
          "The crepey, papery look has gone and my skin feels thicker and healthier.",
        fullStory:
          "At 57 my skin had become thin, crepey and dotted with the odd patch of sun-related pigmentation. I did a great deal of research before choosing Harley Street, and the consultation reassured me completely — no pressure, just honest advice about realistic outcomes for my skin type. Recovery took about a week of redness and gentle flaking, all very manageable with the aftercare they provided. The result is skin that looks rested and healthy rather than tight or overdone. My friends keep asking what I have changed.",
        attribution: "Caroline, 57",
        treatment: "Full Face CO2 Laser Resurfacing",
      },
    ],
  },
  "acne-scarring": {
    beforeAfterPairs: [
      {
        beforeUrl: "/case-studies/co2-acne-before-1.jpg",
        afterUrl: "/case-studies/co2-acne-after-1.jpg",
        quote:
          "The rolling scars on my cheeks are so much shallower — I leave the house without foundation now.",
        attribution: "Megan, 27",
      },
      {
        beforeUrl: "/case-studies/co2-acne-before-2.jpg",
        afterUrl: "/case-studies/co2-acne-after-2.jpg",
        quote:
          "Ten years of acne scarring, noticeably smoothed. It has been life-changing for my confidence.",
        attribution: "Daniel, 31",
      },
    ],
    patientStories: [
      {
        quote:
          "For the first time since my teens I am happy to be photographed up close.",
        fullStory:
          "My acne cleared years ago but it left behind rolling and boxcar scars that dermarollers and peels never really touched. The consultation was honest about needing patience and possibly more than one session, which I respected. The treatment was uncomfortable but quick, and the downtime — about a week of redness and peeling — was completely worth it. As the new skin settled, the deeper scars softened and the overall texture evened out dramatically. My confidence has come back in a way I did not think was possible.",
        attribution: "Megan, 27",
        treatment: "CO2 Laser for Acne Scarring",
      },
      {
        quote:
          "My skin tone is more even and the pitted scars have really filled in.",
        fullStory:
          "Years of cystic acne in my twenties left me with pitting and dark marks that made me feel self-conscious in every meeting. I had tried microneedling with only modest results. CO2 laser was in a different league — the practitioner explained the science clearly and managed my expectations honestly. Recovery was a few days of looking sunburnt followed by light flaking. Several weeks later my scars are visibly shallower and the post-acne pigmentation has faded. I feel like myself again.",
        attribution: "Aisha, 33",
        treatment: "CO2 Laser for Acne Scarring",
      },
      {
        quote:
          "As a bloke I was hesitant, but the results speak for themselves.",
        fullStory:
          "I had put up with acne scarring across my cheeks for most of my twenties and assumed nothing short of surgery would help. A friend recommended the clinic and the no-nonsense consultation won me over. The procedure was over quickly and the team were brilliant about aftercare, which mattered as I was back at work within a week. The texture of my skin is the smoothest it has been since school, and the scars that used to catch the light have softened right down.",
        attribution: "Tom, 29",
        treatment: "CO2 Laser for Acne Scarring",
      },
    ],
  },
  neck: {
    beforeAfterPairs: [
      {
        beforeUrl: "/case-studies/co2-neck-before-1.jpg",
        afterUrl: "/case-studies/co2-neck-after-1.jpg",
        quote:
          "The crepey, ringed skin on my neck is smoother and tighter — it finally matches my face.",
        attribution: "Susan, 58",
      },
      {
        beforeUrl: "/case-studies/co2-neck-before-2.jpg",
        afterUrl: "/case-studies/co2-neck-after-2.jpg",
        quote:
          "Years of sun damage on my neck and chest have faded beautifully.",
        attribution: "Fiona, 53",
      },
    ],
    patientStories: [
      {
        quote:
          "I have stopped hiding my neck behind scarves and high collars.",
        fullStory:
          "My face had always had the attention but my neck gave my age away — crepey, lined and marked by years in the sun. I was apprehensive about treating such a delicate area, but Dr Soltanzadeh was meticulous and reassuring throughout. Recovery on the neck took a touch longer than I expected, around seven to ten days of redness, but the aftercare guidance was excellent. The skin that emerged is noticeably smoother and tighter, and the horizontal lines have softened. For the first time in years my neck and face look like they belong together.",
        attribution: "Susan, 58",
        treatment: "CO2 Laser Neck Resurfacing",
      },
      {
        quote:
          "Smoother, firmer and far less papery — I am thrilled at my age.",
        fullStory:
          "At 61 I assumed my crepey neck was simply something to live with. The honest consultation convinced me it was worth a try, and I am so glad I did. The treatment was comfortable with numbing, and although the recovery week was not glamorous, the team checked in on me throughout. The texture improvement has been remarkable — firmer, smoother skin with far less of that papery look. It has given my whole appearance a lift.",
        attribution: "Geraldine, 61",
        treatment: "CO2 Laser Neck Resurfacing",
      },
      {
        quote:
          "My décolletage looks a decade younger and the sun spots have faded.",
        fullStory:
          "Decades of holidays had left my neck and chest freckled with sun damage and rough to the touch. I wanted something more powerful than the gentle lasers I had tried before. CO2 resurfacing was exactly that — the practitioner was clear that it required real downtime, and the week of redness and flaking was honest work, but worth every day. The pigmentation has lifted, the crepey texture has smoothed, and I am comfortable in lower necklines again for the first time in years.",
        attribution: "Fiona, 53",
        treatment: "CO2 Laser Neck Resurfacing",
      },
    ],
  },
};

const co2Laser: TreatmentConfig = {
  id: "co2_laser",
  displayName: "CO2 Laser",
  metaTitle: "Your CO2 Laser Treatment Plan | Harley Street Aesthetic Clinic",
  metaDescription:
    "Your personalised CO2 Laser resurfacing treatment plan from Harley Street Aesthetic Clinic.",
  welcomeBlurb:
    "Your personalised CO2 Laser resurfacing plan has been curated by our specialist team at Harley Street Aesthetic Clinic.",
  doctorDefaults: {
    name: "Dr. Ayda Soltanzadeh",
    title: "Lead Aesthetic Practitioner",
    credentials:
      "FRCS (Plast), GMC Registered Specialist. Over 15 years of experience in aesthetic and reconstructive procedures. A leading authority in CO2 laser skin resurfacing in the UK.",
  },
  doctorTreatmentAreas: [
    { id: "01", name: "Full Face Resurfacing" },
    { id: "02", name: "Acne Scarring" },
    { id: "03", name: "Neck" },
    { id: "04", name: "Perioral Lines" },
  ],
  bookingUrlEnvKey: "BOOKING_SYSTEM_URL_CO2_LASER",
  caseStudies: co2CaseStudies,
  defaultCaseStudyKey: "full-face",
};

/* ================================================================== */
/*  Registry + helpers                                                  */
/* ================================================================== */

export const TREATMENTS: Record<TreatmentType, TreatmentConfig> = {
  endolift,
  co2_laser: co2Laser,
};

export const DEFAULT_TREATMENT_TYPE: TreatmentType = "endolift";

export function isTreatmentType(value: unknown): value is TreatmentType {
  return (
    typeof value === "string" &&
    (TREATMENT_TYPES as readonly string[]).includes(value)
  );
}

/** Resolve a treatment config from a (possibly missing/unknown) type. */
export function getTreatment(
  type: string | null | undefined
): TreatmentConfig {
  if (isTreatmentType(type)) return TREATMENTS[type];
  return TREATMENTS[DEFAULT_TREATMENT_TYPE];
}

/**
 * Pick the case study for an offer's treatment_area within a treatment,
 * mirroring the original fuzzy matching but scoped per treatment.
 */
export function getCaseStudy(
  treatment: TreatmentConfig,
  treatmentArea: string | null | undefined
): CaseStudy {
  const studies = treatment.caseStudies;
  const key = (treatmentArea ?? "").toLowerCase();

  if (key in studies) return studies[key];
  if (key.includes("neck") && "neck" in studies) return studies.neck;
  if (
    (key.includes("eye") || key.includes("periorbital")) &&
    "periorbital" in studies
  )
    return studies.periorbital;
  if (key.includes("acne") && "acne-scarring" in studies)
    return studies["acne-scarring"];

  return (
    studies[treatment.defaultCaseStudyKey] ?? Object.values(studies)[0]
  );
}

/**
 * Per-treatment booking URL: a treatment-specific env var if set, else the
 * shared BOOKING_SYSTEM_URL, else "#".
 */
export function resolveBookingUrl(
  type: string | null | undefined
): string {
  const treatment = getTreatment(type);
  return (
    process.env[treatment.bookingUrlEnvKey] ||
    process.env.BOOKING_SYSTEM_URL ||
    "#"
  );
}
