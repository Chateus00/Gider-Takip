import { BadgeCheck, Landmark, Mail, ScanSearch } from "lucide-react";
import type { IntakeMethod } from "../../shared/subscriptions";

const iconMap = {
  email: Mail,
  ocr: ScanSearch,
  banking: Landmark,
};

interface TrackingMethodsProps {
  methods: IntakeMethod[];
}

export default function TrackingMethods({ methods }: TrackingMethodsProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Takip yontemleri</p>
          <h2 className="mt-2 font-['Fraunces',serif] text-3xl text-slate-950">
            Gorseldeki uc veri toplama yolu artik ana urun akisi
          </h2>
        </div>
        <p className="max-w-md text-right text-sm text-slate-500">
          Her abonelik e-posta, OCR veya banka hareketi uzerinden yakalanip panele otomatik dusurulebilir.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {methods.map((method) => {
          const Icon = iconMap[method.id] ?? BadgeCheck;

          return (
            <article
              key={method.id}
              className="rounded-[28px] border border-slate-200/70 bg-white/80 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
            >
              <div className="inline-flex rounded-2xl bg-slate-950 p-3 text-white">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                <BadgeCheck className="h-3.5 w-3.5" />
                {method.trustLabel}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-950">{method.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{method.description}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-400">{method.source}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
