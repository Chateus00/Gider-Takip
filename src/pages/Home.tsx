import { useEffect, useMemo, useState } from "react";
import { Filter, LoaderCircle, Mail, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import type { DashboardResponse, SubscriptionItem } from "../../shared/subscriptions";
import DashboardHero from "@/components/DashboardHero";
import ForecastPanel from "@/components/ForecastPanel";
import SubscriptionCard from "@/components/SubscriptionCard";
import { useI18n } from "@/contexts/I18nContext";
import { fetchDashboard, fetchPrediction } from "@/utils/api";

type FilterKey = "all" | "monthly" | "watch" | "yearly";

export default function Home() {
  const { t } = useI18n();
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>("all");
  const [prediction, setPrediction] = useState<Awaited<ReturnType<typeof fetchPrediction>> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchDashboard();
        setDashboard(data);

        if (data.items[0]) {
          const nextPrediction = await fetchPrediction(data.items[0].id);
          setPrediction(nextPrediction);
        } else {
          setPrediction(null);
        }
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : t("home.loadError"));
      }
    }

    loadData();
  }, [t]);

  const filteredItems = useMemo(() => {
    if (!dashboard) {
      return [];
    }

    const filters: Record<FilterKey, (item: SubscriptionItem) => boolean> = {
      all: () => true,
      monthly: (item) => item.billingCycle === "monthly",
      watch: (item) => item.status === "watch",
      yearly: (item) => item.billingCycle === "yearly",
    };

    return dashboard.items.filter(filters[selectedFilter]);
  }, [dashboard, selectedFilter]);

  if (error) {
    return <div className="rounded-[24px] bg-rose-50 p-6 text-rose-700">{error}</div>;
  }

  if (!dashboard) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3 text-slate-500">
        <LoaderCircle className="h-5 w-5 animate-spin" />
        {t("home.loading")}
      </div>
    );
  }

  const filterList: Array<{ key: FilterKey; label: string }> = [
    { key: "all", label: t("home.filters.all") },
    { key: "monthly", label: t("home.filters.monthly") },
    { key: "watch", label: t("home.filters.watch") },
    { key: "yearly", label: t("home.filters.yearly") },
  ];
  const hasConnectedMail = dashboard.connections.length > 0;

  return (
    <div className="space-y-8">
      <DashboardHero summary={dashboard.summary} items={dashboard.items} />

      <section className="space-y-5">
        <div className="space-y-6">
          {!hasConnectedMail ? (
            <section className="rounded-[32px] border border-emerald-100 bg-white/90 p-6 shadow-[0_18px_50px_rgba(6,78,59,0.10)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{t("home.mailAnalysis")}</p>
                  <h2 className="mt-2 font-['Fraunces',serif] text-3xl text-slate-950">
                    {t("home.subscriptionsVisible")}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    {t("home.firstConnectHint")}
                  </p>
                </div>
                <Link
                  to="/abonelik/yeni"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  <Mail className="h-4 w-4" />
                  {t("common.connectMailAccount")}
                </Link>
              </div>

              <div className="mt-5 rounded-[24px] border border-dashed border-emerald-100 bg-emerald-50/60 px-4 py-5 text-sm leading-6 text-slate-600">
                {t("home.noConnectedMail")}
              </div>
            </section>
          ) : null}

          {dashboard.items.length > 0 ? (
            <>
              {prediction ? <ForecastPanel data={prediction} /> : null}
              <section className="space-y-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{t("home.listTitle")}</p>
                    <h2 className="mt-2 font-['Fraunces',serif] text-3xl text-slate-950">{t("home.yourSubscriptions")}</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filterList.map((filter) => (
                      <button
                        key={filter.key}
                        type="button"
                        onClick={() => setSelectedFilter(filter.key)}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                          selectedFilter === filter.key
                            ? "bg-emerald-700 text-white"
                            : "border border-emerald-100 bg-white text-slate-600 hover:border-emerald-700 hover:text-emerald-800"
                        }`}
                      >
                        {selectedFilter === filter.key ? (
                          <Sparkles className="h-4 w-4" />
                        ) : (
                          <Filter className="h-4 w-4" />
                        )}
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4">
                  {filteredItems.map((item) => (
                    <SubscriptionCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            </>
          ) : (
            <section className="rounded-[32px] border border-emerald-100 bg-white/90 p-6 text-slate-500 shadow-[0_18px_50px_rgba(6,78,59,0.10)]">
              {t("home.noSubscriptionsYet")}
            </section>
          )}
        </div>
      </section>
    </div>
  );
}
