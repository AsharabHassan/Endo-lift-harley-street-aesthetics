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

const areas = [
  { id: "01", name: "Full Face" },
  { id: "02", name: "Neck" },
  { id: "03", name: "Jawline" },
  { id: "04", name: "Periorbital" },
];

interface DoctorScreenProps {
  name: string;
  title: string;
  credentials: string;
  imageUrl?: string;
}

export function DoctorScreen({ name, title, credentials, imageUrl }: DoctorScreenProps) {
  const initials = name.split(" ").map((n) => n[0]).join("");

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col flex-1"
    >
      {/* Label */}
      <motion.p variants={item} className="label-xs text-hsa-gold/55 mb-3">
        Your Expert
      </motion.p>

      {/* Title */}
      <motion.h2
        variants={item}
        className="font-serif italic text-[1.8rem] leading-[1.15] tracking-tight text-hsa-cream mb-8"
      >
        Meet Your Practitioner
      </motion.h2>

      {/* Doctor card */}
      <motion.div variants={item} className="card-dark p-6 mb-8">
        <div className="flex gap-5 items-center mb-5">
          {/* Photo */}
          <div className="shrink-0 w-20 h-20 rounded-full overflow-hidden bg-hsa-bg-elevated border border-hsa-border-gold">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gradient-gold text-xl font-serif italic font-bold">
                {initials}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-serif italic text-xl text-hsa-cream">{name}</h3>
            <p className="font-mono text-[9px] text-hsa-gold/60 tracking-[0.15em] uppercase mt-1">{title}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex gap-2 mb-5">
          <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-hsa-success border border-hsa-success/20 bg-hsa-success-dark/20 px-2.5 py-1">
            &#10003; GMC Verified
          </span>
          <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-hsa-gold/70 border border-hsa-border-gold bg-hsa-gold/5 px-2.5 py-1">
            &#10029; FRCS (Plast)
          </span>
        </div>

        <div className="gold-gradient-divider my-4" />

        <p className="font-mono text-[10px] text-hsa-cream/40 leading-relaxed tracking-[0.05em]">
          {credentials}
        </p>
      </motion.div>

      {/* Treatment areas */}
      <motion.div variants={item}>
        <p className="label-xs text-hsa-gold/40 mb-4">Treatment Areas</p>
        <div className="space-y-0">
          {areas.map((area) => (
            <div
              key={area.id}
              className="flex items-center gap-3 py-3 border-b border-hsa-border-subtle"
            >
              <span className="font-mono text-[9px] text-hsa-gold/30">{area.id}</span>
              <span className="font-serif italic text-sm text-hsa-cream/60">{area.name}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
