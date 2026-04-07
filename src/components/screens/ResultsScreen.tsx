"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { PatientStoryCarousel } from "@/components/PatientStory";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const ANALYSIS_STEPS = [
  { id: "01", label: "LOADING CASE FILES", duration: 800 },
  { id: "02", label: "MATCHING TREATMENT AREA", duration: 600 },
  { id: "03", label: "RETRIEVING PATIENT DATA", duration: 700 },
  { id: "04", label: "COMPARING BEFORE / AFTER", duration: 900 },
  { id: "05", label: "COMPILING TESTIMONIALS", duration: 500 },
  { id: "06", label: "PREPARING RESULTS", duration: 400 },
];

// Total ~3.9s

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

interface ResultsScreenProps {
  treatmentArea: string;
  pairs: BeforeAfterPair[];
  patientStories: PatientStoryData[];
}

function AnalyzingOverlay({ treatmentArea, onComplete }: { treatmentArea: string; onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    function advanceStep(step: number) {
      if (step >= ANALYSIS_STEPS.length) {
        // Small pause then reveal
        timeout = setTimeout(onComplete, 300);
        return;
      }
      setCurrentStep(step);
      timeout = setTimeout(() => advanceStep(step + 1), ANALYSIS_STEPS[step].duration);
    }

    advanceStep(0);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col flex-1"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between mb-10">
        <span className="font-mono text-[8px] text-hsa-gold/40 tracking-[0.2em] uppercase">
          HSA &middot; Results Engine
        </span>
        <span className="font-mono text-[8px] text-hsa-gold/30 tracking-[0.15em] animate-blink">
          SYS.ACTIVE &#9646;
        </span>
      </div>

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Big title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-serif italic text-[2.2rem] tracking-tight text-hsa-cream text-center mb-3"
        >
          Analysing
        </motion.h2>

        <motion.p
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="font-mono text-[9px] text-hsa-gold/50 tracking-[0.3em] uppercase mb-12"
        >
          Processing {treatmentArea} data...
        </motion.p>

        {/* Scan table */}
        <div className="w-full max-w-xs space-y-0">
          {ANALYSIS_STEPS.map((step, i) => {
            const status = i < currentStep ? "DONE" : i === currentStep ? "SCAN" : "WAIT";
            const isActive = i === currentStep;
            const isDone = i < currentStep;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: isDone ? 0.6 : isActive ? 1 : 0.3 }}
                className="flex items-center py-2 border-b border-hsa-border-subtle"
              >
                <span className={`font-mono text-[9px] w-6 ${isDone ? "text-hsa-gold/50" : isActive ? "text-hsa-gold" : "text-hsa-gold/20"}`}>
                  {step.id}
                </span>
                <span className={`font-mono text-[8px] tracking-[0.15em] uppercase flex-1 ${isDone ? "text-hsa-cream/30" : isActive ? "text-hsa-cream/70" : "text-hsa-cream/15"}`}>
                  {step.label}
                </span>
                <span className="font-mono text-[8px] tracking-[0.1em] text-hsa-cream/15 mx-2">
                  ··········
                </span>
                <span className={`font-mono text-[8px] tracking-[0.15em] ${
                  isDone ? "text-hsa-success/70" : isActive ? "text-hsa-gold" : "text-hsa-cream/15"
                }`}>
                  {status}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs mt-8">
          <div className="h-px bg-hsa-border-subtle overflow-hidden">
            <motion.div
              className="h-full bg-hsa-gold"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStep + 1) / ANALYSIS_STEPS.length) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-mono text-[8px] text-hsa-gold/30">
              {String(Math.round(((currentStep + 1) / ANALYSIS_STEPS.length) * 100))}%
            </span>
            <span className="font-mono text-[8px] text-hsa-cream/15">
              {currentStep + 1}/{ANALYSIS_STEPS.length} TASKS
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ResultsScreen({ treatmentArea, pairs, patientStories }: ResultsScreenProps) {
  const [analyzing, setAnalyzing] = useState(true);

  if (analyzing) {
    return (
      <AnalyzingOverlay
        treatmentArea={treatmentArea}
        onComplete={() => setAnalyzing(false)}
      />
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col flex-1"
    >
      {/* Label */}
      <motion.p variants={item} className="label-xs text-hsa-gold/55 mb-3">
        Real Results
      </motion.p>

      {/* Title */}
      <motion.h2
        variants={item}
        className="font-serif italic text-[1.8rem] leading-[1.15] tracking-tight text-hsa-cream mb-2"
      >
        Before &amp; After
      </motion.h2>

      <motion.p variants={item} className="font-mono text-[10px] text-hsa-cream/35 tracking-[0.05em] capitalize mb-8">
        Actual patient results &middot; {treatmentArea} treatments
      </motion.p>

      {/* Before/After pairs */}
      <motion.div variants={item} className="space-y-6 mb-10">
        {pairs.map((pair, index) => (
          <div key={index} className="card-dark overflow-hidden">
            <div className="grid grid-cols-2">
              <div className="relative aspect-[4/3] bg-hsa-bg-elevated">
                <Image
                  src={pair.beforeUrl}
                  alt="Before treatment"
                  fill
                  sizes="50vw"
                  className="object-cover"
                  unoptimized
                />
                <span className="absolute bottom-2 left-2 font-mono text-[8px] tracking-[0.2em] uppercase text-white bg-black/70 backdrop-blur-sm px-2 py-1">
                  Before
                </span>
              </div>
              <div className="relative aspect-[4/3] bg-hsa-bg-elevated">
                <Image
                  src={pair.afterUrl}
                  alt="After treatment"
                  fill
                  sizes="50vw"
                  className="object-cover"
                  unoptimized
                />
                <span className="absolute bottom-2 left-2 font-mono text-[8px] tracking-[0.2em] uppercase text-hsa-gold bg-black/70 backdrop-blur-sm px-2 py-1">
                  After
                </span>
              </div>
            </div>

            {pair.quote && (
              <div className="p-4 border-t border-hsa-border-subtle">
                <p className="font-serif italic text-sm text-hsa-cream/80 leading-relaxed">
                  &ldquo;{pair.quote}&rdquo;
                </p>
                <p className="font-mono text-[9px] text-hsa-gold/30 mt-2">
                  &mdash; {pair.attribution}
                </p>
              </div>
            )}
          </div>
        ))}
      </motion.div>

      {/* Ruled line */}
      <motion.div variants={item} className="ruled-line mb-8">
        <span className="label-xs text-hsa-gold/40">Testimonials</span>
      </motion.div>

      {/* Patient stories carousel */}
      <motion.div variants={item}>
        <PatientStoryCarousel stories={patientStories} />
      </motion.div>
    </motion.div>
  );
}
