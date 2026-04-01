"use client";

import { useState } from "react";

interface DepositButtonProps {
  patientId: string;
  offerId: string;
  token: string;
  treatmentName: string;
  isPrimary: boolean;
}

export function DepositButton({
  patientId,
  offerId,
  token,
  treatmentName,
  isPrimary,
}: DepositButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientId,
          offer_id: offerId,
          token,
        }),
      });

      const data = await res.json();

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }

  if (isPrimary) {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full gold-gradient-button text-white font-semibold py-3.5 rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
        aria-label={`Secure ${treatmentName} with £50 deposit`}
      >
        {loading ? "Processing..." : "Secure With £50 Deposit"}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full border border-hsa-gold text-hsa-gold font-semibold py-3 rounded-lg transition-colors hover:bg-hsa-gold/10 disabled:opacity-50"
      aria-label={`Secure ${treatmentName} treatment`}
    >
      {loading ? "Processing..." : "Secure This Treatment"}
    </button>
  );
}
