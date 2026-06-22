export default function Terms() {
  return (
    <section className="mx-auto max-w-3xl rounded-[32px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-8">
      <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-500">
        Terms Of Service
      </div>

      <h1 className="mt-4 font-['Fraunces',serif] text-4xl text-slate-950">Kullanim Kosullari</h1>
      <p className="mt-4 text-sm leading-6 text-slate-600">
        Bu kosullar, Gider Takip uygulamasini kullanirken uymaniz gereken temel kurallari aciklar.
      </p>

      <div className="mt-8 space-y-6 text-sm leading-6 text-slate-700">
        <section>
          <h2 className="text-base font-semibold text-slate-950">Hizmetin kapsami</h2>
          <p className="mt-2">
            Gider Takip, kullanicilarin abonelik ve duzenli odeme kalemlerini takip etmesine yardim
            eden bir uygulamadir. Sunulan ozellikler zaman icinde degisebilir, gelistirilebilir
            veya sinirlandirilabilir.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-950">Kullanici sorumlulugu</h2>
          <p className="mt-2">
            Hesap bilgilerinizin guvenliginden siz sorumlusunuz. Uygulamayi hukuka aykiri, zarar
            verici veya baska kullanicilarin deneyimini bozacak sekilde kullanmamayi kabul
            edersiniz.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-950">Ucuncu taraf hizmetler</h2>
          <p className="mt-2">
            Uygulama; Supabase, Google ve Microsoft gibi ucuncu taraf servislerle entegre olabilir.
            Bu servislerin kullanimina iliskin ek kosullar kendi saglayicilari tarafindan
            belirlenir.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-950">Sorumlulugun sinirlandirilmasi</h2>
          <p className="mt-2">
            Hizmet oldugu gibi sunulur. Teknik kesintiler, ucuncu taraf servis sorunlari veya
            gecikmeler nedeniyle dogabilecek zararlarda makul yasal sinirlar dahilinde sorumluluk
            sinirli olabilir.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-950">Guncellemeler</h2>
          <p className="mt-2">
            Bu kosullar gerek duyuldugunda guncellenebilir. Uygulamayi kullanmaya devam etmeniz,
            guncel kosullari kabul ettiginiz anlamina gelir.
          </p>
        </section>
      </div>
    </section>
  );
}
