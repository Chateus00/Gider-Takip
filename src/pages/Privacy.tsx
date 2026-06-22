export default function Privacy() {
  return (
    <section className="mx-auto max-w-3xl rounded-[32px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-8">
      <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-500">
        Privacy Policy
      </div>

      <h1 className="mt-4 font-['Fraunces',serif] text-4xl text-slate-950">Gizlilik Politikasi</h1>
      <p className="mt-4 text-sm leading-6 text-slate-600">
        Bu politika, Gider Takip uygulamasinin hangi verileri neden isledigini ve kullanicilarin
        bu veriler uzerindeki haklarini aciklar.
      </p>

      <div className="mt-8 space-y-6 text-sm leading-6 text-slate-700">
        <section>
          <h2 className="text-base font-semibold text-slate-950">Toplanan veriler</h2>
          <p className="mt-2">
            Hesap olustururken e-posta adresinizi ve kimlik dogrulama icin gerekli oturum
            bilgilerinizi isleriz. Mail baglama ozelligini kullanirsaniz, secilen saglayicidan
            gelen erisim belirteci ve abonelik tespiti icin gereken sinirli e-posta iceriklerini
            gecici olarak kullaniriz.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-950">Verilerin kullanim amaci</h2>
          <p className="mt-2">
            Verileriniz; hesabiniza giris yapmanizi saglamak, abonelikleri tespit etmek, uygulama
            icindeki kayitlari size ozel gostermek ve hizmetin guvenligini korumak icin kullanilir.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-950">Google ve Microsoft entegrasyonlari</h2>
          <p className="mt-2">
            Gmail ve Outlook baglantilari yalnizca sizin acik onayinizla baslatilir. Mail
            icerikleri reklam amacli kullanilmaz, satilmaz ve sadece abonelik tespiti amaciyla
            islenir.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-950">Saklama ve guvenlik</h2>
          <p className="mt-2">
            Veriler, hizmetin calismasi icin gerekli oldugu sure boyunca saklanir. Hesap ve oturum
            islemleri Supabase altyapisi uzerinden korunur. Yetkisiz erisimi azaltmak icin teknik
            ve operasyonel onlemler uygulanir.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-950">Iletisim</h2>
          <p className="mt-2">
            Gizlilikle ilgili talepleriniz icin uygulama sahibi ile `gidertakip.tr` uzerinden
            iletisime gecebilirsiniz. Bu metin, hizmet gelistikce guncellenebilir.
          </p>
        </section>
      </div>
    </section>
  );
}
