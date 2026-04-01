"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: string;
}

function calcRemaining(target: string) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  return { days, hours, mins };
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(() => calcRemaining(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(calcRemaining(targetDate));
    }, 60_000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!remaining) {
    return (
      <div className="bg-hsa-card-primary border border-hsa-border-subtle rounded-lg px-6 py-4 text-center">
        <p className="text-hsa-gold text-sm">
          Offer still available — book now to secure your price
        </p>
      </div>
    );
  }

  return (
    <div className="bg-hsa-card-primary border border-hsa-border-subtle rounded-lg px-6 py-5">
      <p className="label-uppercase text-hsa-gold text-center mb-4">
        Offer expires in
      </p>
      <div className="flex justify-center gap-6">
        {[
          { value: remaining.days, label: "DAYS" },
          { value: remaining.hours, label: "HOURS" },
          { value: remaining.mins, label: "MINS" },
        ].map(({ value, label }) => (
          <div key={label} className="text-center">
            <span className="text-3xl font-bold text-white tabular-nums">
              {String(value).padStart(2, "0")}
            </span>
            <p className="label-uppercase text-hsa-text-muted mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
