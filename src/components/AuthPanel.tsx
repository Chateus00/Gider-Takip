import { useState, type FormEvent } from "react";
import { LoaderCircle, LogIn, UserPlus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type AuthMode = "signin" | "signup";

export default function AuthPanel() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const redirectTo =
    typeof location.state?.from === "string" && location.state.from.startsWith("/")
      ? location.state.from
      : "/";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      if (mode === "signin") {
        await signIn(email, password);
        setMessage("Giriş başarılı. Uygulamaya yönlendiriliyorsun.");
        navigate(redirectTo, { replace: true });
      } else {
        const result = await signUp(email, password);
        setMessage(result);
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "İşlem tamamlanamadı.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[32px] border border-slate-200/70 bg-slate-950 p-6 text-white shadow-[0_26px_70px_rgba(15,23,42,0.35)]">
        <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-teal-200">
          Supabase Auth
        </div>
        <h1 className="mt-4 font-['Fraunces',serif] text-4xl leading-tight">
          Kayıt ol, giriş yap ve Aboneliklerim alanını kendi hesabınla kullan.
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-300">
          E-posta ve şifre ile kayıt oluşturuyoruz. Supabase tarafında e-posta doğrulama açıksa ilk kayıttan sonra gelen kutuna onay maili düşer.
        </p>

        <div className="mt-8 space-y-3">
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-medium text-white">Neler hazır?</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Kayıt ol, giriş yap, oturumu açık tut ve çıkış yap akışları Supabase ile bağlı.
            </p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-medium text-white">Bir sonraki adım</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Abonelik verilerini kullanıcı bazlı saklayıp herkesin sadece kendi verisini görmesini sağlamak.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`rounded-full px-4 py-2 text-sm transition ${
              mode === "signin"
                ? "bg-slate-950 text-white"
                : "border border-slate-200 bg-white text-slate-600"
            }`}
          >
            Giriş yap
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`rounded-full px-4 py-2 text-sm transition ${
              mode === "signup"
                ? "bg-slate-950 text-white"
                : "border border-slate-200 bg-white text-slate-600"
            }`}
          >
            Kayıt ol
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">E-posta adresi</span>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-950"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Şifre</span>
            <input
              required
              type="password"
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-950"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                İşleniyor
              </>
            ) : mode === "signin" ? (
              <>
                <LogIn className="h-4 w-4" />
                Giriş yap
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Kayıt ol
              </>
            )}
          </button>
        </form>

        {message ? <p className="mt-4 text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
      </div>
    </section>
  );
}
