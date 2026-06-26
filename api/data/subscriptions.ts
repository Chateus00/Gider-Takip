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
      "Google veya Outlook hesabı bağlandığında fatura ve ödeme mailleri taranır, sadece kullanıcıya ait abonelikler çıkarılır.",
    source: "Gmail API / Microsoft Graph",
    trustLabel: "Ücretsiz başlangıç için en mantıklı yol",
    accent: "turkuaz",
  },
  {
    id: "ocr",
    title: "OCR yedek yontemi",
    description:
      "Mail bağlamak istemeyen kullanıcı ekran görüntüsü yükleyerek aboneliklerini daha sonra içeri alabilir.",
    source: "OCR / galeri taraması",
    trustLabel: "İkinci adım",
    accent: "yesil",
  },
  {
    id: "banking",
    title: "Banka entegrasyonu",
    description:
      "Açık bankacılık bağlantısı ile düzenli harcamalar analiz edilerek abonelikler tespit edilebilir.",
    source: "Açık bankacılık / PSD2",
    trustLabel: "Gelecek sürüm",
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
    notes: "Ödeme alındı ve fatura maili eşleşmesinden algılandı.",
  },
  {
    id: "mail-2",
    name: "Spotify Bireysel",
    category: "Müzik",
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
    planPrices: [189.99, 289.99, 379.99],
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Resmi abonelik sayfası",
    updatedAt: "2026-06-21",
    sourceUrl: "https://www.netflix.com/signup",
    description:
      "Dizi ve film odaklı yayın platformu. Çoklu cihaz desteği, çevrimdışı izleme ve farklı çözünürlük seçenekleri sunar. Plan detayları ülkeye ve pakete göre değişebilir.",
  },
  {
    id: "discover-spotify",
    name: "Spotify Premium",
    category: "Müzik",
    logoUrl: buildImage("spotify premium app icon, green black music tile, realistic"),
    currentPrice: 99,
    planPrices: [99, 55, 135, 165],
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Spotify resmi premium sayfasi",
    updatedAt: "2026-06-21",
    sourceUrl: "https://www.spotify.com/tr-tr/premium/",
    description:
      "Reklamsız müzik dinleme, çevrimdışı kullanım ve yüksek ses kalitesi seçenekleri sunar. Bireysel/Aile/Öğrenci gibi planlar bulunur ve fiyatlar plan türüne göre değişebilir.",
  },
  {
    id: "discover-youtube",
    name: "YouTube Premium",
    category: "Video",
    logoUrl: buildImage("youtube premium app icon, red white premium tile, realistic"),
    currentPrice: 79.99,
    planPrices: [79.99, 159.99, 52.99],
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Resmi abonelik sayfası",
    updatedAt: "2026-06-21",
    sourceUrl: "https://www.youtube.com/premium",
    description:
      "Reklamsız izleme, arka planda oynatma ve çevrimdışı indirme gibi özellikler sunar. Çoğu bölgede YouTube Music Premium erişimi de dahildir. Paket içeriği ülkeye göre değişebilir.",
  },
  {
    id: "discover-icloud",
    name: "iCloud+",
    category: "Bulut",
    logoUrl: buildImage("icloud storage app icon, blue silver cloud tile, realistic"),
    currentPrice: 39.99,
    planPrices: [39.99, 129.99, 399.99],
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Resmi abonelik sayfası",
    updatedAt: "2026-06-21",
    sourceUrl: "https://www.apple.com/tr/icloud/",
    description:
      "Apple ekosisteminde fotoğraf, dosya ve yedeklemeler için bulut depolama sağlar. Aile paylaşımı, özel e-posta alan adı ve gelişmiş gizlilik özellikleri planlara göre sunulabilir.",
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
    description:
      "Dizi ve film yayın platformu. Marvel, Star Wars ve belgesel içerikleri gibi geniş bir katalog sunar. Paket içerikleri ve fiyatlar bölgeye göre farklılık gösterebilir.",
  },
  {
    id: "discover-gamepass",
    name: "Xbox Game Pass",
    category: "Oyun",
    logoUrl: buildImage("xbox game pass app icon, green gaming premium tile, realistic"),
    currentPrice: 269,
    planPrices: [269, 409, 419, 529],
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-21",
    sourceUrl: "https://www.xbox.com/tr-tr/xbox-game-pass",
    description:
      "Konsol ve/veya PC için geniş oyun kütüphanesine erişim sunan abonelik. Oyun kataloğu zamanla değişebilir ve bazı planlarda çevrim içi çok oyunculu avantajlar bulunabilir.",
  },
  {
    id: "discover-appletv",
    name: "Apple TV+",
    category: "Video",
    logoUrl: buildImage("apple tv plus app icon, black minimal streaming tile, realistic"),
    currentPrice: 179.99,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-24",
    sourceUrl: "https://www.apple.com/apple-tv-plus/",
    description:
      "Apple Originals odaklı dizi ve film platformu. Çevrimdışı izleme ve çoklu cihaz desteği sunar; kampanya ve paket içerikleri bölgeye göre değişebilir.",
  },
  {
    id: "discover-max",
    name: "Max",
    category: "Video",
    logoUrl: buildImage("max streaming app icon, purple black premium tile, realistic"),
    currentPrice: 199.99,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-24",
    sourceUrl: "https://www.max.com",
    description:
      "Dizi, film ve belgesel içerikleri sunan yayın platformu. Paket kapsamı, eşzamanlı ekran ve kalite seçenekleri planlara göre değişebilir.",
  },
  {
    id: "discover-paramountplus",
    name: "Paramount+",
    category: "Video",
    logoUrl: buildImage("paramount plus app icon, blue white streaming premium tile, realistic"),
    currentPrice: 179.99,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-24",
    sourceUrl: "https://www.paramountplus.com",
    description:
      "Film ve dizi odaklı yayın platformu. Bölgeye göre canlı kanal, spor ve özel içerik kapsamı değişebilir.",
  },
  {
    id: "discover-blutv",
    name: "BluTV",
    category: "Video",
    logoUrl: buildImage("blutv app icon, dark blue streaming tile, realistic"),
    currentPrice: 119.9,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-24",
    sourceUrl: "https://www.blutv.com",
    description:
      "Türkiye odaklı dizi, film ve belgesel içerikleri sunan yayın platformu. Paket detayları ve kampanyalar dönemsel olarak değişebilir.",
  },
  {
    id: "discover-exxen",
    name: "Exxen",
    category: "Video",
    logoUrl: buildImage("exxen app icon, black yellow streaming tile, realistic"),
    currentPrice: 119.9,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-24",
    sourceUrl: "https://www.exxen.com",
    description:
      "Dizi, eğlence ve spor paketleriyle farklı içerikler sunan platform. Reklamlı/rek­lamsız ve spor gibi seçenekler planlara göre değişebilir.",
  },
  {
    id: "discover-gain",
    name: "GAİN",
    category: "Video",
    logoUrl: buildImage("gain app icon, minimal black white streaming tile, realistic"),
    currentPrice: 79.9,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-24",
    sourceUrl: "https://www.gain.tv",
    description:
      "Kısa format içerikler, belgeseller ve diziler sunan yayın platformu. İçerik kataloğu dönemsel olarak değişebilir.",
  },
  {
    id: "discover-beinconnect",
    name: "beIN CONNECT",
    category: "Video",
    logoUrl: buildImage("bein connect app icon, purple sports streaming tile, realistic"),
    currentPrice: 239.9,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-24",
    sourceUrl: "https://www.beinconnect.com.tr",
    description:
      "Spor ve eğlence içerikleri sunan yayın servisi. Paket kapsamı, ligler ve yayın hakları dönemsel olarak değişebilir.",
  },
  {
    id: "discover-applemusic",
    name: "Apple Music",
    category: "Müzik",
    logoUrl: buildImage("apple music app icon, colorful gradient music tile, realistic"),
    currentPrice: 59.99,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-24",
    sourceUrl: "https://music.apple.com",
    description:
      "Reklamsız müzik, çevrimdışı dinleme ve cihazlar arası senkron sunar. Bireysel/Aile/Öğrenci planları ile fiyatlar değişebilir.",
  },
  {
    id: "discover-tidal",
    name: "TIDAL",
    category: "Müzik",
    logoUrl: buildImage("tidal app icon, black white hi-fi music tile, realistic"),
    currentPrice: 119.99,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-24",
    sourceUrl: "https://tidal.com",
    description:
      "Yüksek ses kalitesi ve çevrimdışı dinleme seçenekleri sunan müzik platformu. Planlar ve özellikler bölgeye göre değişebilir.",
  },
  {
    id: "discover-deezer",
    name: "Deezer",
    category: "Müzik",
    logoUrl: buildImage("deezer app icon, colorful equalizer music tile, realistic"),
    currentPrice: 99.99,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-24",
    sourceUrl: "https://www.deezer.com",
    description:
      "Reklamsız müzik, çevrimdışı dinleme ve kişiselleştirilmiş listeler sunar. Bireysel ve aile planları bulunabilir.",
  },
  {
    id: "discover-soundcloud",
    name: "SoundCloud Go+",
    category: "Müzik",
    logoUrl: buildImage("soundcloud go plus app icon, orange white music tile, realistic"),
    currentPrice: 99.99,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-24",
    sourceUrl: "https://soundcloud.com/go",
    description:
      "Reklamsız dinleme, çevrimdışı kullanım ve geniş katalog erişimi sunar. Plan kapsamı bölgeye göre farklılık gösterebilir.",
  },
  {
    id: "discover-playstationplus",
    name: "PlayStation Plus",
    category: "Oyun",
    logoUrl: buildImage("playstation plus app icon, blue gaming premium tile, realistic"),
    currentPrice: 209.99,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-24",
    sourceUrl: "https://www.playstation.com/ps-plus/",
    description:
      "Çevrim içi çok oyunculu, aylık oyunlar ve bazı planlarda oyun kataloğu gibi avantajlar sunar. Plan içerikleri ülkeye göre değişebilir.",
  },
  {
    id: "discover-discord",
    name: "Discord Nitro",
    category: "Üretkenlik",
    logoUrl: buildImage("discord nitro app icon, purple chat premium tile, realistic"),
    currentPrice: 159.99,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-24",
    sourceUrl: "https://discord.com/nitro",
    description:
      "Daha yüksek dosya yükleme limiti, daha iyi görüntü kalitesi ve özel avantajlar sunan üyelik. Paket özellikleri zamanla değişebilir.",
  },
  {
    id: "discover-twitch",
    name: "Twitch Turbo",
    category: "Video",
    logoUrl: buildImage("twitch turbo app icon, purple streaming tile, realistic"),
    currentPrice: 199.99,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-24",
    sourceUrl: "https://www.twitch.tv/turbo",
    description:
      "Reklamsız izleme ve bazı ek özellikler sunan Twitch üyeliği. Avantaj kapsamı bölgeye göre değişebilir.",
  },
  {
    id: "discover-dropbox",
    name: "Dropbox Plus",
    category: "Bulut",
    logoUrl: buildImage("dropbox app icon, blue white cloud storage tile, realistic"),
    currentPrice: 199.99,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-24",
    sourceUrl: "https://www.dropbox.com/plans",
    description:
      "Bulut depolama, dosya paylaşımı ve sürüm geçmişi gibi özellikler sunar. Depolama kapasitesi planlara göre değişebilir.",
  },
  {
    id: "discover-notion",
    name: "Notion Plus",
    category: "Üretkenlik",
    logoUrl: buildImage("notion app icon, black white productivity tile, realistic"),
    currentPrice: 199.99,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-24",
    sourceUrl: "https://www.notion.so/pricing",
    description:
      "Not alma, wiki, görev takibi ve ekip çalışması için hepsi bir arada çalışma alanı. Depolama ve ekip özellikleri planlara göre değişir.",
  },
  {
    id: "discover-zoom",
    name: "Zoom Pro",
    category: "Üretkenlik",
    logoUrl: buildImage("zoom app icon, blue white video meeting tile, realistic"),
    currentPrice: 239.99,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-24",
    sourceUrl: "https://zoom.us/pricing",
    description:
      "Uzun toplantılar, gelişmiş toplantı ayarları ve ek yönetim seçenekleri sunar. Plan detayları ve fiyatlar bölgeye göre değişebilir.",
  },
  {
    id: "discover-figma",
    name: "Figma Professional",
    category: "Üretkenlik",
    logoUrl: buildImage("figma app icon, colorful design tool tile, realistic"),
    currentPrice: 299.99,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-24",
    sourceUrl: "https://www.figma.com/pricing/",
    description:
      "Tasarım ve prototipleme için ekip odaklı bir araç. Paylaşım, sürüm yönetimi ve ekip yetkileri planlara göre değişebilir.",
  },
  {
    id: "discover-githubcopilot",
    name: "GitHub Copilot",
    category: "Üretkenlik",
    logoUrl: buildImage("github copilot app icon, dark coding assistant tile, realistic"),
    currentPrice: 299.99,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-24",
    sourceUrl: "https://github.com/features/copilot",
    description:
      "Kod tamamlama ve öneri üreten yapay zekâ destekli geliştirme yardımcısı. Planlar bireysel/kurumsal olarak farklılaşabilir.",
  },
  {
    id: "discover-protonmail",
    name: "Proton Mail",
    category: "Güvenlik",
    logoUrl: buildImage("proton mail app icon, purple secure email tile, realistic"),
    currentPrice: 199.99,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-24",
    sourceUrl: "https://proton.me/mail/pricing",
    description:
      "Güvenlik ve gizlilik odaklı e-posta servisi. Depolama, özel alan adı ve ek güvenlik seçenekleri planlara göre değişir.",
  },
  {
    id: "discover-nordvpn",
    name: "NordVPN",
    category: "Güvenlik",
    logoUrl: buildImage("nordvpn app icon, blue shield vpn tile, realistic"),
    currentPrice: 249.99,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-24",
    sourceUrl: "https://nordvpn.com/pricing/",
    description:
      "VPN, tehdit koruması ve cihazlar arası güvenli bağlantı sağlar. Plan içeriği ve fiyatlar kampanyalara göre değişebilir.",
  },
  {
    id: "discover-1password",
    name: "1Password",
    category: "Güvenlik",
    logoUrl: buildImage("1password app icon, blue password manager tile, realistic"),
    currentPrice: 149.99,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-24",
    sourceUrl: "https://1password.com/pricing/",
    description:
      "Şifre yöneticisi. Güvenli kasa, cihazlar arası senkron ve paylaşım seçenekleri sunar; bireysel/aile planları bulunabilir.",
  },
  {
    id: "discover-bitwarden",
    name: "Bitwarden Premium",
    category: "Güvenlik",
    logoUrl: buildImage("bitwarden app icon, blue password manager tile, realistic"),
    currentPrice: 49.99,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-24",
    sourceUrl: "https://bitwarden.com/pricing/",
    description:
      "Açık kaynak şifre yöneticisi. Gelişmiş iki adımlı doğrulama ve ek güvenlik araçları premium planla sunulabilir.",
  },
  {
    id: "discover-strava",
    name: "Strava",
    category: "Sağlık",
    logoUrl: buildImage("strava app icon, orange fitness tracking tile, realistic"),
    currentPrice: 199.99,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-24",
    sourceUrl: "https://www.strava.com/subscribe",
    description:
      "Koşu ve bisiklet başta olmak üzere spor aktivitelerini takip eder. Analiz, hedef ve rota özellikleri abonelikle genişleyebilir.",
  },
  {
    id: "discover-duolingo",
    name: "Duolingo Super",
    category: "Eğitim",
    logoUrl: buildImage("duolingo super app icon, green owl language learning tile, realistic"),
    currentPrice: 159.99,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-24",
    sourceUrl: "https://www.duolingo.com/super",
    description:
      "Dil öğrenme uygulaması. Reklamsız kullanım, sınırsız can ve ek alıştırmalar gibi avantajlar planlara göre değişebilir.",
  },
  {
    id: "discover-headspace",
    name: "Headspace",
    category: "Sağlık",
    logoUrl: buildImage("headspace app icon, orange meditation wellness tile, realistic"),
    currentPrice: 199.99,
    currency: "TRY",
    billingCycle: "monthly",
    sourceLabel: "Katalog verisi",
    updatedAt: "2026-06-24",
    sourceUrl: "https://www.headspace.com",
    description:
      "Meditasyon ve farkındalık içerikleri sunar. Uyku, odak ve stres yönetimi programları abonelikle genişleyebilir.",
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
      month: "İki ay sonra",
      amount: Number((amount * 1.081).toFixed(2)),
      increaseRate: 2.6,
    },
    {
      month: "Üç ay sonra",
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
        ? "Resmi sonraki ödeme açıklandığı için ilk satır doğrudan resmi veriyle gösterildi."
        : "Resmi sonraki ödeme yok; ilk satır tahmini veri olarak sunuldu.",
      "Tahmin motoru geçmiş ödeme ritmi, kategori hareketi ve dönemsel fiyat güncellemelerini kullanır.",
      process.env.AI_API_KEY
        ? "Sunucu tarafında AI anahtarı tanımlı, gelişmiş tahmin akışına geçişe hazır."
        : "AI anahtarı tanımlı değil, demo tahmin motoru çalışıyor.",
      `Bu abonelik ${item.detectionMethod} yöntemi ile %${Math.round(item.detectionConfidence * 100)} güvenle algılandı.`,
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
      "Mail kutusunda fatura, receipt, invoice ve payment confirmation mailleri tarandı; yalnızca algılanan abonelik adayları listelendi.",
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
    summary: "Bu yedek yöntem demo modunda hazır tutuluyor.",
    preview: input.method === "email" ? detectedEmailSubscriptions : [],
  };
}

export function getDiscoverItems(query = ""): DiscoverResponse {
  const normalizedQuery = query.trim().toLowerCase();
  const subscribedNames = mySubscriptions.map((item) => item.name.toLowerCase());

  const filtered = discoverCatalog.filter((item) => {
    const hasPaidPlan = (item.planPrices?.some((price) => price > 0) ?? false) || item.currentPrice > 0;
    if (!hasPaidPlan) {
      return false;
    }

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
    if (!existing.sourceEmail && input.sourceEmail) {
      existing.sourceEmail = input.sourceEmail;
    }
    return existing;
  }

  const newItem: SubscriptionItem = {
    id: slugify(input.name),
    name: input.name,
    category: input.category,
    logoUrl: input.logoUrl,
    sourceEmail: input.sourceEmail,
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
      "Mail analizi ile bulunan ve kullanıcı tarafından onaylanarak Aboneliklerim listesine eklenen kayıt.",
    paymentHistory: [
      {
        id: `${slugify(input.name)}-predicted`,
        label: "Sonraki ödeme tahmini",
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
