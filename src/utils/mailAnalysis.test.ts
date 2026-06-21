import { describe, expect, it } from "vitest";
import { extractSubscriptionsFromMessages, type MailMessageCandidate } from "@/utils/mailAnalysis";

describe("extractSubscriptionsFromMessages", () => {
  it("gmail maillerinden bilinen abonelikleri ve tutari cikarir", () => {
    const messages: MailMessageCandidate[] = [
      {
        id: "1",
        subject: "Spotify Premium receipt",
        from: "Spotify <no-reply@spotify.com>",
        snippet: "Your payment of TRY 99.99 for Premium Individual was successful.",
        receivedAt: "2026-06-01T10:00:00.000Z",
      },
    ];

    const result = extractSubscriptionsFromMessages("gmail", "kullanici@example.com", messages);

    expect(result.preview).toHaveLength(1);
    expect(result.preview[0]?.name).toBe("Spotify Premium");
    expect(result.preview[0]?.currentAmount).toBe(99.99);
    expect(result.preview[0]?.currency).toBe("TRY");
  });

  it("yinelenen servis maillerinde en guvenli adayi korur", () => {
    const messages: MailMessageCandidate[] = [
      {
        id: "1",
        subject: "Netflix payment confirmation",
        from: "Netflix <info@netflix.com>",
        snippet: "Payment received.",
        receivedAt: "2026-06-01T10:00:00.000Z",
      },
      {
        id: "2",
        subject: "Netflix invoice",
        from: "Netflix <billing@netflix.com>",
        snippet: "Invoice total TRY 189.99 for your monthly plan.",
        receivedAt: "2026-06-02T10:00:00.000Z",
      },
    ];

    const result = extractSubscriptionsFromMessages("gmail", "kullanici@example.com", messages);

    expect(result.preview).toHaveLength(1);
    expect(result.preview[0]?.name).toBe("Netflix Premium");
    expect(result.preview[0]?.currentAmount).toBe(189.99);
    expect(result.preview[0]?.confidence).toBeGreaterThanOrEqual(0.9);
  });

  it("fatura sinyali olmayan mailleri abonelik olarak eklemez", () => {
    const messages: MailMessageCandidate[] = [
      {
        id: "1",
        subject: "Merhaba",
        from: "arkadas@example.com",
        snippet: "Hafta sonu kahve icelim mi?",
        receivedAt: "2026-06-01T10:00:00.000Z",
      },
    ];

    const result = extractSubscriptionsFromMessages("outlook", "kullanici@example.com", messages);

    expect(result.preview).toHaveLength(0);
  });
});
