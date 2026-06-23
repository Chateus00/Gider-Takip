import type { PaymentEvent } from "../../shared/subscriptions";
import { useI18n } from "@/contexts/I18nContext";
import { formatCurrency, formatDate } from "@/utils/formatters";

interface DetailTimelineProps {
  items: PaymentEvent[];
  currency: string;
}

export default function DetailTimeline({ items, currency }: DetailTimelineProps) {
  const { t } = useI18n();
  const sourceMap = {
    manual: t("detailTimeline.sources.manual"),
    official: t("detailTimeline.sources.official"),
    predicted: t("detailTimeline.sources.predicted"),
  } as const;

  return (
    <section className="rounded-[32px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{t("detailTimeline.title")}</p>
      <h3 className="mt-2 font-['Fraunces',serif] text-3xl text-slate-950">
        {t("detailTimeline.heading")}
      </h3>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <article
            key={item.id}
            className="grid gap-4 rounded-[24px] border border-slate-200/80 bg-slate-50 p-4 md:grid-cols-[1fr_auto_auto]"
          >
            <div>
              <p className="text-base font-semibold text-slate-950">{item.label}</p>
              <p className="mt-1 text-sm text-slate-500">{formatDate(item.paidAt)}</p>
            </div>
            <p className="rounded-full bg-white px-3 py-1 text-sm text-slate-600">
              {sourceMap[item.source]}
            </p>
            <p className="text-right text-lg font-semibold text-slate-950">
              {formatCurrency(item.amount, currency)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
