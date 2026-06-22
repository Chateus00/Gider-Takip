import { Link } from "react-router-dom";
import { CheckCircle2, Mail, ShieldCheck, Sparkles } from "lucide-react";

const featureList = [
  "Gmail ve Outlook baglayip abonelik maillerini otomatik tespit eder.",
  "Bulunan adaylari inceleyip sadece onayladiklarini abonelik listene ekler.",
  "Tekrarlayan odemeleri tek yerde toplayip takip etmeyi kolaylastirir.",
];

export default function About() {
  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-8">
        <div className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs uppercase tracking-[0.24em] text-teal-700">
          Gider Takip
        </div>

        <h1 className="mt-4 font-['Fraunces',serif] text-4xl leading-tight text-slate-950">
          Abonelik ve duzenli odemelerini mail kutundan takip et.
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          Gider Takip; kullanicinin kendi izniyle Gmail veya Outlook hesabini baglayip, fatura,
          makbuz ve yenileme maillerinden abonelik sinyallerini cikarir. Bulunan servisler once
          onizleme olarak gosterilir, sadece kullanicinin sectikleri hesabina eklenir.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Mail className="h-4 w-4" />
            Giris yap
          </Link>
          <Link
            to="/privacy"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
          >
            <ShieldCheck className="h-4 w-4" />
            Gizlilik politikasi
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
          Veri kullanim ozeti
        </div>

        <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
          <p>
            Uygulama, hesaba giris ve mail baglama akislari icin gerekli oturum verilerini isler.
            Gmail veya Outlook entegrasyonu ancak kullanici acik izin verdiginde baslar.
          </p>
          <p>
            Mail verileri reklam amacli kullanilmaz ve satilmaz. Amaç, tekrar eden odeme ve
            abonelik maillerini tespit edip kullaniciya kendi giderlerini daha net gostermektir.
          </p>
          <p>
            Daha fazla bilgi icin <Link to="/privacy" className="font-medium text-slate-900 underline">gizlilik politikasi</Link> ve{" "}
            <Link to="/terms" className="font-medium text-slate-900 underline">kullanim kosullari</Link> sayfalarini inceleyebilirsin.
          </p>
        </div>
      </section>
    </div>
  );
}
