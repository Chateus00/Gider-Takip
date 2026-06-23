import type {
  BillingCycle,
  EmailAnalysisResponse,
  EmailProvider,
  IntakePreviewItem,
} from "../../shared/subscriptions";

export interface MailMessageCandidate {
  id: string;
  subject: string;
  from: string;
  snippet: string;
  receivedAt: string;
}

interface ServiceDefinition {
  matchers: RegExp[];
  name: string;
  category: string;
  defaultAmount: number;
  defaultCurrency: string;
  defaultCycle: BillingCycle;
  logoPrompt: string;
}

const imageBase =
  "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=square&prompt=";

const serviceCatalog: ServiceDefinition[] = [
  {
    matchers: [/netflix/i],
    name: "Netflix Premium",
    category: "Video",
    defaultAmount: 189.99,
    defaultCurrency: "TRY",
    defaultCycle: "monthly",
    logoPrompt: "netflix premium app icon, black red glossy mobile tile, realistic",
  },
  {
    matchers: [/spotify/i],
    name: "Spotify Premium",
    category: "Müzik",
    defaultAmount: 99,
    defaultCurrency: "TRY",
    defaultCycle: "monthly",
    logoPrompt: "spotify premium app icon, green black music tile, realistic",
  },
  {
    matchers: [/youtube\s*premium/i, /youtube/i],
    name: "YouTube Premium",
    category: "Video",
    defaultAmount: 119.99,
    defaultCurrency: "TRY",
    defaultCycle: "monthly",
    logoPrompt: "youtube premium app icon, red white premium tile, realistic",
  },
  {
    matchers: [/icloud/i, /apple\s*services/i, /apple/i],
    name: "iCloud+ 200 GB",
    category: "Bulut",
    defaultAmount: 129.99,
    defaultCurrency: "TRY",
    defaultCycle: "monthly",
    logoPrompt: "icloud storage app icon, silver blue cloud tile, realistic",
  },
  {
    matchers: [/disney/i],
    name: "Disney+",
    category: "Video",
    defaultAmount: 164.9,
    defaultCurrency: "TRY",
    defaultCycle: "monthly",
    logoPrompt: "disney plus app icon, dark blue premium streaming tile, realistic",
  },
  {
    matchers: [/xbox\s*game\s*pass/i, /game\s*pass/i],
    name: "Xbox Game Pass",
    category: "Oyun",
    defaultAmount: 209.99,
    defaultCurrency: "TRY",
    defaultCycle: "monthly",
    logoPrompt: "xbox game pass app icon, green gaming premium tile, realistic",
  },
  {
    matchers: [/google\s*one/i],
    name: "Google One",
    category: "Bulut",
    defaultAmount: 79.99,
    defaultCurrency: "TRY",
    defaultCycle: "monthly",
    logoPrompt: "google one app icon, colorful cloud storage tile, realistic",
  },
  {
    matchers: [/chatgpt/i, /openai/i],
    name: "ChatGPT Plus",
    category: "Yapay zekâ",
    defaultAmount: 20,
    defaultCurrency: "USD",
    defaultCycle: "monthly",
    logoPrompt: "chatgpt plus app icon, emerald black ai tile, realistic",
  },
];

const billingKeywords = [
  "receipt",
  "invoice",
  "subscription",
  "renewal",
  "payment",
  "premium",
  "plan",
  "fatura",
  "abonelik",
  "yenile",
  "odeme",
  "ödeme",
  "makbuz",
];

function buildImage(prompt: string) {
  return `${imageBase}${encodeURIComponent(prompt)}`;
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i");
}

function hasBillingSignal(value: string) {
  const normalized = normalizeText(value);
  return billingKeywords.some((keyword) => normalized.includes(normalizeText(keyword)));
}

function detectService(message: MailMessageCandidate) {
  const combined = `${message.subject} ${message.from} ${message.snippet}`;
  return serviceCatalog.find((service) =>
    service.matchers.some((matcher) => matcher.test(combined))
  );
}

