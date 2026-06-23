import { useI18n } from "@/contexts/I18nContext";

export default function Privacy() {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-3xl rounded-[32px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-8">
      <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-500">
        {t("privacy.badge")}
      </div>

      <h1 className="mt-4 font-['Fraunces',serif] text-4xl text-slate-950">{t("privacy.title")}</h1>
      <p className="mt-4 text-sm leading-6 text-slate-600">
        {t("privacy.intro")}
      </p>

      <div className="mt-8 space-y-6 text-sm leading-6 text-slate-700">
        <section>
          <h2 className="text-base font-semibold text-slate-950">{t("privacy.sections.collected.title")}</h2>
          <p className="mt-2">{t("privacy.sections.collected.body")}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-950">{t("privacy.sections.purpose.title")}</h2>
          <p className="mt-2">{t("privacy.sections.purpose.body")}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-950">{t("privacy.sections.integrations.title")}</h2>
          <p className="mt-2">{t("privacy.sections.integrations.body")}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-950">{t("privacy.sections.retention.title")}</h2>
          <p className="mt-2">{t("privacy.sections.retention.body")}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-950">{t("privacy.sections.contact.title")}</h2>
          <p className="mt-2">{t("privacy.sections.contact.body")}</p>
        </section>
      </div>
    </section>
  );
}
