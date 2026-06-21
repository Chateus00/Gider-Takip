import { useState } from "react";
import { ArrowRight, LoaderCircle, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { EmailAnalysisResponse, EmailProvider } from "../../shared/subscriptions";
import { connectEmail, createSubscription } from "@/utils/api";
import { formatCurrency, formatDate } from "@/utils/formatters";

export default function SubscriptionForm() {
  const navigate = useNavigate();
  const [provider, setProvider] = useState<EmailProvider>("gmail");
  const [email, setEmail] = useState("");
  const [analysis, setAnalysis] = useState<EmailAnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [importingId, setImportingId] = useState("");
  const [error, setError] = useState("");

  async function handleAnalyze() {
    setIsAnalyzing(true);
    setError("");

    try {
      const response = await connectEmail({
        provider,
        email,
      });
      setAnalysis(response);
    } catch (analysisError) {
      setError(analysisError instanceof Error ? analysisError.message : "Mail analizi baslatilamadi.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleImport(previewId: string) {
    const previewItem = analysis?.preview.find((item) => item.id === previewId);

    if (!previewItem) {
      return;
    }

    setImportingId(previewId);
    setError("");

    try {
      const created = await createSubscription({
        name: previewItem.name,
        category: previewItem.category,
        logoUrl: previewItem.logoUrl,
        currentAmount: previewItem.currentAmount,
        currency: previewItem.currency,
        billingCycle: previewItem.billingCycle,
        nextPaymentDate: previewItem.nextPaymentDate,
        reminderDaysBefore: 3,
        notes: previewItem.notes,
        detectionMethod: "email",
        detectionConfidence: previewItem.confidence,
      });
      navigate(`/abonelik/${created.id}`);
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : "Abonelik eklenemedi.");
    } finally {
      setImportingId("");
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
      <div className="rounded-[32px] border border-slate-200/70 bg-slate-950 p-6 text-white shadow-[0_26px_70px_rgba(15,23,42,0.35)]">
        <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-teal-200">
          Ucretsiz mail analizi
        </div>
        <h1 className="mt-4 font-['Fraunces',serif] text-4xl leading-tight">
          Mail hesabini bagla, aboneliklerini otomatik analiz edelim.
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-300">
          Guvenli ve ucretsiz baslangic icin en mantikli yol OAuth ile Gmail veya Outlook hesabini baglamak. Bu demoda sadece saglayici ve e-posta adresi aliniyor; sonuc olarak faturali maillerden cikarilan abonelik adaylari listeleniyor.
        </p>
        <div className="mt-8 space-y-3">
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-400/10 px-3 py-1 text-xs text-teal-200">
              <ShieldCheck className="h-4 w-4" />
              Guvenli yontem
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Gercek urunde sifre toplamak yerine `Google ile Baglan` veya `Microsoft ile Baglan` mantigi kullanilmali. Bu sayede hem guvenlik korunur hem de ucretsiz API kotasi ile ilk surum kurulabilir.
            </p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-medium text-white">Akis</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              E-posta adresi alinir, invoice veya receipt mailleri taranir, bulunan servisler once onizlemede gosterilir, sadece sen onay verdiklerini `Aboneliklerim` listene ekleriz.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Mail baglantisi</p>
            <h2 className="mt-2 font-['Fraunces',serif] text-3xl text-slate-950">
              Aboneliklerini gelen kutundan yakala
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              `Aboneliklerim` sekmesinde yalnizca burada analiz edilen ve senin iceri aktardigin servisler yer alir.
            </p>
          </div>
          <div className="rounded-[24px] bg-slate-50 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Kaynak</p>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {provider === "gmail" ? "Gmail" : "Outlook"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Mail saglayicisi</span>
            <select
              value={provider}
              onChange={(event) => setProvider(event.target.value as EmailProvider)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-950"
            >
              <option value="gmail">Gmail</option>
              <option value="outlook">Outlook</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">E-posta adresi</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="ornek@mail.com"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-950"
            />
          </label>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !email}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isAnalyzing ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Analiz ediliyor
              </>
            ) : (
              <>
                Maili analiz et
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        {analysis ? (
          <div className="mt-6 rounded-[28px] bg-slate-50 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Baglanan hesap</p>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  {analysis.connection.email} · {analysis.connection.provider === "gmail" ? "Gmail" : "Outlook"}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700">
                <Sparkles className="h-4 w-4" />
                {analysis.summary}
              </div>
            </div>

            <div className="mt-4 grid gap-4">
              {analysis.preview.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-4 rounded-[24px] border border-slate-200/80 bg-white px-4 py-4 md:grid-cols-[72px_1fr_auto]"
                >
                  <img src={item.logoUrl} alt={item.name} className="h-[72px] w-[72px] rounded-[20px] object-cover" />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-950">{item.name}</h3>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        {item.category}
                      </span>
                      <span className="rounded-full bg-teal-50 px-3 py-1 text-[11px] font-medium text-teal-700">
                        Guven %{Math.round(item.confidence * 100)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">{item.notes}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
                      <span>{formatCurrency(item.currentAmount, item.currency)}</span>
                      <span>{formatDate(item.nextPaymentDate)}</span>
                      <span>{item.billingCycle === "monthly" ? "Aylik" : "Yillik"}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => handleImport(item.id)}
                      disabled={importingId === item.id}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {importingId === item.id ? "Ekleniyor" : "Aboneliklerime ekle"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-[28px] border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-sm leading-6 text-slate-500">
            Mail adresini analiz ettiginde burada yalnizca o hesaptan algilanan abonelik adaylari listelenecek; sen onaylamadan `Aboneliklerim` sekmesine hicbir servis dusmeyecek.
          </div>
        )}

        <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-500">
          <div className="inline-flex items-center gap-2 font-medium text-slate-700">
            <Mail className="h-4 w-4" />
            Ucretsiz yol notu
          </div>
          <p className="mt-2">
            Gercek uygulamada sifre istemek yerine Gmail icin Google OAuth + Gmail API, Outlook icin Microsoft OAuth + Graph API kullanmak hem daha guvenli hem de baslangic icin ucretsizdir.
          </p>
        </div>

        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
      </div>
    </section>
  );
}
