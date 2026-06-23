import { Link } from "react-router-dom";
import { CheckCircle2, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

export default function About() {
  const { t, tList } = useI18n();

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-8">
        <div className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs uppercase tracking-[0.24em] text-teal-700">
          {t("about.badge")}
        </div>

        <h1 className="mt-4 font-['Fraunces',serif] text-4xl leading-tight text-slate-950">
          {t("about.title")}
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          {t("about.description")}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Mail className="h-4 w-4" />
            {t("about.signInCta")}
          </Link>
          <Link
            to="/privacy"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
          >
            <ShieldCheck className="h-4 w-4" />
            {t("common.privacy")}
          </Link>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {tList("about.features").map((item) => (
          <article
            key={item}
            className="rounded-[28px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <p className="mt-4 text-sm leading-6 text-slate-700">{item}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[32px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-8">
        <div className="flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-slate-400">
          <Sparkles className="h-4 w-4" />
          {t("about.summaryTitle")}
        </div>

        <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
          {tList("about.summaryParagraphs").map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p>{t("about.summaryMore", { privacy: t("common.privacy"), terms: t("common.terms") })}</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy" className="font-medium text-slate-900 underline">
              {t("common.privacy")}
            </Link>
            <Link to="/terms" className="font-medium text-slate-900 underline">
              {t("common.terms")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
