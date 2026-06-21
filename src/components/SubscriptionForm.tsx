import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Eye,
  Inbox,
  LoaderCircle,
  Mail,
  ScanSearch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { EmailAnalysisResponse, EmailProvider } from "../../shared/subscriptions";
import { useAuth } from "@/contexts/AuthContext";
import { connectEmail, createSubscription } from "@/utils/api";
import { formatCurrency, formatDate } from "@/utils/formatters";
import {
  analyzeLinkedMailbox,
  clearPendingMailProvider,
  startMailProviderLink,
} from "@/utils/mailConnection";

const providerText = {
  gmail: {
    label: "Google / Gmail",
    button: "Google ile bagla",
    helper: "Gmail API uzerinden receipt, invoice ve yenileme mailleri taranir.",
  },
  outlook: {
    label: "Microsoft / Outlook",
    button: "Microsoft ile bagla",
    helper: "Microsoft Graph uzerinden Outlook / Hotmail mailleri taranir.",
  },
} as const;

export default function SubscriptionForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { session } = useAuth();
  const [provider, setProvider] = useState<EmailProvider>("gmail");
  const [analysis, setAnalysis] = useState<EmailAnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [linkingProvider, setLinkingProvider] = useState<EmailProvider | "">("");
  const [importingId, setImportingId] = useState("");
  const [importedMap, setImportedMap] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const hasHandledCallback = useRef(false);

  function toFriendlyError(connectError: unknown) {
    const message = connectError instanceof Error ? connectError.message : "Mail hesabi baglanamadi.";

    if (message.toLowerCase().includes("manual linking")) {
      return "Supabase panelinde Auth > Providers altindan manual linking ozelligini acman gerekiyor.";
    }

    if (message.toLowerCase().includes("unsupported provider")) {
      return "Supabase provider ayarlari henuz tamamlanmamis gorunuyor.";
    }

    return message;
  }

  const handleAnalyze = useCallback(async (providerToScan: EmailProvider) => {
    if (!session) {
      setError("Mail taramasi icin once giris yapmis olman gerekiyor.");
      return;
    }

    setIsAnalyzing(true);
    setError("");
    setImportedMap({});
    setStatusMessage(`${providerText[providerToScan].label} baglandi, mailler taraniyor...`);
    setProvider(providerToScan);

    try {
      const response = await analyzeLinkedMailbox(session, providerToScan);
      await connectEmail({
        provider: response.connection.provider,
        email: response.connection.email,
      });
      setAnalysis(response);
      setStatusMessage(response.summary);
    } catch (analysisError) {
      setError(
        analysisError instanceof Error ? analysisError.message : "Mail analizi baslatilamadi."
      );
    } finally {
      setIsAnalyzing(false);
    }
  }, [session]);

  async function handleProviderConnect(providerToConnect: EmailProvider) {
    setProvider(providerToConnect);
    setLinkingProvider(providerToConnect);
    setError("");
    setStatusMessage(`${providerText[providerToConnect].label} icin baglanti ekrani aciliyor...`);

    try {
      await startMailProviderLink(providerToConnect);
    } catch (connectError) {
      setError(toFriendlyError(connectError));
      setStatusMessage("");
      setLinkingProvider("");
    }
  }

  const analysisStats = useMemo(() => {
    if (!analysis?.preview.length) {
      return null;
    }

    const totalMonthly = analysis.preview.reduce((total, item) => {
      return total + (item.billingCycle === "yearly" ? item.currentAmount / 12 : item.currentAmount);
    }, 0);
    const averageConfidence =
      analysis.preview.reduce((total, item) => total + item.confidence, 0) / analysis.preview.length;

    return {
      totalMonthly,
      averageConfidence,
      itemCount: analysis.preview.length,
      importedCount: Object.keys(importedMap).length,
    };
  }, [analysis, importedMap]);

  const flowSteps = [
    {
      id: "connect",
      title: "Saglayiciyi bagla",
      description: "Google veya Microsoft hesabina izin ver.",
      done: Boolean(analysis || isAnalyzing || linkingProvider),
      active: !analysis && !isAnalyzing,
    },
    {
      id: "scan",
      title: "Fatura maillerini tara",
      description: "Receipt, invoice ve yenileme mailleri eslestirilir.",
      done: Boolean(analysis),
      active: isAnalyzing || Boolean(linkingProvider),
    },
    {
      id: "review",
      title: "Sonuclari onayla",
      description: "Bulunan adaylari tek tek Aboneliklerime ekle.",
      done: Boolean(analysisStats?.importedCount),
      active: Boolean(analysis) && !isAnalyzing,
    },
  ];

  function getCardTone(option: EmailProvider) {
    if (provider === option) {
      return "border-slate-950 bg-slate-950 text-white";
    }

    return "border-slate-200 bg-slate-50 text-slate-800";
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
      setImportedMap((current) => ({
        ...current,
        [previewId]: created.id,
      }));
      setStatusMessage(`${previewItem.name} Aboneliklerim listesine eklendi.`);
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : "Abonelik eklenemedi.");
    } finally {
      setImportingId("");
    }
  }

  useEffect(() => {
    const isConnected = searchParams.get("mail_connected") === "1";
    const callbackProvider = searchParams.get("provider");

    if (!isConnected || hasHandledCallback.current || !session) {
      return;
    }

    if (callbackProvider !== "gmail" && callbackProvider !== "outlook") {
      clearPendingMailProvider();
      return;
    }

    hasHandledCallback.current = true;

    void (async () => {
      try {
        await handleAnalyze(callbackProvider);
      } finally {
        clearPendingMailProvider();
        navigate("/abonelik/yeni", { replace: true });
      }
    })();
  }, [handleAnalyze, navigate, searchParams, session]);

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
          En sade yol, kullanicinin Gmail veya Outlook hesabini OAuth ile baglamasi. Biz de
          sadece izin verilen faturali mailleri tarayip abonelik adaylarini cikariyoruz.
        </p>
        <div className="mt-8 space-y-3">
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-400/10 px-3 py-1 text-xs text-teal-200">
              <ShieldCheck className="h-4 w-4" />
              Guvenli yontem
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Kullanici sifresi toplamiyoruz. `Google ile bagla` ve `Microsoft ile bagla`
              akislariyla sadece gerekli mail okuma iznini istiyoruz.
            </p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-medium text-white">Akis</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Once hesabi baglarsin, sonra faturali mailler taranir, bulunan servisler onizleme
              listesine duser. Sadece onayladiklarin `Aboneliklerim` alanina eklenir.
            </p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-medium text-white">Akis adimlari</p>
            <div className="mt-4 space-y-3">
              {flowSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`rounded-[20px] border px-4 py-3 ${
                    step.active
                      ? "border-teal-300/30 bg-teal-400/10"
                      : step.done
                        ? "border-emerald-300/20 bg-emerald-400/10"
                        : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                        step.done
                          ? "bg-emerald-300/20 text-emerald-100"
                          : step.active
                            ? "bg-teal-300/20 text-teal-100"
                            : "bg-white/10 text-slate-300"
                      }`}
                    >
                      {step.done ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{step.title}</p>
                      <p className="text-sm text-slate-300">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
              `Aboneliklerim` sekmesinde sadece burada baglanan hesaptan tespit edilip senin
              onayladigin servisler yer alir.
            </p>
          </div>
          <div className="rounded-[24px] bg-slate-50 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Akis durumu</p>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {linkingProvider
                ? "Baglanti izni bekleniyor"
                : isAnalyzing
                  ? "Mail kutusu taraniyor"
                  : analysis
                    ? "Onay asamasi"
                    : "Baglanti bekleniyor"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {(["gmail", "outlook"] as EmailProvider[]).map((option) => (
            <article
              key={option}
              className={`rounded-[28px] border p-5 transition ${getCardTone(option)}`}
            >
              <p className="text-xs uppercase tracking-[0.2em] opacity-70">Saglayici</p>
              <h3 className="mt-2 text-xl font-semibold">{providerText[option].label}</h3>
              <p className="mt-3 text-sm leading-6 opacity-80">{providerText[option].helper}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className={`rounded-full px-3 py-1 ${provider === option ? "bg-white/10 text-white" : "bg-white text-slate-500"}`}>
                  OAuth izin ekrani
                </span>
                <span className={`rounded-full px-3 py-1 ${provider === option ? "bg-white/10 text-white" : "bg-white text-slate-500"}`}>
                  Fatura mail taramasi
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void handleProviderConnect(option)}
                  disabled={Boolean(linkingProvider) || isAnalyzing}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                    provider === option
                      ? "bg-white text-slate-950 hover:bg-slate-100"
                      : "bg-slate-950 text-white hover:bg-slate-800"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {linkingProvider === option ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Baglaniyor
                    </>
                  ) : (
                    <>
                      {providerText[option].button}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => void handleAnalyze(option)}
                  disabled={isAnalyzing || Boolean(linkingProvider)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                    provider === option
                      ? "border-white/20 text-white hover:border-white/40"
                      : "border-slate-300 text-slate-700 hover:border-slate-950 hover:text-slate-950"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {isAnalyzing && provider === option ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Taraniyor
                    </>
                  ) : (
                    <>
                      Bagli hesabi tara
                      <Mail className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          <div className="inline-flex items-center gap-2 font-medium text-slate-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Oturumdaki hesap
          </div>
          <p className="mt-2">
            Sisteme giris yaptigin hesap: <span className="font-medium text-slate-950">{session?.user.email}</span>
          </p>
          <p className="mt-1">
            Farkli bir Gmail veya Outlook baglamak istersen Supabase panelinde `Manual linking`
            secenegini acman gerekiyor.
          </p>
        </div>

        {linkingProvider || isAnalyzing ? (
          <div className="mt-6 rounded-[28px] border border-teal-100 bg-teal-50/80 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-teal-600 shadow-sm">
                {linkingProvider ? (
                  <Mail className="h-5 w-5" />
                ) : (
                  <ScanSearch className="h-5 w-5 animate-pulse" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  {linkingProvider
                    ? `${providerText[linkingProvider].label} icin izin ekrani aciliyor`
                    : "Mail kutusunda fatura ve yenileme mailleri taraniyor"}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Bu adimda sadece odeme, makbuz ve abonelik sinyali tasiyan mailler incelenir.
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {[
                    "Odeme bildirimleri ayiklaniyor",
                    "Servis ve tutar bilgisi eslestiriliyor",
                    "Onay ekranina guven puani hazirlaniyor",
                  ].map((item) => (
                    <div key={item} className="rounded-[18px] bg-white px-4 py-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <LoaderCircle className="h-4 w-4 animate-spin text-teal-600" />
                        {item}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {analysis ? (
          <div className="mt-6 rounded-[28px] bg-slate-50 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Baglanan hesap</p>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  {analysis.connection.email} · {providerText[analysis.connection.provider].label}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700">
                <Sparkles className="h-4 w-4" />
                {analysis.summary}
              </div>
            </div>

            {analysisStats ? (
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-[22px] border border-slate-200 bg-white px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Bulunan aday</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{analysisStats.itemCount}</p>
                  <p className="mt-1 text-sm text-slate-500">Faturali mail eslesmesiyle bulundu</p>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-white px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Aylik toplam</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {formatCurrency(analysisStats.totalMonthly, "TRY")}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">Yillik planlar ayliga bolunerek hesaplandi</p>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-white px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Ortalama guven</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    %{Math.round(analysisStats.averageConfidence * 100)}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {analysisStats.importedCount} servis zaten iceri aktarildi
                  </p>
                </div>
              </div>
            ) : null}

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
                    {importedMap[item.id] ? (
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                          <CheckCircle2 className="h-4 w-4" />
                          Eklendi
                        </span>
                        <button
                          type="button"
                          onClick={() => navigate(`/abonelik/${importedMap[item.id]}`)}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
                        >
                          Detayi ac
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleImport(item.id)}
                        disabled={importingId === item.id}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {importingId === item.id ? "Ekleniyor" : "Aboneliklerime ekle"}
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {analysisStats?.importedCount ? (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-emerald-100 bg-white px-4 py-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Onaylanan abonelikler panele hazir</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Istersen kontrole donup toplam harcama ve yaklasan odemeleri gorebilirsin.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Panele git
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mt-6 rounded-[28px] border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-sm leading-6 text-slate-500">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                <Inbox className="h-5 w-5" />
              </div>
              <div>
                Saglayiciyi bagladiginda burada o gelen kutusundan algilanan abonelik adaylari
                listelenir; sen onaylamadan `Aboneliklerim` sekmesine hicbir servis dusmez.
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {[
                    "Netflix, Spotify ve benzeri servisleri yakalar",
                    "Tutari ve sonraki odeme tarihini cikarir",
                    "Guven puani ile birlikte sana sunar",
                  ].map((item) => (
                    <div key={item} className="rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-500">
          <div className="inline-flex items-center gap-2 font-medium text-slate-700">
            <Mail className="h-4 w-4" />
            Kurulum notu
          </div>
          <p className="mt-2">
            Supabase panelinde `Google`, `Azure` ve `Manual linking` aktif oldugunda bu ekran
            gercek OAuth baglantisini baslatir. Google tarafinda Gmail izni, Microsoft tarafinda
            `Mail.Read` ve `email` scope'u gerekir.
          </p>
        </div>

        {statusMessage ? <p className="mt-4 text-sm text-emerald-700">{statusMessage}</p> : null}
        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
      </div>
    </section>
  );
}
