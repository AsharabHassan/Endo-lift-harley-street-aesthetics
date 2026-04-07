import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DepositButton } from "@/components/DepositButton";

const fetchSpy = vi.fn();
vi.stubGlobal("fetch", fetchSpy);

describe("DepositButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders primary button with £50 deposit text", () => {
    render(
      <DepositButton
        patientId="patient-1"
        offerId="offer-1"
        token="test-token"
        treatmentName="Full Face Endolift"
        isPrimary
      />
    );
    expect(screen.getByText("Secure With £50 Deposit")).toBeDefined();
  });

  it("renders secondary button with different text", () => {
    render(
      <DepositButton
        patientId="patient-1"
        offerId="offer-1"
        token="test-token"
        treatmentName="Neck Endolift"
        isPrimary={false}
      />
    );
    expect(screen.getByText("Secure This Treatment")).toBeDefined();
  });

  it("shows processing state when clicked", async () => {
    fetchSpy.mockResolvedValue({
      json: () => Promise.resolve({ checkout_url: "https://checkout.stripe.com/test" }),
    });

    // Mock window.location
    const locationAssign = vi.fn();
    Object.defineProperty(window, "location", {
      value: { href: "", assign: locationAssign },
      writable: true,
    });

    render(
      <DepositButton
        patientId="patient-1"
        offerId="offer-1"
        token="test-token"
        treatmentName="Full Face Endolift"
        isPrimary
      />
    );

    fireEvent.click(screen.getByText("Secure With £50 Deposit"));
    expect(screen.getByText("Processing...")).toBeDefined();
  });

  it("sends correct payload to /api/deposit", async () => {
    fetchSpy.mockResolvedValue({
      json: () => Promise.resolve({ checkout_url: "https://checkout.stripe.com/test" }),
    });

    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    });

    render(
      <DepositButton
        patientId="patient-1"
        offerId="offer-1"
        token="test-token"
        treatmentName="Full Face Endolift"
        isPrimary
      />
    );

    fireEvent.click(screen.getByText("Secure With £50 Deposit"));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: "patient-1",
          offer_id: "offer-1",
          token: "test-token",
        }),
      });
    });
  });

  it("shows error message on failure", async () => {
    fetchSpy.mockResolvedValue({
      json: () => Promise.resolve({ error: "Something went wrong" }),
    });

    render(
      <DepositButton
        patientId="patient-1"
        offerId="offer-1"
        token="test-token"
        treatmentName="Full Face Endolift"
        isPrimary
      />
    );

    fireEvent.click(screen.getByText("Secure With £50 Deposit"));

    await waitFor(() => {
      expect(screen.getByText("Something went wrong. Please try again or call us.")).toBeDefined();
    });
  });

  it("has correct aria-label for accessibility", () => {
    render(
      <DepositButton
        patientId="patient-1"
        offerId="offer-1"
        token="test-token"
        treatmentName="Full Face Endolift"
        isPrimary
      />
    );
    expect(
      screen.getByLabelText("Secure Full Face Endolift with £50 deposit")
    ).toBeDefined();
  });
});
