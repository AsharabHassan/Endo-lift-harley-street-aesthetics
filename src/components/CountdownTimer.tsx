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
  const secs = Math.floor((diff / 1000) % 60);
  return { days, hours, mins, secs };
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [mounted, setMounted] = useState(false);
  const [remaining, setRemaining] = useState<ReturnType<typeof calcRemaining>>(null);

  useEffect(() => {
    setRemaining(calcRemaining(targetDate));
    setMounted(true);

    const interval = setInterval(() => {
      setRemaining(calcRemaining(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (mounted && !remaining) {
    return (
      <div className="card-dark px-4 py-3 text-center">
        <p className="font-mono text-[9px] text-hsa-gold tracking-[0.15em] uppercase">
          Offer still available — book now to secure your price
        </p>
      </div>
    );
  }

  const units = [
    { value: remaining?.days ?? 0, label: "Days" },
    { value: remaining?.hours ?? 0, label: "Hrs" },
    { value: remaining?.mins ?? 0, label: "Min" },
    { value: remaining?.secs ?? 0, label: "Sec" },
  ];

  return (
    <div className="card-dark px-4 py-4">
      <p className="font-mono text-[8px] text-hsa-urgency tracking-[0.2em] uppercase text-center mb-3">
        Exclusive offer expires in
      </p>
      <div className="flex justify-center gap-2">
        {units.map(({ value, label }) => (
          <div key={label} className="text-center">
            <div className="bg-hsa-bg w-14 h-14 flex items-center justify-center border border-hsa-border-subtle">
              <span className="font-mono text-xl font-bold text-hsa-cream tabular-nums">
                {mounted ? String(value).padStart(2, "0") : "--"}
              </span>
            </div>
            <p className="font-mono text-[8px] text-hsa-gold/30 uppercase tracking-[0.15em] mt-1.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
