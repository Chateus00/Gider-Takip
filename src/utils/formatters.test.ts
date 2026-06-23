import { describe, expect, it } from "vitest";
import { formatCurrency, formatCurrencyGroups, formatDate, formatPercent } from "./formatters";

describe("formatters", () => {
  it("formats currency in Turkish locale", () => {
    expect(formatCurrency(249.99, "TRY")).toContain("249,99");
  });

  it("formats date in readable Turkish format", () => {
    expect(formatDate("2026-06-24")).toContain("2026");
  });

  it("formats percentage with locale-aware decimal separator", () => {
    expect(formatPercent(8.73)).toBe("%8,7");
  });

  it("formats grouped currency amounts without forcing TRY", () => {
    const result = formatCurrencyGroups({ USD: 20, EUR: 10 });

    expect(result).toContain("$20");
    expect(result).toContain("10,00");
  });
});
