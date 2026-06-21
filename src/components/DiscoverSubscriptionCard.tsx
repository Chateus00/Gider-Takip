import { ExternalLink, Search } from "lucide-react";
import type { DiscoverSubscriptionItem } from "../../shared/subscriptions";
import { formatCurrency, formatDate } from "@/utils/formatters";

interface DiscoverSubscriptionCardProps {
  item: DiscoverSubscriptionItem;
}

export default function DiscoverSubscriptionCard({ item }: DiscoverSubscriptionCardProps) {
  return (
    <article className="grid gap-4 rounded-[28px] border border-slate-200/70 bg-white/80 p-4 shadow-[0_20px_45px_rgba(15,23,42,0.08)] md:grid-cols-[88px_1fr_auto]">
      <div className="flex items-center justify-center rounded-[24px] bg-slate-100 p-2">
        <img src={item.logoUrl} alt={item.name} className="h-20 w-20 rounded-[20px] object-cover" />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-950 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white">
            {item.category}
          </span>
          <span className="rounded-full bg-teal-50 px-3 py-1 text-[11px] font-medium text-teal-700">
            {item.sourceLabel}
          </span>
        </div>
        <div>
          <h3 className="font-['Fraunces',serif] text-2xl text-slate-950">{item.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{item.description}</p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
            <Search className="h-4 w-4" />
            {item.billingCycle === "monthly" ? "Aylik" : "Yillik"}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
            {formatDate(item.updatedAt)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-5 md:flex-col md:items-end md:justify-center">
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Guncel fiyat</p>
          <p className="mt-1 text-2xl font-semibold text-slate-950">
            {formatCurrency(item.currentPrice, item.currency)}
          </p>
        </div>
        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:border-slate-900 hover:text-slate-950"
        >
          Kaynagi ac
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}
