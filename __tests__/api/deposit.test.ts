import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockCreate, mockFrom } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
  mockFrom: vi.fn(),
}));

vi.mock("@/lib/stripe", () => ({
  stripe: {
    checkout: {
      sessions: {
        create: mockCreate,
      },
    },
  },
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: mockFrom,
  },
}));

import { POST } from "@/app/api/deposit/route";

describe("POST /api/deposit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_BASE_URL = "https://portal.example.com";
    mockCreate.mockResolvedValue({
      id: "cs_test_123",
      url: "https://checkout.stripe.com/pay/cs_test_123",
    });
  });

  it("creates a Stripe Checkout session for £50 deposit", async () => {
    mockFrom.mockImplementation((table: string) => {
      const chain: any = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
        insert: vi.fn(),
      };
      if (table === "patients") {
        chain.single.mockResolvedValue({
          data: { id: "patient-1", email: "sarah@example.com", first_name: "Sarah" },
          error: null,
        });
      }
      if (table === "offers") {
        chain.single.mockResolvedValue({
          data: {
            id: "offer-1",
            treatment_name: "Full Face Endolift",
            offered_price: 2795,
            patient_id: "patient-1",
          },
          error: null,
        });
      }
      if (table === "deposits") {
        chain.insert.mockResolvedValue({ error: null });
      }
      return chain;
    });

    const request = new Request("http://localhost:3000/api/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient_id: "patient-1",
        offer_id: "offer-1",
        token: "abc123def456ghi789jkl012",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.checkout_url).toBe("https://checkout.stripe.com/pay/cs_test_123");
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [
          expect.objectContaining({
            price_data: expect.objectContaining({
              unit_amount: 5000,
            }),
          }),
        ],
      })
    );
  });
});
