import { describe, it, expect, afterEach } from "vitest";
import {
  getTreatment,
  getCaseStudy,
  resolveBookingUrl,
  isTreatmentType,
  TREATMENTS,
  TREATMENT_TYPES,
} from "@/lib/treatments";

describe("treatment registry", () => {
  describe("isTreatmentType", () => {
    it("accepts known types and rejects everything else", () => {
      expect(isTreatmentType("endolift")).toBe(true);
      expect(isTreatmentType("co2_laser")).toBe(true);
      expect(isTreatmentType("co2-laser")).toBe(false);
      expect(isTreatmentType("botox")).toBe(false);
      expect(isTreatmentType(null)).toBe(false);
      expect(isTreatmentType(undefined)).toBe(false);
    });
  });

  describe("getTreatment", () => {
    it("returns the matching config for each known type", () => {
      expect(getTreatment("endolift").id).toBe("endolift");
      expect(getTreatment("co2_laser").id).toBe("co2_laser");
    });

    it("falls back to endolift for missing or unknown types", () => {
      expect(getTreatment(null).id).toBe("endolift");
      expect(getTreatment(undefined).id).toBe("endolift");
      expect(getTreatment("nonsense").id).toBe("endolift");
    });

    it("every registered type has a populated config", () => {
      for (const type of TREATMENT_TYPES) {
        const t = TREATMENTS[type];
        expect(t.displayName.length).toBeGreaterThan(0);
        expect(t.welcomeBlurb.length).toBeGreaterThan(0);
        expect(Object.keys(t.caseStudies).length).toBeGreaterThan(0);
        expect(t.caseStudies[t.defaultCaseStudyKey]).toBeDefined();
      }
    });
  });

  describe("getCaseStudy", () => {
    it("resolves Endolift areas (exact + fuzzy)", () => {
      const endolift = getTreatment("endolift");
      expect(getCaseStudy(endolift, "face")).toBe(endolift.caseStudies.face);
      expect(getCaseStudy(endolift, "neck")).toBe(endolift.caseStudies.neck);
      // fuzzy: "eyes" -> periorbital
      expect(getCaseStudy(endolift, "eyes")).toBe(
        endolift.caseStudies.periorbital
      );
    });

    it("resolves CO2 areas and falls back to the default key", () => {
      const co2 = getTreatment("co2_laser");
      expect(getCaseStudy(co2, "full-face")).toBe(
        co2.caseStudies["full-face"]
      );
      expect(getCaseStudy(co2, "acne-scarring")).toBe(
        co2.caseStudies["acne-scarring"]
      );
      // unknown area -> default key
      expect(getCaseStudy(co2, "somewhere-unknown")).toBe(
        co2.caseStudies[co2.defaultCaseStudyKey]
      );
    });
  });

  describe("resolveBookingUrl", () => {
    const ENV_KEYS = [
      "BOOKING_SYSTEM_URL",
      "BOOKING_SYSTEM_URL_ENDOLIFT",
      "BOOKING_SYSTEM_URL_CO2_LASER",
    ];
    afterEach(() => {
      for (const k of ENV_KEYS) delete process.env[k];
    });

    it("prefers the treatment-specific env var", () => {
      process.env.BOOKING_SYSTEM_URL = "https://generic.example.com";
      process.env.BOOKING_SYSTEM_URL_CO2_LASER = "https://co2.example.com";
      expect(resolveBookingUrl("co2_laser")).toBe("https://co2.example.com");
    });

    it("falls back to the shared BOOKING_SYSTEM_URL", () => {
      process.env.BOOKING_SYSTEM_URL = "https://generic.example.com";
      expect(resolveBookingUrl("co2_laser")).toBe(
        "https://generic.example.com"
      );
    });

    it("returns '#' when nothing is configured", () => {
      expect(resolveBookingUrl("endolift")).toBe("#");
    });
  });
});
