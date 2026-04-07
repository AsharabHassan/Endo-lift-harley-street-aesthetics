import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OfferCard } from "@/components/OfferCard";

describe("OfferCard", () => {
  const mockOffer = {
    id: "offer-1",
    patient_id: "patient-1",
    treatment_name: "Full Face Endolift",
    treatment_area: "face",
    original_price: 3495,
    offered_price: 2795,
    bonus_inclusion: "Free upper jawline",
    countdown_days: 7,
    is_primary: true,
    created_at: "2026-04-01",
  };

  it("displays treatment name and pricing", () => {
    render(<OfferCard offer={mockOffer} patientId="patient-1" token="test-token" />);
    expect(screen.getByText("Full Face Endolift")).toBeDefined();
    expect(screen.getByText("£3,495")).toBeDefined();
    expect(screen.getByText("£2,795")).toBeDefined();
  });

  it("displays bonus inclusion when present", () => {
    render(<OfferCard offer={mockOffer} patientId="patient-1" token="test-token" />);
    expect(screen.getByText("Free upper jawline")).toBeDefined();
  });
});
