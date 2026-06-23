import { useState, type FormEvent } from "react";
import { LoaderCircle, LogIn, UserPlus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type AuthMode = "signin" | "signup";

export default function AuthPanel() {
  const { signIn, signInWithGoogle, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
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

  async function handleGoogleAuth() {
    setError("");
    setMessage("");
    setIsGoogleSubmitting(true);

    try {
      await signInWithGoogle(redirectTo);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Google ile giriş başlatılamadı.");
      setIsGoogleSubmitting(false);
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[32px] border border-emerald-200/50 bg-[linear-gradient(180deg,#052e16_0%,#064e3b_100%)] p-6 text-white shadow-[0_26px_70px_rgba(6,78,59,0.35)]">
        <div className="inline-flex rounded-full border border-emerald-200/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-emerald-200">
          Gider Takip
        </div>
        <h1 className="mt-4 font-['Fraunces',serif] text-4xl leading-tight">
          Aboneliklerini tek yerde gör, gereksiz ödemeleri kaçırma.
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-300">
          Giriş yaptıktan sonra hesabını bağlayıp düzenli ödemelerini tek ekranda takip edebilirsin.
        </p>

        <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="space-y-3 text-sm leading-6 text-emerald-50">
            <p>Tek ekranda aylık toplamını gör.</p>
            <p>Yaklaşan ödemeleri önceden fark et.</p>
            <p>Mail kutundan aboneliklerini hızlıca bul.</p>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-emerald-100 bg-white/90 p-6 shadow-[0_18px_50px_rgba(6,78,59,0.10)]">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`rounded-full px-4 py-2 text-sm transition ${
              mode === "signin"
                ? "bg-emerald-700 text-white"
                : "border border-emerald-100 bg-white text-slate-600"
            }`}
          >
            Giriş yap
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`rounded-full px-4 py-2 text-sm transition ${
              mode === "signup"
                ? "bg-emerald-700 text-white"
                : "border border-emerald-100 bg-white text-slate-600"
            }`}
          >
            Kayıt ol
          </button>
        </div>

        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={isGoogleSubmitting || isSubmitting}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isGoogleSubmitting ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Google açılıyor
            </>
          ) : (
            <>
              <span className="text-base">G</span>
              {mode === "signup" ? "Google ile kayıt ol" : "Google ile giriş yap"}
            </>
          )}
        </button>

        <div className="mt-4 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          veya e-posta ile
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">E-posta adresi</span>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 outline-none transition focus:border-emerald-600"
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
              className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 outline-none transition focus:border-emerald-600"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-300"
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