function parseAmount(value: string) {
  const currencyPatterns = [
    { regex: /(?:₺|TRY|TL)\s?(\d{1,4}(?:[.,]\d{1,2})?)/i, currency: "TRY" },
    { regex: /(\d{1,4}(?:[.,]\d{1,2})?)\s?(?:₺|TRY|TL)/i, currency: "TRY" },
    { regex: /(?:\$|USD)\s?(\d{1,4}(?:[.,]\d{1,2})?)/i, currency: "USD" },
    { regex: /(\d{1,4}(?:[.,]\d{1,2})?)\s?(?:\$|USD)/i, currency: "USD" },
    { regex: /(?:€|EUR)\s?(\d{1,4}(?:[.,]\d{1,2})?)/i, currency: "EUR" },
    { regex: /(\d{1,4}(?:[.,]\d{1,2})?)\s?(?:€|EUR)/i, currency: "EUR" },
    { regex: /(?:£|GBP)\s?(\d{1,4}(?:[.,]\d{1,2})?)/i, currency: "GBP" },
    { regex: /(\d{1,4}(?:[.,]\d{1,2})?)\s?(?:£|GBP)/i, currency: "GBP" },
    { regex: /(?:₹|INR)\s?(\d{1,6}(?:[.,]\d{1,2})?)/i, currency: "INR" },
    { regex: /(\d{1,6}(?:[.,]\d{1,2})?)\s?(?:₹|INR)/i, currency: "INR" },
    { regex: /(?:¥|JPY)\s?(\d{1,6}(?:[.,]\d{1,2})?)/i, currency: "JPY" },
    { regex: /(\d{1,6}(?:[.,]\d{1,2})?)\s?(?:¥|JPY)/i, currency: "JPY" },
    { regex: /(?:₩|KRW)\s?(\d{1,8}(?:[.,]\d{1,2})?)/i, currency: "KRW" },
    { regex: /(\d{1,8}(?:[.,]\d{1,2})?)\s?(?:₩|KRW)/i, currency: "KRW" },
    { regex: /(?:CNY|RMB|CN¥)\s?(\d{1,6}(?:[.,]\d{1,2})?)/i, currency: "CNY" },
    { regex: /(\d{1,6}(?:[.,]\d{1,2})?)\s?(?:CNY|RMB|CN¥)/i, currency: "CNY" },
    { regex: /(?:AED)\s?(\d{1,6}(?:[.,]\d{1,2})?)/i, currency: "AED" },
    { regex: /(\d{1,6}(?:[.,]\d{1,2})?)\s?(?:AED)/i, currency: "AED" },
  ];

  for (const pattern of currencyPatterns) {
    const match = value.match(pattern.regex);

    if (!match?.[1]) {
      continue;
    }

    const amount = Number(match[1].replace(",", "."));

    if (!Number.isNaN(amount)) {
      return {
        amount,
        currency: pattern.currency,
      };
    }
  }

  return null;
}

function inferBillingCycle(value: string, fallback: BillingCycle): BillingCycle {
  const normalized = normalizeText(value);

  if (
    normalized.includes("yearly") ||
    normalized.includes("annual") ||
    normalized.includes("annually") ||
    normalized.includes("yillik") ||
    normalized.includes("yıllık")
  ) {
    return "yearly";
  }

  return fallback;
}

function addMonths(date: Date, count: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + count);
  return next;
}

function buildNextPaymentDate(receivedAt: string, cycle: BillingCycle) {
  const baseDate = new Date(receivedAt);
  const nextDate = cycle === "yearly" ? addMonths(baseDate, 12) : addMonths(baseDate, 1);
  return nextDate.toISOString().slice(0, 10);
}

function buildConfidence(message: MailMessageCandidate, amountFound: boolean) {
  let confidence = 0.72;
  const combined = `${message.subject} ${message.from} ${message.snippet}`;

  if (hasBillingSignal(combined)) {
    confidence += 0.1;
  }

  if (amountFound) {
    confidence += 0.08;
  }

  if (message.from.includes("@")) {
    confidence += 0.05;
  }

  return Math.min(Number(confidence.toFixed(2)), 0.98);
}

function buildNotes(serviceName: string, message: MailMessageCandidate, provider: EmailProvider) {
  const source = provider === "gmail" ? "Gmail" : "Outlook";
  return `${source} içindeki "${message.subject}" başlıklı e-postadan ${serviceName} faturası eşleşti.`;
}

function buildSummary(count: number) {
  if (count === 0) {
    return "Bağlı hesaptaki son e-postalar tarandı, net bir abonelik faturası bulunamadı.";
  }

  return `Bağlı hesaptaki e-postalar tarandı; ${count} abonelik adayı bulundu.`;
}

export function extractSubscriptionsFromMessages(
  provider: EmailProvider,
  email: string,
  messages: MailMessageCandidate[],
  connectedAt = new Date().toISOString()
): EmailAnalysisResponse {
  const deduped = new Map<string, IntakePreviewItem>();

  for (const message of messages) {
    const combined = `${message.subject} ${message.from} ${message.snippet}`;

    if (!hasBillingSignal(combined)) {
      continue;
    }

    const service = detectService(message);

    if (!service) {
      continue;
    }

    const amount = parseAmount(combined);
    const billingCycle = inferBillingCycle(combined, service.defaultCycle);
    const candidate: IntakePreviewItem = {
      id: `${provider}-${service.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name: service.name,
      category: service.category,
      logoUrl: buildImage(service.logoPrompt),
      currentAmount: amount?.amount ?? service.defaultAmount,
      currency: amount?.currency ?? service.defaultCurrency,
      billingCycle,
      nextPaymentDate: buildNextPaymentDate(message.receivedAt, billingCycle),
      confidence: buildConfidence(message, Boolean(amount)),
      notes: buildNotes(service.name, message, provider),
    };

    const existing = deduped.get(candidate.name);

    if (!existing || existing.confidence < candidate.confidence) {
      deduped.set(candidate.name, candidate);
    }
  }

  const preview = Array.from(deduped.values()).sort((left, right) => right.confidence - left.confidence);

  return {
    connection: {
      provider,
      email,
      connectedAt,
      lastScanAt: new Date().toISOString(),
    },
    summary: buildSummary(preview.length),
    preview,
  };
}
