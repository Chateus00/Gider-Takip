import { Link } from "react-router-dom";
import { CheckCircle2, Mail, ShieldCheck, Sparkles } from "lucide-react";

const featureList = [
  "Gmail ve Outlook bağlayıp abonelik e-postalarını otomatik tespit eder.",
  "Bulunan adayları inceleyip sadece onayladıklarını abonelik listene ekler.",
  "Tekrarlayan ödemeleri tek yerde toplayıp takip etmeyi kolaylaştırır.",
];

export default function About() {
  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-8">
        <div className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs uppercase tracking-[0.24em] text-teal-700">
          Gider Takip
        </div>

        <h1 className="mt-4 font-['Fraunces',serif] text-4xl leading-tight text-slate-950">
          Abonelik ve düzenli ödemelerini e-posta kutundan takip et.
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          Gider Takip; kullanıcının kendi izniyle Gmail veya Outlook hesabını bağlayıp, fatura,
          makbuz ve yenileme e-postalarından abonelik sinyallerini çıkarır. Bulunan servisler önce
          önizleme olarak gösterilir, sadece kullanıcının seçtikleri hesabına eklenir.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Mail className="h-4 w-4" />
            Giriş yap
          </Link>
          <Link
            to="/privacy"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
          >
            <ShieldCheck className="h-4 w-4" />
            Gizlilik politikası
          </Link>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {featureList.map((item) => (
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
          Veri kullanım özeti
        </div>

        <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
          <p>
            Uygulama, hesaba giriş ve mail bağlama akışları için gerekli oturum verilerini işler.
            Gmail veya Outlook entegrasyonu ancak kullanıcı açık izin verdiğinde başlar.
          </p>
          <p>
            Mail verileri reklam amaçlı kullanılmaz ve satılmaz. Amaç, tekrar eden ödeme ve
            abonelik e-postalarını tespit edip kullanıcıya giderlerini daha net göstermektir.
          </p>
          <p>
            Daha fazla bilgi için{" "}
            <Link to="/privacy" className="font-medium text-slate-900 underline">
              gizlilik politikası
            </Link>{" "}
            ve{" "}
            <Link to="/terms" className="font-medium text-slate-900 underline">
              kullanım koşulları
            </Link>{" "}
            sayfalarını inceleyebilirsin.
          </p>
        </div>
      </section>
    </div>
  );
}
