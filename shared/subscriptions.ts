export type BillingCycle = "monthly" | "yearly";

export type SubscriptionStatus = "active" | "trial" | "watch";
export type DetectionMethod = "email" | "ocr" | "banking";
export type EmailProvider = "gmail" | "outlook";

export interface ForecastPoint {
  month: string;
  amount: number;
  increaseRate: number;
}

export interface PaymentEvent {
  id: string;
  label: string;
  amount: number;
  paidAt: string;
  source: "manual" | "official" | "predicted";
}

export interface IntakeMethod {
  id: DetectionMethod;
  title: string;
  description: string;
  source: string;
  trustLabel: string;
  accent: string;
}

export interface IntakePreviewItem {
  id: string;
  name: string;
  category: string;
  logoUrl: string;
  currentAmount: number;
  currency: string;
  billingCycle: BillingCycle;
  nextPaymentDate: string;
  confidence: number;
  notes: string;
}

export interface SubscriptionItem {
  id: string;
  name: string;
  category: string;
  logoUrl: string;
  sourceEmail?: string;
  currentAmount: number;
  currency: string;
  billingCycle: BillingCycle;
  nextPaymentDate: string;
  officialNextAmount?: number;
  predictedIncreaseRate: number;
  predictedAmounts: ForecastPoint[];
  reminderDaysBefore: number;
  status: SubscriptionStatus;
  detectionMethod: DetectionMethod;
  detectionConfidence: number;
  notes: string;
  paymentHistory: PaymentEvent[];
}

export interface DashboardSummary {
  activeCount: number;
  monthlyTotal: number;
  yearlyTotal: number;
  upcomingAmount: number;
  upcomingDate: string;
  predictedMonthlyIncrease: number;
}

export interface EmailConnection {
  provider: EmailProvider;
  email: string;
  connectedAt: string;
  lastScanAt: string;
}

export interface DashboardResponse {
  summary: DashboardSummary;
  connections: EmailConnection[];
  trackingMethods: IntakeMethod[];
  items: SubscriptionItem[];
}

export interface PredictionResponse {
  currentAmount: number;
  currency: string;
  officialNextAmount?: number;
  predictedIncreaseRate: number;
  predictedAmounts: ForecastPoint[];
  notes: string[];
}

export interface IntakeSimulationInput {
  method: DetectionMethod;
  provider?: string;
  sourceHint?: string;
}

export interface IntakeSimulationResponse {
  method: DetectionMethod;
  provider: string;
  lastSyncAt: string;
  summary: string;
  preview: IntakePreviewItem[];
}

export interface EmailConnectInput {
  provider: EmailProvider;
  email: string;
}

export interface EmailAnalysisResponse {
  connection: EmailConnection;
  summary: string;
  preview: IntakePreviewItem[];
}

export interface DiscoverSubscriptionItem {
  id: string;
  name: string;
  category: string;
  logoUrl: string;
  currentPrice: number;
  planPrices?: number[];
  currency: string;
  billingCycle: BillingCycle;
  sourceLabel: string;
  updatedAt: string;
  sourceUrl: string;
  description: string;
}

export interface DiscoverResponse {
  query: string;
  items: DiscoverSubscriptionItem[];
}

export interface CreateSubscriptionInput {
  name: string;
  category: string;
  logoUrl: string;
  sourceEmail?: string;
  currentAmount: number;
  currency: string;
  billingCycle: BillingCycle;
  nextPaymentDate: string;
  reminderDaysBefore: number;
  notes: string;
  detectionMethod?: DetectionMethod;
  detectionConfidence?: number;
}

export interface UpdateSubscriptionInput {
  reminderDaysBefore?: number;
}
