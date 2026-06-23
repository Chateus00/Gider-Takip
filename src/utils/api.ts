import type {
  CreateSubscriptionInput,
  DashboardResponse,
  DetectionMethod,
  EmailAnalysisResponse,
  EmailConnectInput,
  IntakeMethod,
  IntakeSimulationResponse,
  PredictionResponse,
  SubscriptionItem,
} from "../../shared/subscriptions";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").trim().replace(/\/+$/, "");

function buildApiUrl(path: string) {
  return apiBaseUrl ? `${apiBaseUrl}${path}` : path;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: "Bir hata oluştu." }));
    throw new Error(payload.message ?? "Bir hata oluştu.");
  }

  return response.json() as Promise<T>;
}

export async function fetchDashboard() {
  const response = await fetch(buildApiUrl("/api/subscriptions"));
  return handleResponse<DashboardResponse>(response);
}

export async function fetchSubscription(id: string) {
  const response = await fetch(buildApiUrl(`/api/subscriptions/${id}`));
  return handleResponse<SubscriptionItem>(response);
}

export async function fetchPrediction(id: string) {
  const response = await fetch(buildApiUrl(`/api/subscriptions/${id}/prediction`));
  return handleResponse<PredictionResponse>(response);
}

export async function createSubscription(input: CreateSubscriptionInput) {
  const response = await fetch(buildApiUrl("/api/subscriptions"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return handleResponse<SubscriptionItem>(response);
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
  const response = await fetch(buildApiUrl("/api/email/connect"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return handleResponse<EmailAnalysisResponse>(response);
}
