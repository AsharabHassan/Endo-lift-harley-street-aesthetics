"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

interface WelcomeScreenProps {
  firstName: string;
  consultationDate?: string | null;
  onNext: () => void;
}

export function WelcomeScreen({ firstName, consultationDate, onNext }: WelcomeScreenProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col flex-1"
    >
      {/* Logo */}
      <motion.div variants={item} className="mb-10">
        <Image src="/hsa-logo.png" alt="HSA" width={48} height={48} priority />
      </motion.div>

      {/* Spacer */}
      <div className="flex-1 flex flex-col justify-center">
        {/* Label */}
        <motion.p variants={item} className="label-xs text-hsa-gold/55 mb-4">
          Your Personal Treatment Portal
        </motion.p>

        {/* Hero headline */}
        <motion.h1
          variants={item}
          className="font-serif italic text-[2.4rem] leading-[1.1] tracking-tight text-hsa-cream mb-6"
        >
          Welcome back,
          <br />
          <span className="text-gradient-gold">{firstName}</span>
        </motion.h1>

        {/* Ruled line */}
        <motion.div variants={item} className="gold-line mb-6" />

        {/* Description */}
        <motion.p variants={item} className="font-mono text-[10px] leading-relaxed tracking-[0.05em] text-hsa-cream/55 mb-8 max-w-xs">
          Your personalised Endolift treatment plan has been curated by our specialist team at Harley Street Aesthetic Clinic.
        </motion.p>

        {/* Feature list */}
        <motion.div variants={item} className="space-y-3 mb-10">
          {[
            ["01", "Exclusive pricing tailored to you"],
            ["02", "Real before & after results"],
            ["03", "Meet your practitioner"],
            ["04", "Secure with a refundable deposit"],
          ].map(([num, text]) => (
            <div key={num} className="flex items-start gap-3">
              <span className="font-mono text-[9px] text-hsa-gold/40 mt-0.5">{num}</span>
              <span className="font-mono text-[10px] text-hsa-cream/45 tracking-[0.05em]">{text}</span>
            </div>
          ))}
        </motion.div>

        {consultationDate && (
          <motion.p variants={item} className="font-mono text-[9px] text-hsa-gold/30 tracking-[0.15em] uppercase mb-8">
            Consultation: {consultationDate}
          </motion.p>
        )}
      </div>

      {/* CTA */}
      <motion.div variants={item}>
        <button onClick={onNext} className="btn-gold">
          View Your Offer
        </button>
      </motion.div>
    </motion.div>
  );
}
