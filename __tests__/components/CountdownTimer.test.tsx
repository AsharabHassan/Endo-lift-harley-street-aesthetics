import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CountdownTimer } from "@/components/CountdownTimer";

describe("CountdownTimer", () => {
  it("displays days, hours, and minutes", () => {
    const target = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
    render(<CountdownTimer targetDate={target} />);
    expect(screen.getByText("Days")).toBeDefined();
    expect(screen.getByText("Hours")).toBeDefined();
    expect(screen.getByText("Mins")).toBeDefined();
    expect(screen.getByText("Secs")).toBeDefined();
  });

  it("shows expired message when past target date", () => {
    const target = new Date(Date.now() - 1000).toISOString();
    render(<CountdownTimer targetDate={target} />);
    expect(screen.getByText(/offer still available/i)).toBeDefined();
  });
});
