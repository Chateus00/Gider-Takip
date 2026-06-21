import { useEffect, useMemo, useState } from "react";
import { Filter, LoaderCircle, Mail, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import type { DashboardResponse, DiscoverResponse, SubscriptionItem } from "../../shared/subscriptions";
import DashboardHero from "@/components/DashboardHero";
import DiscoverSubscriptionCard from "@/components/DiscoverSubscriptionCard";
import ForecastPanel from "@/components/ForecastPanel";
import SubscriptionCard from "@/components/SubscriptionCard";
import { fetchDashboard, fetchDiscoverItems, fetchPrediction } from "@/utils/api";

type FilterKey = "all" | "monthly" | "watch" | "yearly";
type TabKey = "mine" | "discover";

export default function Home() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("mine");
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>("all");
  const [prediction, setPrediction] = useState<Awaited<ReturnType<typeof fetchPrediction>> | null>(null);
  const [discoverData, setDiscoverData] = useState<DiscoverResponse | null>(null);
  const [discoverQuery, setDiscoverQuery] = useState("");
  const [isDiscoverLoading, setIsDiscoverLoading] = useState(false);
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
        setError(loadError instanceof Error ? loadError.message : "Veriler yuklenemedi.");
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    async function loadDiscover() {
      setIsDiscoverLoading(true);

      try {
        const data = await fetchDiscoverItems(discoverQuery);
        setDiscoverData(data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Kesif verileri yuklenemedi.");
      } finally {
        setIsDiscoverLoading(false);
      }
    }

    loadDiscover();
  }, [discoverQuery]);

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
        Kontrol paneli yukleniyor...
      </div>
    );
  }

  const filterList: Array<{ key: FilterKey; label: string }> = [
    { key: "all", label: "Tum servisler" },
    { key: "monthly", label: "Aylik" },
    { key: "watch", label: "Yakinda zam" },
    { key: "yearly", label: "Yillik" },
  ];

  return (
    <div className="space-y-8">
      <DashboardHero summary={dashboard.summary} />

      <section className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "mine", label: "Aboneliklerim" },
            { key: "discover", label: "Abone olunabilecek uygulamalar" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as TabKey)}
              className={`rounded-full px-5 py-3 text-sm font-medium transition ${
                activeTab === tab.key
                  ? "bg-slate-950 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-900 hover:text-slate-950"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "mine" ? (
          <div className="space-y-6">
            <section className="rounded-[32px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Mail analizi</p>
                  <h2 className="mt-2 font-['Fraunces',serif] text-3xl text-slate-950">
                    Sadece sana ait abonelikler burada gorunur
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Bu sekmede demo katalog veya genel uygulama yorumu yok. Mail hesabindan analiz edilip senin onayladigin abonelikler listelenir.
                  </p>
                </div>
                <Link
                  to="/abonelik/yeni"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <Mail className="h-4 w-4" />
                  Mail hesabini bagla
                </Link>
              </div>

              {dashboard.connection ? (
                <div className="mt-5 rounded-[24px] bg-slate-50 px-4 py-4 text-sm text-slate-600">
                  Bagli hesap: <span className="font-medium text-slate-900">{dashboard.connection.email}</span>
                </div>
              ) : (
                <div className="mt-5 rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm leading-6 text-slate-500">
                  Henuz bagli bir mail hesabi yok. Baglanti olmadan `Aboneliklerim` alani bos kalir ve kullaniciya ait olmayan hicbir servis gosterilmez.
                </div>
              )}
            </section>

            {dashboard.items.length > 0 ? (
              <>
                {prediction ? <ForecastPanel data={prediction} /> : null}
                <section className="space-y-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Abonelik listesi</p>
                      <h2 className="mt-2 font-['Fraunces',serif] text-3xl text-slate-950">
                        Onayladigin abonelikler
                      </h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {filterList.map((filter) => (
                        <button
                          key={filter.key}
                          type="button"
                          onClick={() => setSelectedFilter(filter.key)}
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                            selectedFilter === filter.key
                              ? "bg-slate-950 text-white"
                              : "border border-slate-200 bg-white text-slate-600 hover:border-slate-900 hover:text-slate-950"
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
              <section className="rounded-[32px] border border-slate-200/70 bg-white/85 p-6 text-slate-500 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                Mail baglantisindan sonra algilanan abonelikleri tek tek onayladiginda bu alanda gormeye baslarsin.
              </section>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            <section className="rounded-[32px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Kesif kataloğu</p>
                  <h2 className="mt-2 font-['Fraunces',serif] text-3xl text-slate-950">
                    Abone olunabilecek uygulamalar
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Internetteki fiyat bilgisinden derlenen katalog burada gorunur. Arama cubugu ile ilgilendigin servisi hizlica bulabilirsin.
                  </p>
                </div>
                <div className="relative w-full max-w-md">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={discoverQuery}
                    onChange={(event) => setDiscoverQuery(event.target.value)}
                    placeholder="Ornek: Netflix, Spotify, bulut, oyun..."
                    className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-950"
                  />
                </div>
              </div>
            </section>

            {isDiscoverLoading ? (
              <div className="flex min-h-[20vh] items-center justify-center gap-3 text-slate-500">
                <LoaderCircle className="h-5 w-5 animate-spin" />
                Kesif katalogu yukleniyor...
              </div>
            ) : (
              <div className="grid gap-4">
                {discoverData?.items.length ? (
                  discoverData.items.map((item) => (
                    <DiscoverSubscriptionCard key={item.id} item={item} />
                  ))
                ) : (
                  <section className="rounded-[32px] border border-slate-200/70 bg-white/85 p-6 text-slate-500 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                    Aramana uyan bir servis bulunamadi.
                  </section>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
