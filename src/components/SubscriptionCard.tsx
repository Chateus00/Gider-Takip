import { BellRing, ChevronRight, Clock3, Landmark, Mail, ScanSearch } from "lucide-react";
import { Link } from "react-router-dom";
import type { SubscriptionItem } from "../../shared/subscriptions";
import { useI18n } from "@/contexts/I18nContext";
import { formatCurrency, formatDate, formatPercent } from "@/utils/formatters";

interface SubscriptionCardProps {
  item: SubscriptionItem;
}

export default function SubscriptionCard({ item }: SubscriptionCardProps) {
  const { t } = useI18n();
  const estimatedAmount = item.officialNextAmount ?? item.predictedAmounts[0]?.amount ?? item.currentAmount;
  const hasConfirmedEstimate = typeof item.officialNextAmount === "number";
  const detectionMap = {
    email: { label: t("subscription.detection.email"), icon: Mail },
    ocr: { label: t("subscription.detection.ocr"), icon: ScanSearch },
    banking: { label: t("subscription.detection.banking"), icon: Landmark },
  } as const;
  const statusMap = {
    active: t("subscription.statuses.active"),
    trial: t("subscription.statuses.trial"),
    watch: t("subscription.statuses.watch"),
  } as const;
  const detection = detectionMap[item.detectionMethod];
  const DetectionIcon = detection.icon;
  const reminderLabel =
    item.reminderDaysBefore === 0
      ? t("subscription.reminderOff")
      : t("subscription.reminderSet", { count: item.reminderDaysBefore });

  return (
    <article className="grid gap-4 rounded-[28px] border border-slate-200/70 bg-white/80 p-4 shadow-[0_20px_45px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(15,23,42,0.12)] md:grid-cols-[88px_1fr_auto]">
      <div className="flex items-center justify-center rounded-[24px] bg-slate-100 p-2">
        <img
          src={item.logoUrl}
          alt={item.name}
          className="h-20 w-20 rounded-[20px] object-cover"
        />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-950 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white">
            {item.category}
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
            {statusMap[item.status]}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-[11px] font-medium text-teal-700">
            <DetectionIcon className="h-3.5 w-3.5" />
            {detection.label}
          </span>
        </div>
        <div>
          <h2 className="font-['Fraunces',serif] text-2xl text-slate-950">{item.name}</h2>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
            <Clock3 className="h-4 w-4" />
            {formatDate(item.nextPaymentDate)}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
            <BellRing className="h-4 w-4" />
            {reminderLabel}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-5 md:flex-col md:items-end md:justify-center">
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{t("subscription.currentPrice")}</p>
          <div className="mt-1 flex items-end justify-end gap-3">
            <p className="text-2xl font-semibold text-slate-950">
              {formatCurrency(item.currentAmount, item.currency)}
            </p>
            <div className="pb-0.5 text-right">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                {t("subscription.estimatedPrice")}
              </p>
              <p className="text-base font-semibold text-teal-700">
                {formatCurrency(estimatedAmount, item.currency)}
              </p>
            </div>
          </div>
          {hasConfirmedEstimate ? (
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-emerald-700">
              {t("subscription.confirmed")}
            </p>
          ) : null}
          <p className="mt-2 text-sm text-amber-600">
            {t("subscription.nextIncrease", { value: formatPercent(item.predictedIncreaseRate) })}
          </p>
        </div>
        <Link
          to={`/abonelik/${item.id}`}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:border-slate-900 hover:text-slate-950"
        >
          {t("subscription.detail")}
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
