import { describe, expect, it } from "vitest";
import { formatCurrency, formatDate, formatPercent } from "./formatters";

describe("formatters", () => {
  it("formats currency in Turkish locale", () => {
    expect(formatCurrency(249.99, "TRY")).toContain("249,99");
  });

  it("formats date in readable Turkish format", () => {
    expect(formatDate("2026-06-24")).toContain("2026");
  });

  it("formats percentage with one decimal place", () => {
    expect(formatPercent(8.73)).toBe("%8.7");
  });
});
