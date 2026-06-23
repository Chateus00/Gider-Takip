export default function Privacy() {
  return (
    <section className="mx-auto max-w-3xl rounded-[32px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-8">
      <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-500">
        Privacy Policy
      </div>

      <h1 className="mt-4 font-['Fraunces',serif] text-4xl text-slate-950">Gizlilik Politikası</h1>
      <p className="mt-4 text-sm leading-6 text-slate-600">
        Bu politika, Gider Takip uygulamasının hangi verileri neden işlediğini ve kullanıcıların
        bu veriler üzerindeki haklarını açıklar.
      </p>

      <div className="mt-8 space-y-6 text-sm leading-6 text-slate-700">
        <section>
          <h2 className="text-base font-semibold text-slate-950">Toplanan veriler</h2>
          <p className="mt-2">
            Hesap oluştururken e-posta adresinizi ve kimlik doğrulama için gerekli oturum
            bilgilerinizi işleriz. Mail bağlama özelliğini kullanırsanız, seçilen sağlayıcıdan
            gelen erişim belirteci ve abonelik tespiti için gereken sınırlı e-posta içeriklerini
            geçici olarak kullanırız.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-950">Verilerin kullanım amacı</h2>
          <p className="mt-2">
            Verileriniz; hesabınıza giriş yapmanızı sağlamak, abonelikleri tespit etmek, uygulama
            içindeki kayıtları size özel göstermek ve hizmetin güvenliğini korumak için kullanılır.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-950">Google ve Microsoft entegrasyonlari</h2>
          <p className="mt-2">
            Gmail ve Outlook bağlantıları yalnızca sizin açık onayınızla başlatılır. Mail
            içerikleri reklam amaçlı kullanılmaz, satılmaz ve sadece abonelik tespiti amacıyla
            işlenir.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-950">Saklama ve güvenlik</h2>
          <p className="mt-2">
            Veriler, hizmetin çalışması için gerekli olduğu süre boyunca saklanır. Hesap ve oturum
            işlemleri Supabase altyapısı üzerinden korunur. Yetkisiz erişimi azaltmak için teknik
            ve operasyonel önlemler uygulanır.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-950">İletişim</h2>
          <p className="mt-2">
            Gizlilikle ilgili talepleriniz için uygulama sahibi ile `gidertakip.tr` üzerinden
            iletişime geçebilirsiniz. Bu metin, hizmet geliştikçe güncellenebilir.
          </p>
        </section>
      </div>
    </section>
  );
}
