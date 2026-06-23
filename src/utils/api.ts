import type {
  CreateSubscriptionInput,
  DashboardResponse,
  DashboardSummary,
  DetectionMethod,
  DiscoverResponse,
  EmailConnection,
  EmailAnalysisResponse,
  EmailConnectInput,
  IntakeMethod,
  IntakeSimulationResponse,
  PredictionResponse,
  SubscriptionItem,
  UpdateSubscriptionInput,
} from "../../shared/subscriptions";
import { translateText } from "@/i18n/translations";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").trim().replace(/\/+$/, "");
const subscriptionsStorageKey = "gider-takip.dashboard-subscriptions";
const connectionsStorageKey = "gider-takip.dashboard-connections";

function buildApiUrl(path: string) {
  return apiBaseUrl ? `${apiBaseUrl}${path}` : path;
}

function isBrowser() {
  return typeof window !== "undefined";
}

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

  return {
    activeCount: items.length,
    monthlyTotal: items.reduce((total, item) => total + toMonthlyCost(item), 0),
    yearlyTotal: items.reduce(
      (total, item) =>
        total + (item.billingCycle === "yearly" ? item.currentAmount : item.currentAmount * 12),
      0
    ),
    upcomingAmount: sortedByDate[0]?.officialNextAmount ?? sortedByDate[0]?.currentAmount ?? 0,
    upcomingDate: sortedByDate[0]?.nextPaymentDate ?? new Date().toISOString(),
    predictedMonthlyIncrease: items.reduce(
      (total, item) => total + item.currentAmount * (item.predictedIncreaseRate / 100),
      0
    ),
  };
}

function createPredictedAmounts(amount: number) {
  return [
    {
      month: translateText("api.predictionMonths.next"),
      amount: Number((amount * 1.054).toFixed(2)),
      increaseRate: 5.4,
    },
    {
      month: translateText("api.predictionMonths.second"),
      amount: Number((amount * 1.081).toFixed(2)),
      increaseRate: 2.6,
    },
    {
      month: translateText("api.predictionMonths.third"),
      amount: Number((amount * 1.097).toFixed(2)),
      increaseRate: 1.5,
    },
  ];
}

function buildPrediction(item: SubscriptionItem): PredictionResponse {
  return {
    currentAmount: item.currentAmount,
    currency: item.currency,
    officialNextAmount: item.officialNextAmount,
    predictedIncreaseRate: item.predictedIncreaseRate,
    predictedAmounts: item.predictedAmounts,
    notes: [
      item.officialNextAmount
        ? translateText("api.predictionNotes.officialKnown")
        : translateText("api.predictionNotes.officialUnknown"),
      translateText("api.predictionNotes.engine"),
      translateText("api.predictionNotes.detected", {
        method: translateText(`subscription.detection.${item.detectionMethod}`),
        confidence: Math.round(item.detectionConfidence * 100),
      }),
    ],
  };
}

function readStorage<T>(key: string): T[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(key);

    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage<T>(key: string, value: T[]) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function getStoredSubscriptions() {
  return readStorage<SubscriptionItem>(subscriptionsStorageKey);
}

function setStoredSubscriptions(items: SubscriptionItem[]) {
  writeStorage(subscriptionsStorageKey, items);
}

function getStoredConnections() {
  return readStorage<EmailConnection>(connectionsStorageKey);
}

function setStoredConnections(items: EmailConnection[]) {
  writeStorage(connectionsStorageKey, items);
}

function mergeSubscriptions(primary: SubscriptionItem[], secondary: SubscriptionItem[]) {
  const merged = new Map<string, SubscriptionItem>();

  [...primary, ...secondary].forEach((item) => {
    merged.set(item.id, item);
  });

  return [...merged.values()];
}

function mergeConnections(primary: EmailConnection[], secondary: EmailConnection[]) {
  const merged = new Map<string, EmailConnection>();

  [...primary, ...secondary].forEach((item) => {
    merged.set(`${item.provider}:${item.email.toLowerCase()}`, item);
  });

  return [...merged.values()];
}

function buildLocalSubscription(input: CreateSubscriptionInput): SubscriptionItem {
  return {
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
      translateText("api.localRecord"),
    paymentHistory: [
      {
        id: `${slugify(input.name)}-predicted`,
        label: translateText("api.predictedPaymentLabel"),
        amount: Number((input.currentAmount * 1.04).toFixed(2)),
        paidAt: input.nextPaymentDate,
        source: "predicted",
      },
    ],
  };
}

function buildLocalConnection(input: EmailConnectInput): EmailConnection {
  const now = new Date().toISOString();

  return {
    provider: input.provider,
    email: input.email,
    connectedAt: now,
    lastScanAt: now,
  };
}

function persistSubscription(item: SubscriptionItem) {
  const merged = mergeSubscriptions([item], getStoredSubscriptions());
  setStoredSubscriptions(merged);
  return item;
}

function updatePersistedSubscription(id: string, input: UpdateSubscriptionInput) {
  const updatedItems = getStoredSubscriptions().map((item) =>
    item.id === id
      ? {
          ...item,
          ...(typeof input.reminderDaysBefore === "number"
            ? { reminderDaysBefore: input.reminderDaysBefore }
            : {}),
        }
      : item
  );
  setStoredSubscriptions(updatedItems);
  return updatedItems.find((item) => item.id === id) ?? null;
}

function persistConnection(connection: EmailConnection) {
  const merged = mergeConnections([connection], getStoredConnections());
  setStoredConnections(merged);
  return connection;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: translateText("auth.actionFailed") }));
    throw new Error(payload.message ?? translateText("auth.actionFailed"));
  }

  return response.json() as Promise<T>;
}

