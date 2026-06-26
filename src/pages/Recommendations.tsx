import { useEffect, useMemo, useState } from "react";
import { Bot, Search, Sparkles } from "lucide-react";
import type { DiscoverSubscriptionItem, SubscriptionItem } from "../../shared/subscriptions";
import { useI18n } from "@/contexts/I18nContext";
import BrandLogoImage from "@/components/BrandLogoImage";
import { fetchDashboard, fetchDiscover } from "@/utils/api";
import { formatCurrency, formatDate } from "@/utils/formatters";

function buildRecommendationReason(item: DiscoverSubscriptionItem, subscriptions: SubscriptionItem[], t: (key: string, values?: Record<string, string | number>) => string) {
  const sameCategory = subscriptions.find((subscription) => subscription.category === item.category);

  if (sameCategory) {
    return t("recommendations.reasonCategory", {
      category: item.category,
      app: sameCategory.name,
    });
  }

  const sameCycle = subscriptions.find((subscription) => subscription.billingCycle === item.billingCycle);

  if (sameCycle) {
    return t("recommendations.reasonCycle", {
      cycle: item.billingCycle === "yearly" ? t("common.yearly") : t("common.monthly"),
    });
  }

  return t("recommendations.reasonFallback");
}

function normalizeAppName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export default function Recommendations() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<DiscoverSubscriptionItem[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError("");

      try {
        const [dashboard, discover] = await Promise.all([fetchDashboard(), fetchDiscover(query)]);
        setSubscriptions(dashboard.items);
        setItems(discover.items);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : t("recommendations.loadError"));
      } finally {
        setIsLoading(false);
      }
    }

    void load();
  }, [query, t]);

  const recommendationItems = useMemo(
    () => {
      const subscriptionNameSet = new Set(subscriptions.map((subscription) => normalizeAppName(subscription.name)));

      return items
        .filter((item) => !subscriptionNameSet.has(normalizeAppName(item.name)))
        .map((item) => ({
          ...item,
          reason: buildRecommendationReason(item, subscriptions, t),
        }));
    },
    [items, subscriptions, t]
  );

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-emerald-100 bg-white/85 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs uppercase tracking-[0.24em] text-emerald-700">
          <Bot className="h-4 w-4" />
          {t("recommendations.badge")}
        </div>
        <h1 className="mt-4 font-['Fraunces',serif] text-4xl leading-tight text-slate-950">
          {t("recommendations.title")}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          {t("recommendations.description")}
        </p>
        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
          <label className="flex flex-1 items-center gap-3 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("recommendations.searchPlaceholder")}
              className="w-full bg-transparent text-sm text-slate-700 outline-none"
            />
          </label>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm text-white">
            <Sparkles className="h-4 w-4" />
            {t("recommendations.liveCount", { count: recommendationItems.length })}
          </div>
        </div>
      </section>

      {isLoading ? (
        <section className="rounded-[32px] border border-emerald-100 bg-white/90 p-6 text-slate-500 shadow-[0_18px_50px_rgba(6,78,59,0.10)]">
          {t("recommendations.loading")}
        </section>
      ) : error ? (
        <section className="rounded-[32px] border border-rose-100 bg-white/90 p-6 text-rose-600 shadow-[0_18px_50px_rgba(6,78,59,0.10)]">
          {error}
        </section>
      ) : recommendationItems.length ? (
        <section className="grid gap-5 lg:grid-cols-2">
          {recommendationItems.map((item) => (
            <article
              key={item.id}
              className="rounded-[30px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
            >
              <div className="flex items-start gap-4">
                <BrandLogoImage
                  name={item.name}
                  src={item.logoUrl}
                  alt={item.name}
                  containerClassName="flex min-h-20 min-w-[116px] max-w-[160px] items-center"
                  className="max-h-20 w-auto max-w-[160px] object-contain"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-950 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white">
                      {item.category}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                      {item.billingCycle === "yearly" ? t("common.yearly") : t("common.monthly")}
                    </span>
                  </div>
                  <h2 className="mt-3 font-['Fraunces',serif] text-2xl text-slate-950">{item.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-[22px] bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{t("recommendations.priceLabel")}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {formatCurrency(item.currentPrice, item.currency)}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">{item.sourceLabel}</p>
                </div>
                <div className="rounded-[22px] bg-emerald-50/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-700">{t("recommendations.aiReasonTitle")}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{item.reason}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                <span className="text-slate-500">
                  {t("recommendations.updatedAt", { date: formatDate(item.updatedAt) })}
                </span>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-slate-700 transition hover:border-slate-900 hover:text-slate-950"
                >
                  {t("recommendations.reviewSource")}
                </a>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-[32px] border border-emerald-100 bg-white/90 p-6 text-slate-500 shadow-[0_18px_50px_rgba(6,78,59,0.10)]">
          {t("recommendations.empty")}
        </section>
      )}
    </div>
  );
}
