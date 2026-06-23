import { useEffect, useState } from "react";
import { BellRing, ChevronRight, Clock3, Landmark, LoaderCircle, Mail, ScanSearch } from "lucide-react";
import { Link } from "react-router-dom";
import type { SubscriptionItem } from "../../shared/subscriptions";
import { useI18n } from "@/contexts/I18nContext";
import { updateSubscription } from "@/utils/api";
import { formatCurrency, formatDate, formatPercent } from "@/utils/formatters";

interface SubscriptionCardProps {
  item: SubscriptionItem;
}

const reminderOptions = [0, 1, 3, 7, 14] as const;

export default function SubscriptionCard({ item }: SubscriptionCardProps) {
  const { t } = useI18n();
  const [reminderDaysBefore, setReminderDaysBefore] = useState(item.reminderDaysBefore);
  const [isSavingReminder, setIsSavingReminder] = useState(false);
  const [saveError, setSaveError] = useState("");
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

  useEffect(() => {
    setReminderDaysBefore(item.reminderDaysBefore);
  }, [item.reminderDaysBefore]);

  async function handleReminderChange(nextValue: number) {
    setSaveError("");
    setReminderDaysBefore(nextValue);
    setIsSavingReminder(true);

    try {
      const updated = await updateSubscription(item.id, { reminderDaysBefore: nextValue });
      setReminderDaysBefore(updated.reminderDaysBefore);
    } catch (error) {
      setReminderDaysBefore(item.reminderDaysBefore);
      setSaveError(error instanceof Error ? error.message : t("subscription.reminderUpdateFailed"));
    } finally {
      setIsSavingReminder(false);
    }
  }

  const reminderLabel =
    reminderDaysBefore === 0
      ? t("subscription.reminderOff")
      : t("subscription.reminderSet", { count: reminderDaysBefore });

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
          <p className="mt-1 text-sm text-slate-500">{item.notes}</p>
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
        <div className="rounded-[22px] border border-emerald-100 bg-emerald-50/50 p-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-700">
                {t("subscription.quickReminder")}
              </p>
              <p className="mt-1 text-sm text-slate-600">{t("reminder.helper")}</p>
            </div>
            <label className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-slate-700">
              <span>{t("reminder.cardLabel")}</span>
              <select
                value={reminderDaysBefore}
                disabled={isSavingReminder}
                onChange={(event) => void handleReminderChange(Number(event.target.value))}
                className="bg-transparent font-medium outline-none"
              >
                {reminderOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === 0
                      ? t("reminder.options.off")
                      : t(
                          option === 1
                            ? "reminder.options.one"
                            : option === 3
                              ? "reminder.options.three"
                              : option === 7
                                ? "reminder.options.seven"
                                : "reminder.options.fourteen"
                        )}
                  </option>
                ))}
              </select>
              {isSavingReminder ? <LoaderCircle className="h-4 w-4 animate-spin text-emerald-700" /> : null}
            </label>
          </div>
          {saveError ? <p className="mt-2 text-sm text-rose-600">{saveError}</p> : null}
        </div>
      </div>

      <div className="flex items-center justify-between gap-5 md:flex-col md:items-end md:justify-center">
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{t("subscription.currentPrice")}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-950">
            {formatCurrency(item.currentAmount, item.currency)}
          </p>
          <p className="mt-2 text-sm text-amber-600">
            {t("subscription.nextIncrease", { value: formatPercent(item.predictedIncreaseRate) })}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">
            {t("common.confidence", { count: Math.round(item.detectionConfidence * 100) })}
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
