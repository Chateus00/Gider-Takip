import { describe, expect, it } from "vitest";
import {
  connectEmailAccount,
  createSubscription,
  getDashboardData,
  getDiscoverItems,
  simulateIntake,
} from "./subscriptions";

describe("intake simulations", () => {
  it("returns preview items for email intake", () => {
    const result = simulateIntake({ method: "email", provider: "Gmail" });

    expect(result.method).toBe("email");
    expect(result.preview.length).toBeGreaterThan(0);
    expect(result.provider).toBe("Gmail");
  });

  it("connects an email account and returns subscription candidates", () => {
    const result = connectEmailAccount({
      provider: "gmail",
      email: "demo@example.com",
    });

    expect(result.connection.email).toBe("demo@example.com");
    expect(result.preview.length).toBeGreaterThan(0);
  });

  it("stores multiple connected mail accounts on the dashboard", () => {
    connectEmailAccount({
      provider: "gmail",
      email: "first@example.com",
    });
    connectEmailAccount({
      provider: "outlook",
      email: "second@example.com",
    });

    const dashboard = getDashboardData();

    expect(dashboard.connections.length).toBeGreaterThanOrEqual(2);
    expect(dashboard.connections.some((item) => item.email === "first@example.com")).toBe(true);
    expect(dashboard.connections.some((item) => item.email === "second@example.com")).toBe(true);
  });

  it("preserves detection metadata on created subscriptions", () => {
    const created = createSubscription({
      name: "Test Subscription",
      category: "Test",
      logoUrl: "https://example.com/logo.png",
      currentAmount: 10,
      currency: "TRY",
      billingCycle: "monthly",
      nextPaymentDate: "2026-08-01",
      reminderDaysBefore: 2,
      notes: "demo",
      detectionMethod: "banking",
      detectionConfidence: 0.92,
    });

    expect(created.detectionMethod).toBe("banking");
    expect(created.detectionConfidence).toBe(0.92);
  });

  it("excludes subscribed apps from the discover catalog", () => {
    createSubscription({
      name: "Spotify Premium",
      category: "Muzik",
      logoUrl: "https://example.com/spotify.png",
      currentAmount: 99,
      currency: "TRY",
      billingCycle: "monthly",
      nextPaymentDate: "2026-08-01",
      reminderDaysBefore: 2,
      notes: "demo",
      detectionMethod: "email",
      detectionConfidence: 0.93,
    });

    const result = getDiscoverItems("Spotify");
    expect(result.items.some((item) => item.name.includes("Spotify"))).toBe(false);
  });
});
