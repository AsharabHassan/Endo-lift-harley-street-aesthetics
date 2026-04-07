"use client";

const STEP_LABELS = ["Welcome", "Your Offer", "Results", "Doctor", "Book"];

interface StepNavProps {
  current: number;
  total: number;
  onBack: () => void;
  onNext: () => void;
}

export function StepNav({ current, total, onBack, onNext }: StepNavProps) {
  const isFirst = current === 0;
  const isLast = current === total - 1;

  return (
    <div className="flex items-center justify-between mt-auto pt-8">
      {/* Back */}
      {!isFirst ? (
        <button
          onClick={onBack}
          className="font-mono text-[9px] tracking-[0.2em] uppercase text-hsa-gold/50 hover:text-hsa-gold transition-colors"
        >
          &larr; Back
        </button>
      ) : (
        <div />
      )}

      {/* Dots */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`step-dot ${i === current ? "active" : i < current ? "completed" : ""}`}
          />
        ))}
      </div>

      {/* Next */}
      {!isLast ? (
        <button
          onClick={onNext}
          className="font-mono text-[9px] tracking-[0.2em] uppercase text-hsa-gold/50 hover:text-hsa-gold transition-colors"
        >
          Next &rarr;
        </button>
      ) : (
        <div />
      )}
    </div>
  );
}

export function StepLabel({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <span className="label-xs text-hsa-gold/40">
        {String(current + 1).padStart(2, "0")} / {String(STEP_LABELS.length).padStart(2, "0")}
      </span>
      <span className="label-xs text-hsa-gold/40">
        {STEP_LABELS[current]}
      </span>
    </div>
  );
}
