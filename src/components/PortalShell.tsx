"use client";

import { useState } from "react";
import type { Offer } from "@/lib/types";
import { ScreenWrapper } from "./ScreenWrapper";
import { StepNav, StepLabel } from "./StepNav";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { OfferScreen } from "./screens/OfferScreen";
import { ResultsScreen } from "./screens/ResultsScreen";
import { DoctorScreen } from "./screens/DoctorScreen";
import { BookingScreen } from "./screens/BookingScreen";

interface BeforeAfterPair {
  beforeUrl: string;
  afterUrl: string;
  quote: string;
  attribution: string;
}

interface PatientStoryData {
  quote: string;
  fullStory: string;
  attribution: string;
  treatment: string;
}

interface PortalShellProps {
  firstName: string;
  consultationDate?: string | null;
  countdownTarget: string | null;
  primaryOffer: Offer;
  secondaryOffers: Offer[];
  patientId: string;
  token: string;
  paidOfferIds: Set<string>;
  beforeAfterPairs: BeforeAfterPair[];
  treatmentArea: string;
  patientStories: PatientStoryData[];
  doctorName: string;
  doctorTitle: string;
  doctorCredentials: string;
}

const TOTAL_STEPS = 5;

export function PortalShell({
  firstName,
  consultationDate,
  countdownTarget,
  primaryOffer,
  secondaryOffers,
  patientId,
  token,
  paidOfferIds,
  beforeAfterPairs,
  treatmentArea,
  patientStories,
  doctorName,
  doctorTitle,
  doctorCredentials,
}: PortalShellProps) {
  const [step, setStep] = useState(0);

  function next() {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
  }
  function back() {
    if (step > 0) setStep(step - 1);
  }

  return (
    <main className="min-h-screen bg-hsa-bg">
      <ScreenWrapper screenKey={String(step)}>
        <StepLabel current={step} />

        {step === 0 && (
          <WelcomeScreen
            firstName={firstName}
            consultationDate={consultationDate}
            onNext={next}
          />
        )}

        {step === 1 && (
          <OfferScreen
            primaryOffer={primaryOffer}
            secondaryOffers={secondaryOffers}
            countdownTarget={countdownTarget}
            patientId={patientId}
            token={token}
            paidOfferIds={paidOfferIds}
          />
        )}

        {step === 2 && (
          <ResultsScreen
            treatmentArea={treatmentArea}
            pairs={beforeAfterPairs}
            patientStories={patientStories}
          />
        )}

        {step === 3 && (
          <DoctorScreen
            name={doctorName}
            title={doctorTitle}
            credentials={doctorCredentials}
          />
        )}

        {step === 4 && (
          <BookingScreen
            firstName={firstName}
            treatmentName={primaryOffer.treatment_name}
            offeredPrice={primaryOffer.offered_price}
            patientId={patientId}
            offerId={primaryOffer.id}
            token={token}
            isPaid={paidOfferIds.has(primaryOffer.id)}
          />
        )}

        <StepNav current={step} total={TOTAL_STEPS} onBack={back} onNext={next} />
      </ScreenWrapper>
    </main>
  );
}
