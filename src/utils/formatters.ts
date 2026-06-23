import { getLocale } from "@/contexts/I18nContext";
import { getStoredLanguage } from "@/i18n/translations";

export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat(getLocale(getStoredLanguage()), {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat(getLocale(getStoredLanguage()), {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatPercent(value: number) {
  return new Intl.NumberFormat(getLocale(getStoredLanguage()), {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value / 100);
}

export function formatCurrencyGroups(groups: Record<string, number>) {
  const entries = Object.entries(groups).filter(([, amount]) => Math.abs(amount) > 0.0001);

  if (!entries.length) {
    return formatCurrency(0, "USD");
  }

  return entries
    .sort(([leftCurrency], [rightCurrency]) => leftCurrency.localeCompare(rightCurrency))
    .map(([currency, amount]) => formatCurrency(amount, currency))
    .join(" + ");
}
