import { BrowserRouter as Router, NavLink, Route, Routes } from "react-router-dom";
import { BellDot, LayoutDashboard, Plus } from "lucide-react";
import Home from "@/pages/Home";
import NewSubscription from "@/pages/NewSubscription";
import SubscriptionDetail from "@/pages/SubscriptionDetail";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.16),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#ecfeff_100%)]">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 md:px-6 lg:px-8">
          <header className="mb-8 flex flex-col gap-4 rounded-[32px] border border-white/60 bg-white/70 px-5 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Abonelik takip uygulamasi</p>
              <h1 className="mt-2 font-['Fraunces',serif] text-3xl text-slate-950">Gider Takip</h1>
            </div>

            <nav className="flex flex-wrap items-center gap-2">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                    isActive ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
                    isActive ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`
                }
              >
                <Plus className="h-4 w-4" />
                Mail bagla
              </NavLink>
            </nav>

            <div className="inline-flex items-center gap-3 rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
              <BellDot className="h-4 w-4" />
              2 odeme yaklasiyor
            </div>
          </header>

          <main className="flex-1 pb-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/abonelik/yeni" element={<NewSubscription />} />
              <Route path="/abonelik/:id" element={<SubscriptionDetail />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
