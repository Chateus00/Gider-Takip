import type {
  CreateSubscriptionInput,
  DashboardResponse,
  DashboardSummary,
  DiscoverResponse,
  DiscoverSubscriptionItem,
  EmailAnalysisResponse,
  EmailConnectInput,
  EmailConnection,
  IntakeMethod,
  IntakePreviewItem,
  IntakeSimulationInput,
  IntakeSimulationResponse,
  PredictionResponse,
  SubscriptionItem,
  UpdateSubscriptionInput,
} from "../../shared/subscriptions.js";

const imageBase =
  "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=square&prompt=";

function buildImage(prompt: string) {
  return `${imageBase}${encodeURIComponent(prompt)}`;
}

const trackingMethods: IntakeMethod[] = [
  {
    id: "email",
    title: "E-posta taramasi",
    description:
      "Google veya Outlook hesabi baglandiginda fatura ve odeme mailleri taranir, sadece kullaniciya ait abonelikler cikarilir.",
    source: "Gmail API / Microsoft Graph",
    trustLabel: "Ucretsiz baslangic icin en mantikli yol",
    accent: "turkuaz",
  },
  {
    id: "ocr",
    title: "OCR yedek yontemi",
    description:
      "Mail baglamak istemeyen kullanici ekran goruntusu yukleyerek aboneliklerini daha sonra iceri alabilir.",
    source: "OCR / galeri taramasi",
    trustLabel: "Ikinci adim",
    accent: "yesil",
  },
  {
    id: "banking",
    title: "Banka entegrasyonu",
    description:
      "Acik bankacilik baglantisi ile duzenli harcamalar analiz edilerek abonelikler tespit edilebilir.",
    source: "Acik bankacilik / PSD2",
    trustLabel: "Gelecek surum",
    accent: "amber",
  },
];

let emailConnections: EmailConnection[] = [];
const mySubscriptions: SubscriptionItem[] = [];

const detectedEmailSubscriptions: IntakePreviewItem[] = [
  {
    id: "mail-1",
    name: "Netflix Premium",
    category: "Video",
    logoUrl: buildImage("netflix premium app icon, black red glossy mobile tile, realistic"),
    currentAmount: 379.99,
    currency: "TRY",
    billingCycle: "monthly",
    nextPaymentDate: "2026-07-24",
    confidence: 0.96,
    notes: "Odeme alindi ve fatura maili eslesmesinden algilandi.",
  },
  {
    id: "mail-2",
    name: "Spotify Bireysel",
    category: "Muzik",
    logoUrl: buildImage("spotify premium app icon, green black music tile, realistic"),
    currentAmount: 99,
    currency: "TRY",
    billingCycle: "monthly",
    nextPaymentDate: "2026-07-08",
    confidence: 0.94,
    notes: "Premium yenileme ve makbuz mailleri birlikte eslesti.",
  },
  {
    id: "mail-3",
    name: "iCloud+ 200 GB",
    category: "Bulut",
    logoUrl: buildImage("icloud storage app icon, silver blue cloud tile, realistic"),
    currentAmount: 129.99,
    currency: "TRY",
    billingCycle: "monthly",
    nextPaymentDate: "2026-07-02",
    confidence: 0.91,
    notes: "Apple fatura mailinde depolama plani ve tutar acik gorundu.",
  },
];

