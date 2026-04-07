"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { DepositButton } from "@/components/DepositButton";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

interface BookingScreenProps {
  firstName: string;
  treatmentName: string;
  offeredPrice: number;
  patientId: string;
  offerId: string;
  token: string;
  isPaid: boolean;
}

export function BookingScreen({
  firstName,
  treatmentName,
  offeredPrice,
  patientId,
  offerId,
  token,
  isPaid,
}: BookingScreenProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col flex-1"
    >
      {/* Logo */}
      <motion.div variants={item} className="mb-10">
        <Image src="/hsa-logo.png" alt="HSA" width={48} height={48} />
      </motion.div>

      <div className="flex-1 flex flex-col justify-center">
        {/* Label */}
        <motion.p variants={item} className="label-xs text-hsa-gold/55 mb-4">
          Secure Your Treatment
        </motion.p>

        {/* Headline */}
        <motion.h2
          variants={item}
          className="font-serif italic text-[2rem] leading-[1.15] tracking-tight text-hsa-cream mb-6"
        >
          Ready to begin,
          <br />
          <span className="text-gradient-gold">{firstName}?</span>
        </motion.h2>

        <motion.div variants={item} className="gold-line mb-6" />

        <motion.p
          variants={item}
          className="font-mono text-[10px] text-hsa-cream/45 tracking-[0.05em] leading-relaxed mb-8 max-w-xs"
        >
          Lock in your exclusive price for{" "}
          <span className="text-hsa-cream/80">{treatmentName}</span> at{" "}
          <span className="text-hsa-cream/80">£{offeredPrice.toLocaleString("en-GB")}</span>{" "}
          with a fully refundable £50 deposit. No commitment, no risk.
        </motion.p>

        {/* Summary card */}
        <motion.div variants={item} className="card-dark p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="label-xs text-hsa-gold/40">Summary</span>
            <span className="font-mono text-[8px] text-hsa-cream/20 tracking-[0.15em] uppercase animate-blink">
              SYS.ACTIVE &#9646;
            </span>
          </div>
          <div className="gold-gradient-divider mb-3" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-mono text-[9px] text-hsa-cream/30">Treatment</span>
              <span className="font-mono text-[9px] text-hsa-cream/60">{treatmentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono text-[9px] text-hsa-cream/30">Price</span>
              <span className="font-mono text-[9px] text-hsa-gold">
                £{offeredPrice.toLocaleString("en-GB")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono text-[9px] text-hsa-cream/30">Deposit</span>
              <span className="font-mono text-[9px] text-hsa-cream/60">£50 (refundable)</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono text-[9px] text-hsa-cream/30">Status</span>
              <span className={`font-mono text-[9px] ${isPaid ? "text-hsa-success" : "text-hsa-urgency"}`}>
                {isPaid ? "SECURED" : "PENDING"}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div variants={item} className="space-y-4">
        {!isPaid ? (
          <DepositButton
            patientId={patientId}
            offerId={offerId}
            token={token}
            treatmentName={treatmentName}
            isPrimary
          />
        ) : (
          <div className="btn-gold text-center pointer-events-none opacity-80">
            &#10003; Deposit Secured
          </div>
        )}

        <p className="font-mono text-[9px] text-hsa-cream/20 tracking-[0.1em] text-center">
          Or call us directly:{" "}
          <a href="tel:02071234567" className="text-hsa-gold/50 hover:text-hsa-gold transition-colors">
            020 7123 4567
          </a>
        </p>

        <div className="ruled-line mt-6">
          <span className="font-mono text-[8px] text-hsa-gold/25 tracking-[0.2em] uppercase">
            Harley Street Aesthetic Clinic &middot; London
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
