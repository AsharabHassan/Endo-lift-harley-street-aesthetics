"use client";

import { useEffect } from "react";

export function PageViewTracker({ patientId }: { patientId: string }) {
  useEffect(() => {
    const device = window.innerWidth < 768 ? "mobile" : "desktop";
    const params = new URLSearchParams(window.location.search);
    const source = params.get("utm_source") || "direct";

    fetch("/api/tracking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient_id: patientId,
        device,
        source,
      }),
    }).catch(() => {}); // Fire-and-forget
  }, [patientId]);

  return null;
}
