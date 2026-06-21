import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import SubscriptionForm from "@/components/SubscriptionForm";

export default function NewSubscription() {
  return (
    <div className="space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition hover:border-slate-950 hover:text-slate-950"
      >
        <ArrowLeft className="h-4 w-4" />
        Panele don
      </Link>
      <SubscriptionForm />
    </div>
  );
}
