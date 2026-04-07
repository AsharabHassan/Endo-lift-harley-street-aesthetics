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
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
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
        setError("Something went wrong. Please try again or call us.");
        setLoading(false);
      }
    } catch {
      setError("Connection error. Please check your internet and try again.");
      setLoading(false);
    }
  }

  const errorMessage = error ? (
    <p className="font-mono text-[9px] text-red-400 mt-2 text-center">{error}</p>
  ) : null;

  if (isPrimary) {
    return (
      <div>
        <button
          onClick={handleClick}
          disabled={loading}
          className="btn-gold w-full disabled:opacity-50"
          aria-label={`Secure ${treatmentName} with £50 deposit`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </span>
          ) : (
            "Secure With £50 Deposit"
          )}
        </button>
        {errorMessage}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="btn-outline w-full disabled:opacity-50"
        aria-label={`Secure ${treatmentName} treatment`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing...
          </span>
        ) : (
          "Secure This Treatment"
        )}
      </button>
      {errorMessage}
    </div>
  );
}
