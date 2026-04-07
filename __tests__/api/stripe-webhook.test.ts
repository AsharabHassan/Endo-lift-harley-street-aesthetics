import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockConstructEvent, mockUpdate, mockFrom, mockAddTag } = vi.hoisted(() => ({
  mockConstructEvent: vi.fn(),
  mockUpdate: vi.fn(),
  mockFrom: vi.fn(),
  mockAddTag: vi.fn(),
}));

vi.mock("@/lib/stripe", () => ({
  stripe: {
    webhooks: {
      constructEvent: mockConstructEvent,
    },
  },
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: mockFrom,
  },
}));

vi.mock("@/lib/ghl", () => ({
  addGhlContactTag: mockAddTag,
}));

import { POST } from "@/app/api/webhooks/stripe/route";

describe("POST /api/webhooks/stripe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
    mockAddTag.mockResolvedValue(undefined);
  });

  it("returns 400 on invalid signature", async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error("Invalid signature");
    });

    const request = new Request("http://localhost:3000/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "bad-sig" },
      body: "{}",
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("updates deposit and tags GHL contact on checkout.session.completed", async () => {
    const session = {
      id: "cs_test_123",
      metadata: {
        patient_id: "patient-1",
        offer_id: "offer-1",
        treatment_name: "Full Face Endolift",
      },
    };

    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: { object: session },
    });

    mockFrom.mockImplementation((table: string) => {
      const chain: any = {
        update: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
      };
      if (table === "deposits") {
        chain.eq = vi.fn().mockResolvedValue({ error: null });
        // Allow chaining .update().eq()
        chain.update = vi.fn().mockReturnValue({ eq: chain.eq });
      }
      if (table === "patients") {
        chain.single.mockResolvedValue({
          data: { ghl_contact_id: "ghl-contact-123" },
          error: null,
        });
      }
      return chain;
    });

    const request = new Request("http://localhost:3000/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "valid-sig" },
      body: JSON.stringify(session),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
    expect(mockAddTag).toHaveBeenCalledWith(
      "ghl-contact-123",
      "Deposit Paid — Full Face Endolift"
    );
  });

  it("ignores unrelated event types", async () => {
    mockConstructEvent.mockReturnValue({
      type: "payment_intent.created",
      data: { object: {} },
    });

    const request = new Request("http://localhost:3000/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "valid-sig" },
      body: "{}",
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(mockFrom).not.toHaveBeenCalled();
  });
});