export async function fetchDashboard() {
  const localItems = getStoredSubscriptions();
  const localConnections = getStoredConnections();

  try {
    const response = await fetch(buildApiUrl("/api/subscriptions"));
    const remote = await handleResponse<DashboardResponse>(response);
    const mergedItems = mergeSubscriptions(localItems, remote.items);
    const mergedConnections = mergeConnections(localConnections, remote.connections);

    setStoredSubscriptions(mergedItems);
    setStoredConnections(mergedConnections);

    return {
      ...remote,
      summary: buildSummary(mergedItems),
      connections: mergedConnections,
      items: mergedItems,
    };
  } catch {
    return {
      summary: buildSummary(localItems),
      connections: localConnections,
      trackingMethods: [],
      items: localItems,
    };
  }
}

export async function fetchSubscription(id: string) {
  const localItem = getStoredSubscriptions().find((item) => item.id === id);

  if (localItem) {
    return localItem;
  }

  const response = await fetch(buildApiUrl(`/api/subscriptions/${id}`));
  const item = await handleResponse<SubscriptionItem>(response);
  persistSubscription(item);
  return item;
}

export async function fetchPrediction(id: string) {
  const localItem = getStoredSubscriptions().find((item) => item.id === id);

  if (localItem) {
    return buildPrediction(localItem);
  }

  const response = await fetch(buildApiUrl(`/api/subscriptions/${id}/prediction`));
  return handleResponse<PredictionResponse>(response);
}

export async function createSubscription(input: CreateSubscriptionInput) {
  try {
    const response = await fetch(buildApiUrl("/api/subscriptions"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    const created = await handleResponse<SubscriptionItem>(response);
    return persistSubscription(created);
  } catch {
    return persistSubscription(buildLocalSubscription(input));
  }
}

export async function updateSubscription(id: string, input: UpdateSubscriptionInput) {
  try {
    const response = await fetch(buildApiUrl(`/api/subscriptions/${id}`), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    const updated = await handleResponse<SubscriptionItem>(response);
    return persistSubscription(updated);
  } catch {
    const updated = updatePersistedSubscription(id, input);

    if (!updated) {
      throw new Error(translateText("subscription.reminderUpdateFailed"));
    }

    return updated;
  }
}

export async function fetchIntakeMethods() {
  const response = await fetch(buildApiUrl("/api/intake/methods"));
  return handleResponse<IntakeMethod[]>(response);
}

export async function simulateIntake(method: DetectionMethod, provider?: string) {
  const response = await fetch(buildApiUrl("/api/intake/simulate"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      method,
      provider,
    }),
  });

  return handleResponse<IntakeSimulationResponse>(response);
}

export async function connectEmail(input: EmailConnectInput) {
  try {
    const response = await fetch(buildApiUrl("/api/email/connect"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    const result = await handleResponse<EmailAnalysisResponse>(response);
    const connection = persistConnection(result.connection);
    return {
      ...result,
      connection,
    };
  } catch {
    return {
      connection: persistConnection(buildLocalConnection(input)),
      summary: translateText("common.connectMailAccount"),
      preview: [],
    };
  }
}

export async function fetchDiscover(query = "") {
  const search = new URLSearchParams();

  if (query.trim()) {
    search.set("q", query.trim());
  }

  const response = await fetch(buildApiUrl(`/api/discover${search.toString() ? `?${search.toString()}` : ""}`));
  return handleResponse<DiscoverResponse>(response);
}
