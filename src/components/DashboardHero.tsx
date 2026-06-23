import { ArrowUpRight, CalendarClock, Coins, Sparkles, Wallet } from "lucide-react";
import type { DashboardSummary } from "../../shared/subscriptions";
import { useI18n } from "@/contexts/I18nContext";
import { formatCurrency, formatDate, formatPercent } from "@/utils/formatters";

interface DashboardHeroProps {
  summary: DashboardSummary;
}

export default function DashboardHero({ summary }: DashboardHeroProps) {
  const { t } = useI18n();
  const increasePercent =
    summary.monthlyTotal > 0
      ? (summary.predictedMonthlyIncrease / summary.monthlyTotal) * 100
      : 0;

  const stats = [
    {
      label: t("hero.stats.active"),
      value: t("hero.stats.activeValue", { count: summary.activeCount }),
      icon: Wallet,
    },
    {
      label: t("hero.stats.monthly"),
      value: formatCurrency(summary.monthlyTotal, "TRY"),
      icon: Coins,
    },
    {
      label: t("hero.stats.upcoming"),
      value: `${formatCurrency(summary.upcomingAmount, "TRY")} · ${formatDate(summary.upcomingDate)}`,
      icon: CalendarClock,
    },
    {
      label: t("hero.stats.increase"),
      value: `${formatPercent(increasePercent)} · ${formatCurrency(summary.predictedMonthlyIncrease, "TRY")}`,
      icon: Sparkles,
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-emerald-900/20 bg-[linear-gradient(180deg,#052e16_0%,#064e3b_100%)] px-6 py-8 shadow-[0_30px_90px_rgba(6,78,59,0.30)] md:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(167,243,208,0.18),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(74,222,128,0.18),_transparent_35%)]" />
      <div className="relative grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-emerald-200">
            <Sparkles className="h-3.5 w-3.5" />
            {t("common.appName")}
          </div>
          <div className="space-y-3">
            <h1 className="max-w-2xl font-['Fraunces',serif] text-4xl leading-tight text-white md:text-5xl">
              {t("hero.title")}
            </h1>
            <p className="max-w-2xl text-sm text-slate-300 md:text-base">
              {t("hero.description")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/abonelik/yeni"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-300 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:-translate-y-0.5 hover:bg-emerald-200"
            >
              {t("common.connectMailAccount")}
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <div className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200">
              {t("hero.yearlyTotal", { value: formatCurrency(summary.yearlyTotal, "TRY") })}
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {stats.map(({ label, value, icon: Icon }) => (
            <article
              key={label}
              className="rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur"
            >
              <div className="mb-4 inline-flex rounded-2xl bg-white/10 p-2 text-emerald-200">
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
              <p className="mt-2 text-lg font-semibold text-white">{value}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
