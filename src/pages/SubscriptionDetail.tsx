import { useEffect, useState } from "react";
import { ArrowLeft, BadgeHelp, Landmark, LoaderCircle, Mail, ScanSearch } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import type { PredictionResponse, SubscriptionItem } from "../../shared/subscriptions";
import DetailTimeline from "@/components/DetailTimeline";
import ForecastPanel from "@/components/ForecastPanel";
import BrandLogoImage from "@/components/BrandLogoImage";
import ReminderSelect from "@/components/ReminderSelect";
import { useI18n } from "@/contexts/I18nContext";
import { fetchPrediction, fetchSubscription, updateSubscription } from "@/utils/api";
import { formatCurrency, formatDate } from "@/utils/formatters";

export default function SubscriptionDetail() {
  const { t } = useI18n();
  const { id = "" } = useParams();
  const [item, setItem] = useState<SubscriptionItem | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState("");
  const [isSavingReminder, setIsSavingReminder] = useState(false);

  useEffect(() => {
    async function loadDetail() {
      try {
        const [subscriptionData, predictionData] = await Promise.all([
          fetchSubscription(id),
          fetchPrediction(id),
        ]);

        setItem(subscriptionData);
        setPrediction(predictionData);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : t("subscription.detailsError"));
      }
    }

    loadDetail();
  }, [id, t]);

  if (error) {
    return <div className="rounded-[24px] bg-rose-50 p-6 text-rose-700">{error}</div>;
  }

  if (!item || !prediction) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3 text-slate-500">
        <LoaderCircle className="h-5 w-5 animate-spin" />
        {t("subscription.detailsLoading")}
      </div>
    );
  }

  const detectionMap = {
    email: { label: t("subscription.detection.email"), icon: Mail },
    ocr: { label: t("subscription.detection.ocr"), icon: ScanSearch },
    banking: { label: t("subscription.detection.banking"), icon: Landmark },
  } as const;

  const detection = detectionMap[item.detectionMethod];
  const DetectionIcon = detection.icon;
  const reminderValueLabel =
    item.reminderDaysBefore === 0
      ? t("subscription.reminderOffDetail")
      : t("common.daysBefore", { count: item.reminderDaysBefore });

  async function handleReminderChange(nextValue: number) {
    setIsSavingReminder(true);
    setError("");

    try {
      const updated = await updateSubscription(item.id, { reminderDaysBefore: nextValue });
      setItem(updated);
    } catch (updateError) {
      setError(
        updateError instanceof Error ? updateError.message : t("subscription.reminderUpdateFailed")
      );
    } finally {
      setIsSavingReminder(false);
    }
  }

  return (
    <div className="space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition hover:border-slate-950 hover:text-slate-950"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("common.backToDashboard")}
      </Link>

      <section className="grid gap-6 rounded-[32px] border border-white/10 bg-slate-950 p-6 text-white shadow-[0_30px_90px_rgba(15,23,42,0.4)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <BrandLogoImage
              name={item.name}
              src={item.logoUrl}
              alt={item.name}
              containerClassName="flex min-h-20 min-w-[120px] max-w-[168px] items-center"
              className="h-16 w-auto max-w-[168px] object-contain md:h-20"
            />
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.category}</p>
              <h1 className="mt-2 font-['Fraunces',serif] text-4xl">{item.name}</h1>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-slate-100">
                <DetectionIcon className="h-4 w-4" />
                {detection.label} · {t("common.confidence", { count: Math.round(item.detectionConfidence * 100) })}
              </div>
            </div>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-300">{item.notes}</p>

          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{t("subscription.currentPriceDetail")}</p>
              <p className="mt-2 text-2xl font-semibold">{formatCurrency(item.currentAmount, item.currency)}</p>
            </article>
            <article className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{t("subscription.nextPayment")}</p>
              <p className="mt-2 text-2xl font-semibold">{formatDate(item.nextPaymentDate)}</p>
            </article>
            <article className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{t("subscription.reminderLabel")}</p>
              <p className="mt-2 text-2xl font-semibold">{reminderValueLabel}</p>
            </article>
          </div>

          <div className="rounded-[24px] border border-emerald-300/20 bg-emerald-400/10 p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">{t("reminder.title")}</p>
                <p className="mt-2 text-sm text-slate-200">{t("reminder.helper")}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-white">
                  {item.reminderDaysBefore === 0 ? t("reminder.disabled") : t("reminder.enabled")}
                </span>
                <ReminderSelect
                  value={item.reminderDaysBefore}
                  disabled={isSavingReminder}
                  isSaving={isSavingReminder}
                  variant="dark"
                  onChange={(value) => handleReminderChange(value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-slate-100">
            <BadgeHelp className="h-4 w-4" />
            {t("subscription.paymentNotes")}
          </div>
          <div className="mt-5 space-y-3">
            {prediction.notes.map((note) => (
              <p key={note} className="rounded-[20px] bg-white/5 p-4 text-sm leading-6 text-slate-200">
                {note}
              </p>
            ))}
          </div>
        </div>
      </section>

      <ForecastPanel data={prediction} />
      <DetailTimeline items={item.paymentHistory} currency={item.currency} />
    </div>
  );
}
