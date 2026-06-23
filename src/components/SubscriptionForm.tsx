import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  Mail,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { EmailAnalysisResponse, EmailProvider } from "../../shared/subscriptions";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { connectEmail, createSubscription } from "@/utils/api";
import {
  analyzeLinkedMailbox,
  clearPendingMailProvider,
  getStoredConnectedMailAccounts,
  storeConnectedMailAccount,
  startMailProviderLink,
} from "@/utils/mailConnection";

export default function SubscriptionForm() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { session } = useAuth();
  const [provider, setProvider] = useState<EmailProvider>("gmail");
  const [analysis, setAnalysis] = useState<EmailAnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [linkingProvider, setLinkingProvider] = useState<EmailProvider | "">("");
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [connectedAccounts, setConnectedAccounts] = useState(() => getStoredConnectedMailAccounts());
  const hasHandledCallback = useRef(false);

  const providerText = useMemo(
    () =>
      ({
        gmail: {
          label: t("subscriptionForm.providerLabel.gmail"),
          button: t("subscriptionForm.providerButton.gmail"),
          helper: t("subscriptionForm.providerHelper.gmail"),
        },
        outlook: {
          label: t("subscriptionForm.providerLabel.outlook"),
          button: t("subscriptionForm.providerButton.outlook"),
          helper: t("subscriptionForm.providerHelper.outlook"),
        },
      }) as const,
    [t]
  );

  function toFriendlyError(connectError: unknown) {
    const message =
      connectError instanceof Error ? connectError.message : t("subscriptionForm.errors.connectFailed");

    if (message.toLowerCase().includes("manual linking")) {
      return t("subscriptionForm.errors.manualLinkingRequired");
    }

    if (message.toLowerCase().includes("unsupported provider")) {
      return t("subscriptionForm.errors.unsupportedProvider");
    }

    return message;
  }

  const handleAnalyze = useCallback(async (providerToScan: EmailProvider) => {
    if (!session) {
      setError(t("subscriptionForm.errors.signInRequired"));
      return;
    }

    setIsAnalyzing(true);
    setError("");
    setStatusMessage(
      t("subscriptionForm.statusMessages.scanningStarted", {
        provider: providerText[providerToScan].label,
      })
    );
    setProvider(providerToScan);

    try {
      const response = await analyzeLinkedMailbox(session, providerToScan);
      const savedConnection = await connectEmail({
        provider: response.connection.provider,
        email: response.connection.email,
      });
      setConnectedAccounts(storeConnectedMailAccount(savedConnection.connection));
      const createdEntries = await Promise.all(
        response.preview.map(async (item) => {
          const created = await createSubscription({
            name: item.name,
            category: item.category,
            logoUrl: item.logoUrl,
            currentAmount: item.currentAmount,
            currency: item.currency,
            billingCycle: item.billingCycle,
            nextPaymentDate: item.nextPaymentDate,
            reminderDaysBefore: 3,
            notes: item.notes,
            detectionMethod: "email",
            detectionConfidence: item.confidence,
          });

          return [item.id, created.id] as const;
        })
      );

      setAnalysis(response);
      setStatusMessage(
        t("subscriptionForm.summaryTransferred", { count: createdEntries.length })
      );
    } catch (analysisError) {
      setError(
        analysisError instanceof Error ? analysisError.message : t("subscriptionForm.errors.analyzeFailed")
      );
    } finally {
      setIsAnalyzing(false);
    }
  }, [providerText, session, t]);

  async function handleProviderConnect(providerToConnect: EmailProvider) {
    setProvider(providerToConnect);
    setLinkingProvider(providerToConnect);
    setError("");
    setStatusMessage(
      t("subscriptionForm.statusMessages.permissionOpening", {
        provider: providerText[providerToConnect].label,
      })
    );

    try {
      await startMailProviderLink(providerToConnect);
    } catch (connectError) {
      setError(toFriendlyError(connectError));
      setStatusMessage("");
      setLinkingProvider("");
    }
  }

  const flowSteps = [
    {
      id: "connect",
      title: t("subscriptionForm.flow.link"),
      description: t("subscriptionForm.flow.linkDescription"),
      done: Boolean(analysis || isAnalyzing || linkingProvider),
      active: !analysis && !isAnalyzing,
    },
    {
      id: "scan",
      title: t("subscriptionForm.flow.scan"),
      description: t("subscriptionForm.flow.scanDescription"),
      done: Boolean(analysis),
      active: isAnalyzing || Boolean(linkingProvider),
    },
    {
      id: "review",
      title: t("subscriptionForm.flow.review"),
      description: t("subscriptionForm.flow.reviewDescription"),
      done: Boolean(analysis),
      active: Boolean(analysis) && !isAnalyzing,
    },
  ];

  function getCardTone(option: EmailProvider) {
    if (provider === option) {
      return "border-slate-950 bg-slate-950 text-white";
    }

    return "border-slate-200 bg-slate-50 text-slate-800";
  }

  useEffect(() => {
    const callbackError = searchParams.get("mail_error");
    const callbackErrorDescription = searchParams.get("mail_error_description");

    if (!callbackError) {
      return;
    }

    if (callbackError === "identity_already_exists") {
      setError(t("subscriptionForm.errors.alreadyConnected"));
    } else {
      setError(callbackErrorDescription ?? t("subscriptionForm.errors.callbackFailed"));
    }

    clearPendingMailProvider();
    setStatusMessage("");
    navigate("/abonelik/yeni", { replace: true });
  }, [navigate, searchParams, t]);

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
          {t("subscriptionForm.heroBadge")}
        </div>
        <h1 className="mt-4 font-['Fraunces',serif] text-4xl leading-tight">
          {t("subscriptionForm.heroTitle")}
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-300">
          {t("subscriptionForm.heroDescription")}
        </p>
        <div className="mt-8 space-y-3">
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-400/10 px-3 py-1 text-xs text-teal-200">
              <ShieldCheck className="h-4 w-4" />
              {t("subscriptionForm.secureMethod")}
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              {t("subscriptionForm.secureDescription")}
            </p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-medium text-white">{t("subscriptionForm.flowStepsTitle")}</p>
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
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{t("subscriptionForm.providerStatus")}</p>
            <h2 className="mt-2 font-['Fraunces',serif] text-3xl text-slate-950">
              {t("subscriptionForm.title")}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              {t("subscriptionForm.description")}
            </p>
          </div>
          <div className="rounded-[24px] bg-slate-50 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{t("subscriptionForm.statusTitle")}</p>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {linkingProvider
                ? t("subscriptionForm.statePermission")
                : isAnalyzing
                  ? t("subscriptionForm.stateScanning")
                  : analysis
                    ? t("subscriptionForm.stateTransferred")
                    : connectedAccounts.length
                      ? t("subscriptionForm.connectedCount", { count: connectedAccounts.length })
                      : t("subscriptionForm.stateWaiting")}
            </p>
          </div>
        </div>

        {connectedAccounts.length ? (
          <div className="mt-6 rounded-[24px] border border-emerald-100 bg-emerald-50/70 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">{t("subscriptionForm.connectedAccounts")}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {t("subscriptionForm.connectedHint")}
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-emerald-800">
                {t("subscriptionForm.accounts", { count: connectedAccounts.length })}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {connectedAccounts.map((account) => (
                <span
                  key={`${account.provider}-${account.email}`}
                  className="rounded-full border border-emerald-100 bg-white px-3 py-2 text-sm text-slate-700"
                >
                  {account.email} · {providerText[account.provider].label}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {(["gmail", "outlook"] as EmailProvider[]).map((option) => (
            <article
              key={option}
              className={`rounded-[28px] border p-5 transition ${getCardTone(option)}`}
            >
              <p className="text-xs uppercase tracking-[0.2em] opacity-70">{t("subscriptionForm.providerCardLabel")}</p>
              <h3 className="mt-2 text-xl font-semibold">{providerText[option].label}</h3>
              <p className="mt-3 text-sm leading-6 opacity-80">{providerText[option].helper}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className={`rounded-full px-3 py-1 ${provider === option ? "bg-white/10 text-white" : "bg-white text-slate-500"}`}>
                  {t("subscriptionForm.oauthChip")}
                </span>
                <span className={`rounded-full px-3 py-1 ${provider === option ? "bg-white/10 text-white" : "bg-white text-slate-500"}`}>
                  {t("subscriptionForm.invoiceChip")}
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
                      {t("subscriptionForm.connecting")}
                    </>
                  ) : (
                    <>
                      {connectedAccounts.length ? t("subscriptionForm.providerButton.additional") : providerText[option].button}
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
                      {t("subscriptionForm.scanning")}
                    </>
                  ) : (
                    <>
                      {t("subscriptionForm.scanLinkedAccount")}
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
            {t("subscriptionForm.sessionTitle")}
          </div>
          <p className="mt-2">
            {t("subscriptionForm.signedInAs", { email: session?.user.email ?? "-" })}
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
                    ? t("subscriptionForm.openingPermissionTitle", { provider: providerText[linkingProvider].label })
                    : t("subscriptionForm.scanningTitle")}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {t("subscriptionForm.activityDescription")}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {analysis ? (
          <div className="mt-6 rounded-[28px] bg-slate-50 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{t("subscriptionForm.connectedAccount")}</p>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  {analysis.connection.email} · {providerText[analysis.connection.provider].label}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                {t("subscriptionForm.scanComplete")}
              </div>
            </div>
            <div className="mt-4 rounded-[22px] border border-emerald-100 bg-white px-4 py-4">
              <p className="text-sm font-semibold text-slate-900">{t("subscriptionForm.transferredTitle")}</p>
              <p className="mt-1 text-sm text-slate-500">
                {t("subscriptionForm.transferredDescription")}
              </p>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {t("common.goToDashboard")}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-[28px] border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-sm leading-6 text-slate-500">
            {t("subscriptionForm.defaultHint")}
          </div>
        )}

        {statusMessage ? <p className="mt-4 text-sm text-emerald-700">{statusMessage}</p> : null}
        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
      </div>
    </section>
  );
}
