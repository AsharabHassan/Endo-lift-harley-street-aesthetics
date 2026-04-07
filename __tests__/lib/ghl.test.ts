import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const fetchSpy = vi.fn();
vi.stubGlobal("fetch", fetchSpy);

describe("GHL client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GHL_API_KEY = "test-api-key";
    process.env.GHL_LOCATION_ID = "test-location-id";
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe("updateGhlContactField", () => {
    it("sends a PUT request with custom field data", async () => {
      fetchSpy.mockResolvedValue({ ok: true });

      const { updateGhlContactField } = await import("@/lib/ghl");
      await updateGhlContactField("contact-123", "portal_link", "https://example.com/p/abc");

      expect(fetchSpy).toHaveBeenCalledWith(
        "https://services.leadconnectorhq.com/contacts/contact-123",
        expect.objectContaining({
          method: "PUT",
          headers: expect.objectContaining({
            Authorization: "Bearer test-api-key",
            "Location-Id": "test-location-id",
          }),
          body: JSON.stringify({
            customFields: [{ key: "portal_link", value: "https://example.com/p/abc" }],
          }),
        })
      );
    });

    it("throws on non-ok response", async () => {
      fetchSpy.mockResolvedValue({ ok: false, status: 404, statusText: "Not Found" });

      const { updateGhlContactField } = await import("@/lib/ghl");
      await expect(
        updateGhlContactField("contact-123", "portal_link", "https://example.com")
      ).rejects.toThrow("GHL API error: 404 Not Found");
    });
  });

  describe("addGhlContactTag", () => {
    it("sends a POST request with tag data", async () => {
      fetchSpy.mockResolvedValue({ ok: true });

      const { addGhlContactTag } = await import("@/lib/ghl");
      await addGhlContactTag("contact-123", "Deposit Paid — Full Face Endolift");

      expect(fetchSpy).toHaveBeenCalledWith(
        "https://services.leadconnectorhq.com/contacts/contact-123/tags",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ tags: ["Deposit Paid — Full Face Endolift"] }),
        })
      );
    });

    it("throws on non-ok response", async () => {
      fetchSpy.mockResolvedValue({ ok: false, status: 500, statusText: "Internal Server Error" });

      const { addGhlContactTag } = await import("@/lib/ghl");
      await expect(
        addGhlContactTag("contact-123", "Portal Viewed")
      ).rejects.toThrow("GHL API error: 500 Internal Server Error");
    });
  });
});
