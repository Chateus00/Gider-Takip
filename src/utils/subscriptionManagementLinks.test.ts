import { describe, expect, it } from "vitest";
import { getSubscriptionManagementUrl } from "@/utils/subscriptionManagementLinks";

describe("getSubscriptionManagementUrl", () => {
  it("returns the official management page for supported subscriptions", () => {
    expect(getSubscriptionManagementUrl("Netflix Premium")).toBe("https://www.netflix.com/YourAccount");
    expect(getSubscriptionManagementUrl("YouTube Premium")).toBe("https://www.youtube.com/paid_memberships");
    expect(getSubscriptionManagementUrl("Spotify Bireysel")).toBe("https://www.spotify.com/account/subscription/");
  });

  it("returns null when no management page is defined", () => {
    expect(getSubscriptionManagementUrl("Bilinmeyen Servis")).toBeNull();
  });
});
