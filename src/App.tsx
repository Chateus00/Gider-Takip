import { useState } from "react";
import { BrowserRouter as Router, NavLink, Navigate, Route, Routes } from "react-router-dom";
import { LayoutDashboard, LockKeyhole, LogOut, Plus, UserCircle2 } from "lucide-react";
import Auth from "@/pages/Auth";
import About from "@/pages/About";
import Home from "@/pages/Home";
import MailCallback from "@/pages/MailCallback";
import NewSubscription from "@/pages/NewSubscription";
import Privacy from "@/pages/Privacy";
import SubscriptionDetail from "@/pages/SubscriptionDetail";
import Terms from "@/pages/Terms";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

function AppShell() {
  const { isLoading, session, signOut } = useAuth();
  const [signOutError, setSignOutError] = useState("");
  const userEmail = session?.user.email ?? "Misafir kullanıcı";

  async function handleSignOut() {
    try {
      setSignOutError("");
      await signOut();
    } catch (error) {
      setSignOutError(error instanceof Error ? error.message : "Çıkış yapılamadı.");
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(74,222,128,0.18),_transparent_30%),linear-gradient(180deg,_#f7fee7_0%,_#ecfdf5_100%)]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 md:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 rounded-[32px] border border-emerald-100 bg-white/80 px-5 py-4 shadow-[0_20px_60px_rgba(6,78,59,0.10)] backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Abonelik takip uygulaması</p>
            <h1 className="mt-2 font-['Fraunces',serif] text-3xl text-slate-950">Gider Takip</h1>
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            {session ? (
              <>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                      isActive ? "bg-emerald-700 text-white" : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                    }`
                  }
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Kontrol paneli
                </NavLink>
                <NavLink
                  to="/abonelik/yeni"
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                      isActive ? "bg-emerald-700 text-white" : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                    }`
                  }
                >
                  <Plus className="h-4 w-4" />
                  Mail bağla
                </NavLink>
              </>
            ) : (
              <div className="inline-flex rounded-full border border-emerald-200 bg-white p-1 shadow-sm">
                <NavLink
                  to="/auth?mode=signin"
                  className={({ isActive }) =>
                    `rounded-full px-5 py-2 text-sm transition ${
                      isActive ? "bg-emerald-700 text-white" : "text-slate-600 hover:text-emerald-800"
                    }`
                  }
                >
                  Giriş yap
                </NavLink>
                <NavLink
                  to="/auth?mode=signup"
                  className={({ isActive }) =>
                    `rounded-full px-5 py-2 text-sm transition ${
                      isActive ? "bg-emerald-700 text-white" : "text-slate-600 hover:text-emerald-800"
                    }`
                  }
                >
                  Kayıt ol
                </NavLink>
              </div>
            )}
          </nav>

          <div className="flex flex-col items-start gap-2 md:items-end">
            {isLoading ? (
              <div className="inline-flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
                <LockKeyhole className="h-4 w-4" />
                  Oturum kontrol ediliyor
              </div>
            ) : session ? (
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                  <UserCircle2 className="h-4 w-4" />
                  {userEmail}
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm text-slate-600 transition hover:border-emerald-700 hover:text-emerald-800"
                >
                  <LogOut className="h-4 w-4" />
                  Çıkış yap
                </button>
              </div>
            ) : null}
            {signOutError ? <p className="text-sm text-rose-600">{signOutError}</p> : null}
          </div>
        </header>

        <main className="flex-1 pb-10">
          <Routes>
            <Route path="/hakkinda" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/mail/callback" element={<MailCallback />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/abonelik/yeni"
              element={
                <ProtectedRoute>
                  <NewSubscription />
                </ProtectedRoute>
              }
            />
            <Route
              path="/abonelik/:id"
              element={
                <ProtectedRoute>
                  <SubscriptionDetail />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to={session ? "/" : "/auth"} replace />} />
          </Routes>
        </main>

        <footer className="border-t border-emerald-100 px-2 py-6 text-sm text-slate-500">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p>Gider Takip, kullanıcı hesapları ve mail bağlama özelliği için gerekli verileri işler.</p>
            <div className="flex flex-wrap items-center gap-4">
              <NavLink to="/hakkinda" className="transition hover:text-slate-950">
                Uygulama hakkında
              </NavLink>
              <NavLink to="/privacy" className="transition hover:text-slate-950">
                Gizlilik politikası
              </NavLink>
              <NavLink to="/terms" className="transition hover:text-slate-950">
                Kullanım koşulları
              </NavLink>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}
