import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

vi.mock("@/lib/tokens", () => ({
  generateToken: vi.fn().mockReturnValue("abc123def456ghi789jkl012"),
}));

vi.mock("@/lib/ghl", () => ({
  updateGhlContactField: vi.fn().mockResolvedValue(undefined),
}));

import { POST } from "@/app/api/webhooks/ghl/route";
import { supabase } from "@/lib/supabase";

describe("POST /api/webhooks/ghl", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GHL_WEBHOOK_SECRET = "test-secret";
    process.env.NEXT_PUBLIC_BASE_URL = "https://portal.example.com";
  });

  const mockPatient = {
    id: "patient-uuid-123",
    token: "abc123def456ghi789jkl012",
  };

  // Returns the captured patient insert payload alongside the supabase mock.
  function mockSupabaseCapturingPatientInsert() {
    const captured: { row?: Record<string, unknown> } = {};
    vi.mocked(supabase.from).mockImplementation((table: string) => {
      const chain: any = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn(),
      };
      if (table === "patients") {
        chain.insert = vi.fn((row: Record<string, unknown>) => {
          captured.row = row;
          return chain;
        });
        chain.single.mockResolvedValue({ data: mockPatient, error: null });
      }
      if (table === "offers") {
        // insert returns directly (no .select().single())
        chain.insert = vi.fn().mockResolvedValue({ error: null });
      }
      return chain;
    });
    return captured;
  }

  const basePayload = {
    contact_id: "ghl-contact-123",
    first_name: "Sarah",
    email: "sarah@example.com",
    phone: "+447700900000",
    consultation_date: "2026-03-28T10:00:00Z",
    suitability_score: 8,
    offers: [
      {
        treatment_name: "Full Face Endolift",
        treatment_area: "face",
        original_price: 3495,
        offered_price: 2795,
        bonus_inclusion: "Free upper jawline",
        is_primary: true,
      },
    ],
  };

  function postPayload(payload: unknown) {
    const request = new Request("http://localhost:3000/api/webhooks/ghl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return POST(request);
  }

  it("creates a patient and offers from valid GHL webhook payload", async () => {
    mockSupabaseCapturingPatientInsert();

    const response = await postPayload(basePayload);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.token).toBe("abc123def456ghi789jkl012");
    expect(data.portal_url).toBe(
      "https://portal.example.com/p/abc123def456ghi789jkl012"
    );
  });

  it("defaults treatment_type to endolift when omitted", async () => {
    const captured = mockSupabaseCapturingPatientInsert();

    const response = await postPayload(basePayload);

    expect(response.status).toBe(200);
    expect(captured.row?.treatment_type).toBe("endolift");
  });

  it("normalises a CO2 treatment_type from GHL", async () => {
    const captured = mockSupabaseCapturingPatientInsert();

    const response = await postPayload({
      ...basePayload,
      treatment_type: "CO2 Laser",
    });

    expect(response.status).toBe(200);
    expect(captured.row?.treatment_type).toBe("co2_laser");
  });

  it("rejects requests with invalid payload", async () => {
    const request = new Request("http://localhost:3000/api/webhooks/ghl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
