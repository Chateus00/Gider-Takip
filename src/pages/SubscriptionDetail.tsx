import { useEffect, useState } from "react";
import { ArrowLeft, BadgeHelp, Landmark, LoaderCircle, Mail, ScanSearch } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import type { PredictionResponse, SubscriptionItem } from "../../shared/subscriptions";
import DetailTimeline from "@/components/DetailTimeline";
import ForecastPanel from "@/components/ForecastPanel";
import { fetchPrediction, fetchSubscription } from "@/utils/api";
import { formatCurrency, formatDate } from "@/utils/formatters";

export default function SubscriptionDetail() {
  const { id = "" } = useParams();
  const [item, setItem] = useState<SubscriptionItem | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState("");

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
        setError(loadError instanceof Error ? loadError.message : "Detay bilgisi yuklenemedi.");
      }
    }

    loadDetail();
  }, [id]);

  if (error) {
    return <div className="rounded-[24px] bg-rose-50 p-6 text-rose-700">{error}</div>;
  }

  if (!item || !prediction) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3 text-slate-500">
        <LoaderCircle className="h-5 w-5 animate-spin" />
        Detaylar yukleniyor...
      </div>
    );
  }

  const detectionMap = {
    email: { label: "Mail taramasi", icon: Mail },
    ocr: { label: "OCR taramasi", icon: ScanSearch },
    banking: { label: "Banka entegrasyonu", icon: Landmark },
  } as const;

  const detection = detectionMap[item.detectionMethod];
  const DetectionIcon = detection.icon;

  return (
    <div className="space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition hover:border-slate-950 hover:text-slate-950"
      >
        <ArrowLeft className="h-4 w-4" />
        Panele don
      </Link>

      <section className="grid gap-6 rounded-[32px] border border-white/10 bg-slate-950 p-6 text-white shadow-[0_30px_90px_rgba(15,23,42,0.4)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <img src={item.logoUrl} alt={item.name} className="h-20 w-20 rounded-[24px] object-cover" />
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.category}</p>
              <h1 className="mt-2 font-['Fraunces',serif] text-4xl">{item.name}</h1>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-slate-100">
                <DetectionIcon className="h-4 w-4" />
                {detection.label} · Guven %{Math.round(item.detectionConfidence * 100)}
              </div>
            </div>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-300">{item.notes}</p>

          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Mevcut fiyat</p>
              <p className="mt-2 text-2xl font-semibold">{formatCurrency(item.currentAmount, item.currency)}</p>
            </article>
            <article className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Sonraki odeme</p>
              <p className="mt-2 text-2xl font-semibold">{formatDate(item.nextPaymentDate)}</p>
            </article>
            <article className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Hatirlatma</p>
              <p className="mt-2 text-2xl font-semibold">{item.reminderDaysBefore} gun once</p>
            </article>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-slate-100">
            <BadgeHelp className="h-4 w-4" />
            AI odeme notlari
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
      <DetailTimeline items={item.paymentHistory} />
    </div>
  );
}
