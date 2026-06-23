export default function Terms() {
  return (
    <section className="mx-auto max-w-3xl rounded-[32px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-8">
      <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-500">
        Terms Of Service
      </div>

      <h1 className="mt-4 font-['Fraunces',serif] text-4xl text-slate-950">Kullanım Koşulları</h1>
      <p className="mt-4 text-sm leading-6 text-slate-600">
        Bu koşullar, Gider Takip uygulamasını kullanırken uymanız gereken temel kuralları açıklar.
      </p>

      <div className="mt-8 space-y-6 text-sm leading-6 text-slate-700">
        <section>
          <h2 className="text-base font-semibold text-slate-950">Hizmetin kapsamı</h2>
          <p className="mt-2">
            Gider Takip, kullanıcıların abonelik ve düzenli ödeme kalemlerini takip etmesine yardım
            eden bir uygulamadır. Sunulan özellikler zaman içinde değişebilir, geliştirilebilir
            veya sınırlandırılabilir.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-950">Kullanıcı sorumluluğu</h2>
          <p className="mt-2">
            Hesap bilgilerinizin güvenliğinden siz sorumlusunuz. Uygulamayı hukuka aykırı, zarar
            verici veya başka kullanıcıların deneyimini bozacak şekilde kullanmamayı kabul
            edersiniz.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-950">Üçüncü taraf hizmetler</h2>
          <p className="mt-2">
            Uygulama; Supabase, Google ve Microsoft gibi üçüncü taraf servislerle entegre olabilir.
            Bu servislerin kullanımına ilişkin ek koşullar kendi sağlayıcıları tarafından
            belirlenir.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-950">Sorumluluğun sınırlandırılması</h2>
          <p className="mt-2">
            Hizmet olduğu gibi sunulur. Teknik kesintiler, üçüncü taraf servis sorunları veya
            gecikmeler nedeniyle doğabilecek zararlarda makul yasal sınırlar dahilinde sorumluluk
            sınırlı olabilir.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-950">Güncellemeler</h2>
          <p className="mt-2">
            Bu koşullar gerek duyulduğunda güncellenebilir. Uygulamayı kullanmaya devam etmeniz,
            güncel koşulları kabul ettiğiniz anlamına gelir.
          </p>
        </section>
      </div>
    </section>
  );
}