const discoverCatalog: DiscoverSubscriptionItem[] = [
  {
    id: "discover-netflix",
    name: "Netflix",
    category: "Video",
    logoUrl: buildImage("netflix app icon, premium streaming red black tile, realistic"),
    currentPrice: 189.99,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Turkiye fiyat guncellemesi",
    updatedAt: "2026-06-21",
    sourceUrl: "https://www.gzt.com/gundem/netflix-fiyatlari-ne-kadar-oldu-2026-netflixe-zam-mi-geldi-guncel-netflix-fiyat-listesi-4006078",
    description: "Temel plan icin izleme odakli video platformu.",
  },
  {
    id: "discover-spotify",
    name: "Spotify Premium",
    category: "Muzik",
    logoUrl: buildImage("spotify premium app icon, green black music tile, realistic"),
    currentPrice: 99,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Spotify resmi premium sayfasi",
    updatedAt: "2026-06-21",
    sourceUrl: "https://www.spotify.com/tr-tr/premium/",
    description: "Bireysel plan; reklamsiz muzik ve offline dinleme.",
  },
  {
    id: "discover-youtube",
    name: "YouTube Premium",
    category: "Video",
    logoUrl: buildImage("youtube premium app icon, red white premium tile, realistic"),
    currentPrice: 119.99,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Haziran 2026 fiyat guncellemesi",
    updatedAt: "2026-06-21",
    sourceUrl: "https://www.haberturk.com/youtube-premium-turkiye-fiyatlarina-zam-geldi-3890888-teknoloji",
    description: "Reklamsiz video, arka planda oynatma ve Music dahil.",
  },
  {
    id: "discover-icloud",
    name: "iCloud+ 200 GB",
    category: "Bulut",
    logoUrl: buildImage("icloud storage app icon, blue silver cloud tile, realistic"),
    currentPrice: 129.99,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "iCloud+ Turkiye fiyat listesi",
    updatedAt: "2026-06-21",
    sourceUrl: "https://www.karekod.org/blog/icloud-fiyatlari/",
    description: "Apple ekosistemi icin bulut depolama ve aile paylasimi.",
  },
  {
    id: "discover-disney",
    name: "Disney+",
    category: "Video",
    logoUrl: buildImage("disney plus app icon, dark blue premium streaming tile, realistic"),
    currentPrice: 164.9,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-21",
    sourceUrl: "https://www.disneyplus.com",
    description: "Dizi, film ve Marvel odakli yayin platformu.",
  },
  {
    id: "discover-gamepass",
    name: "Xbox Game Pass",
    category: "Oyun",
    logoUrl: buildImage("xbox game pass app icon, green gaming premium tile, realistic"),
    currentPrice: 209.99,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-21",
    sourceUrl: "https://www.xbox.com",
    description: "Konsol ve PC oyun kutuphanesi icin aylik oyun aboneligi.",
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toMonthlyCost(item: SubscriptionItem) {
  return item.billingCycle === "yearly" ? item.currentAmount / 12 : item.currentAmount;
}

function buildSummary(items: SubscriptionItem[]): DashboardSummary {
  if (!items.length) {
    return {
      activeCount: 0,
      monthlyTotal: 0,
      yearlyTotal: 0,
      upcomingAmount: 0,
      upcomingDate: new Date().toISOString(),
      predictedMonthlyIncrease: 0,
    };
  }

  const sortedByDate = [...items].sort((left, right) =>
    left.nextPaymentDate.localeCompare(right.nextPaymentDate)
  );
  const monthlyTotal = items.reduce((total, item) => total + toMonthlyCost(item), 0);
  const yearlyTotal = items.reduce(
    (total, item) =>
      total + (item.billingCycle === "yearly" ? item.currentAmount : item.currentAmount * 12),
    0
  );
  const predictedMonthlyIncrease = items.reduce(
    (total, item) => total + item.currentAmount * (item.predictedIncreaseRate / 100),
    0
  );

  return {
    activeCount: items.length,
    monthlyTotal,
    yearlyTotal,
    upcomingAmount: sortedByDate[0]?.officialNextAmount ?? sortedByDate[0]?.currentAmount ?? 0,
    upcomingDate: sortedByDate[0]?.nextPaymentDate ?? new Date().toISOString(),
    predictedMonthlyIncrease,
  };
}

function createPredictedAmounts(amount: number) {
  return [
    {
      month: "Sonraki ay",
      amount: Number((amount * 1.054).toFixed(2)),
      increaseRate: 5.4,
    },
    {
      month: "Iki ay sonra",
      amount: Number((amount * 1.081).toFixed(2)),
      increaseRate: 2.6,
    },
    {
      month: "Uc ay sonra",
      amount: Number((amount * 1.097).toFixed(2)),
      increaseRate: 1.5,
    },
  ];
}

export function getDashboardData(): DashboardResponse {
  return {
    summary: buildSummary(mySubscriptions),
    connections: emailConnections,
    trackingMethods,
    items: mySubscriptions,
  };
}

export function getSubscriptionById(id: string) {
  return mySubscriptions.find((item) => item.id === id);
}

export function getPredictionById(id: string): PredictionResponse | undefined {
  const item = getSubscriptionById(id);

  if (!item) {
    return undefined;
  }

  return {
    currentAmount: item.currentAmount,
    currency: item.currency,
    officialNextAmount: item.officialNextAmount,
    predictedIncreaseRate: item.predictedIncreaseRate,
    predictedAmounts: item.predictedAmounts,
    notes: [
      item.officialNextAmount
        ? "Resmi sonraki odeme aciklandigi icin ilk satir dogrudan resmi veriyle gosterildi."
        : "Resmi sonraki odeme yok; ilk satir tahmini veri olarak sunuldu.",
      "Tahmin motoru gecmis odeme ritmi, kategori hareketi ve donemsel fiyat guncellemelerini kullanir.",
      process.env.AI_API_KEY
        ? "Sunucu tarafinda AI anahtari tanimli, gelismis tahmin akisina gecise hazir."
        : "AI anahtari tanimli degil, demo tahmin motoru calisiyor.",
      `Bu abonelik ${item.detectionMethod} yontemi ile %${Math.round(item.detectionConfidence * 100)} guvenle algilandi.`,
    ],
  };
}

export function connectEmailAccount(input: EmailConnectInput): EmailAnalysisResponse {
  const now = new Date().toISOString();
  const nextConnection: EmailConnection = {
    provider: input.provider,
    email: input.email,
    connectedAt: now,
    lastScanAt: now,
  };

  const existingIndex = emailConnections.findIndex(
    (connection) => connection.provider === input.provider && connection.email.toLowerCase() === input.email.toLowerCase()
  );

  if (existingIndex >= 0) {
    emailConnections[existingIndex] = {
      ...emailConnections[existingIndex],
      lastScanAt: now,
    };
  } else {
    emailConnections = [nextConnection, ...emailConnections];
  }

  const activeConnection =
    emailConnections.find(
      (connection) => connection.provider === input.provider && connection.email.toLowerCase() === input.email.toLowerCase()
    ) ?? nextConnection;

  return {
    connection: activeConnection,
    summary:
      "Mail kutusunda fatura, receipt, invoice ve payment confirmation mailleri tarandi; yalnizca algilanan abonelik adaylari listelendi.",
    preview: detectedEmailSubscriptions,
  };
}

export function getIntakeMethods() {
  return trackingMethods;
}

export function simulateIntake(input: IntakeSimulationInput): IntakeSimulationResponse {
  return {
    method: input.method,
    provider: input.provider || "Demo",
    lastSyncAt: new Date().toISOString(),
    summary: "Bu yedek yontem demo modunda hazir tutuluyor.",
    preview: input.method === "email" ? detectedEmailSubscriptions : [],
  };
}

export function getDiscoverItems(query = ""): DiscoverResponse {
  const normalizedQuery = query.trim().toLowerCase();
  const subscribedNames = mySubscriptions.map((item) => item.name.toLowerCase());

  const filtered = discoverCatalog.filter((item) => {
    const discoverName = item.name.toLowerCase();
    const isAlreadySubscribed = subscribedNames.some(
      (name) => name.includes(discoverName) || discoverName.includes(name)
    );

    if (isAlreadySubscribed) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchable = `${item.name} ${item.category} ${item.description}`.toLowerCase();
    return searchable.includes(normalizedQuery);
  });

  return {
    query,
    items: filtered,
  };
}

export function createSubscription(input: CreateSubscriptionInput): SubscriptionItem {
  const existing = mySubscriptions.find(
    (item) => item.name.toLowerCase() === input.name.toLowerCase()
  );

  if (existing) {
    return existing;
  }

  const newItem: SubscriptionItem = {
    id: slugify(input.name),
    name: input.name,
    category: input.category,
    logoUrl: input.logoUrl,
    currentAmount: input.currentAmount,
    currency: input.currency,
    billingCycle: input.billingCycle,
    nextPaymentDate: input.nextPaymentDate,
    officialNextAmount: Number((input.currentAmount * 1.04).toFixed(2)),
    predictedIncreaseRate: 5.4,
    predictedAmounts: createPredictedAmounts(input.currentAmount),
    reminderDaysBefore: input.reminderDaysBefore,
    status: "active",
    detectionMethod: input.detectionMethod ?? "email",
    detectionConfidence: input.detectionConfidence ?? 0.9,
    notes:
      input.notes ||
      "Mail analizi ile bulunan ve kullanici tarafindan onaylanarak Aboneliklerim listesine eklenen kayit.",
    paymentHistory: [
      {
        id: `${slugify(input.name)}-predicted`,
        label: "Sonraki odeme tahmini",
        amount: Number((input.currentAmount * 1.04).toFixed(2)),
        paidAt: input.nextPaymentDate,
        source: "predicted",
      },
    ],
  };

  mySubscriptions.unshift(newItem);
  return newItem;
}

export function updateSubscription(id: string, input: UpdateSubscriptionInput) {
  const item = mySubscriptions.find((subscription) => subscription.id === id);

  if (!item) {
    return null;
  }

  if (typeof input.reminderDaysBefore === "number") {
    item.reminderDaysBefore = input.reminderDaysBefore;
  }

  return item;
}
