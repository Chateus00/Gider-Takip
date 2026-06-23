import { Bot, TrendingUp } from "lucide-react";
import type { PredictionResponse } from "../../shared/subscriptions";
import { useI18n } from "@/contexts/I18nContext";
import { formatCurrency, formatPercent } from "@/utils/formatters";

interface ForecastPanelProps {
  data: PredictionResponse;
}

export default function ForecastPanel({ data }: ForecastPanelProps) {
  const { t } = useI18n();
  return (
    <section className="rounded-[32px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{t("forecast.title")}</p>
          <h3 className="mt-2 font-['Fraunces',serif] text-3xl text-slate-950">
            {t("forecast.heading")}
          </h3>
        </div>
        <div className="rounded-2xl bg-teal-50 p-3 text-teal-700">
          <Bot className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[24px] bg-slate-950 p-5 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{t("forecast.currentAmount")}</p>
          <p className="mt-2 text-3xl font-semibold">
            {formatCurrency(data.currentAmount, data.currency)}
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-slate-400">{t("forecast.nextKnownPayment")}</p>
          <p className="mt-2 text-xl font-medium text-teal-200">
            {data.officialNextAmount
              ? formatCurrency(data.officialNextAmount, data.currency)
              : t("common.noOfficialData")}
          </p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-slate-100">
            <TrendingUp className="h-4 w-4" />
            {t("forecast.expectedIncrease", { value: formatPercent(data.predictedIncreaseRate) })}
          </p>
        </div>

        <div className="space-y-3">
          {data.predictedAmounts.map((item) => (
            <div
              key={item.month}
              className="flex items-center justify-between rounded-[22px] border border-slate-200/80 bg-slate-50 px-4 py-4"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.month}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  {t("forecast.increase", { value: formatPercent(item.increaseRate) })}
                </p>
              </div>
              <p className="text-lg font-semibold text-slate-950">
                {formatCurrency(item.amount, data.currency)}
              </p>
            </div>
          ))}

          <div className="rounded-[24px] border border-dashed border-slate-200 p-4 text-sm leading-6 text-slate-500">
            {data.notes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
