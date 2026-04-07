"use client";

import { motion } from "framer-motion";
import type { Offer } from "@/lib/types";
import { CountdownTimer } from "@/components/CountdownTimer";
import { DepositButton } from "@/components/DepositButton";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

function formatPrice(amount: number): string {
  return `£${amount.toLocaleString("en-GB")}`;
}

interface OfferScreenProps {
  primaryOffer: Offer;
  secondaryOffers: Offer[];
  countdownTarget: string | null;
  patientId: string;
  token: string;
  paidOfferIds: Set<string>;
}

export function OfferScreen({
  primaryOffer,
  secondaryOffers,
  countdownTarget,
  patientId,
  token,
  paidOfferIds,
}: OfferScreenProps) {
  const savings = primaryOffer.original_price - primaryOffer.offered_price;
  const savingsPercent = Math.round((savings / primaryOffer.original_price) * 100);
  const isPaid = paidOfferIds.has(primaryOffer.id);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col flex-1"
    >
      {/* Label */}
      <motion.p variants={item} className="label-xs text-hsa-gold/55 mb-3">
        Your Exclusive Offer
      </motion.p>

      {/* Title */}
      <motion.h2
        variants={item}
        className="font-serif italic text-[1.8rem] leading-[1.15] tracking-tight text-hsa-cream mb-6"
      >
        {primaryOffer.treatment_name}
      </motion.h2>

      {/* Countdown */}
      {countdownTarget && (
        <motion.div variants={item} className="mb-6">
          <CountdownTimer targetDate={countdownTarget} />
        </motion.div>
      )}

      {/* Price card */}
      <motion.div variants={item} className="card-dark rounded-none p-6 mb-4">
        {!isPaid ? (
          <>
            <div className="flex items-center justify-between mb-1">
              <span className="label-xs text-hsa-gold/40">Recommended For You</span>
              <span className="font-mono text-[9px] text-hsa-cream/25 capitalize">
                {primaryOffer.treatment_area} treatment
              </span>
            </div>
            <div className="gold-gradient-divider my-4" />

            <div className="text-center py-4">
              <p className="font-mono text-[11px] text-hsa-cream/30 line-through mb-1">
                {formatPrice(primaryOffer.original_price)}
              </p>
              <p className="font-serif italic text-[2.8rem] tracking-tight text-gradient-gold leading-none">
                {formatPrice(primaryOffer.offered_price)}
              </p>
              {savings > 0 && (
                <p className="font-mono text-[9px] text-hsa-success tracking-[0.15em] uppercase mt-2">
                  Save {formatPrice(savings)} ({savingsPercent}% off)
                </p>
              )}
            </div>

            {primaryOffer.bonus_inclusion && (
              <>
                <div className="gold-gradient-divider my-4" />
                <div className="flex items-start gap-3">
                  <span className="text-hsa-gold text-sm mt-0.5">&#10029;</span>
                  <p className="font-mono text-[10px] text-hsa-cream/45 tracking-[0.05em]">
                    Includes complimentary{" "}
                    <span className="text-hsa-cream/80">{primaryOffer.bonus_inclusion}</span>
                  </p>
                </div>
              </>
            )}

            <div className="mt-6">
              <DepositButton
                patientId={patientId}
                offerId={primaryOffer.id}
                token={token}
                treatmentName={primaryOffer.treatment_name}
                isPrimary
              />
            </div>
            <p className="font-mono text-[8px] text-hsa-cream/20 tracking-[0.15em] text-center mt-3 uppercase">
              Fully refundable deposit &middot; Balance at clinic
            </p>
          </>
        ) : (
          <div className="text-center py-6 space-y-3">
            <div className="w-10 h-10 mx-auto rounded-full bg-hsa-success-dark/30 border border-hsa-success/30 flex items-center justify-center">
              <span className="text-hsa-success text-lg">&#10003;</span>
            </div>
            <p className="font-serif italic text-lg text-hsa-cream">Deposit Secured</p>
            <p className="font-mono text-[10px] text-hsa-cream/40">
              Your place for {primaryOffer.treatment_name} is confirmed.
            </p>
          </div>
        )}
      </motion.div>

      {/* Trust stats inline */}
      <motion.div variants={item} className="flex justify-around py-5 mb-4">
        {[
          { value: "500+", label: "Procedures" },
          { value: "4.9★", label: "Rating" },
          { value: "GMC", label: "Certified" },
        ].map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="font-serif italic text-lg text-hsa-cream">{value}</p>
            <p className="font-mono text-[8px] text-hsa-gold/40 tracking-[0.2em] uppercase mt-1">{label}</p>
          </div>
        ))}
      </motion.div>

      {/* Secondary offers */}
      {secondaryOffers.length > 0 && (
        <motion.div variants={item} className="space-y-3">
          <p className="label-xs text-hsa-gold/40 mb-2">Also Available</p>
          {secondaryOffers.map((offer) => {
            const offerSavings = offer.original_price - offer.offered_price;
            return (
              <div key={offer.id} className="card-dark p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-serif italic text-sm text-hsa-cream">{offer.treatment_name}</p>
                  <p className="font-mono text-[9px] text-hsa-cream/25 capitalize mt-0.5">
                    {offer.treatment_area}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  {offerSavings > 0 && (
                    <p className="font-mono text-[9px] text-hsa-cream/25 line-through">
                      {formatPrice(offer.original_price)}
                    </p>
                  )}
                  <p className="font-serif italic text-lg text-hsa-gold">
                    {formatPrice(offer.offered_price)}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
