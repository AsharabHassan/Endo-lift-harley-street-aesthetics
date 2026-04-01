import { describe, it, expect } from "vitest";
import { generateToken } from "@/lib/tokens";

describe("generateToken", () => {
  it("returns a 24-character string", () => {
    const token = generateToken();
    expect(token).toHaveLength(24);
  });

  it("contains only URL-safe characters", () => {
    const token = generateToken();
    expect(token).toMatch(/^[a-zA-Z0-9_-]+$/);
  });

  it("generates unique tokens", () => {
    const tokens = new Set(Array.from({ length: 100 }, () => generateToken()));
    expect(tokens.size).toBe(100);
  });
});
