import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CountdownTimer } from "@/components/CountdownTimer";

describe("CountdownTimer", () => {
  it("displays days, hours, and minutes", () => {
    const target = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
    render(<CountdownTimer targetDate={target} />);
    expect(screen.getByText("DAYS")).toBeDefined();
    expect(screen.getByText("HOURS")).toBeDefined();
    expect(screen.getByText("MINS")).toBeDefined();
  });

  it("shows expired message when past target date", () => {
    const target = new Date(Date.now() - 1000).toISOString();
    render(<CountdownTimer targetDate={target} />);
    expect(screen.getByText(/offer still available/i)).toBeDefined();
  });
});
