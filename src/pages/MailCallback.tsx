import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getPendingMailProvider } from "@/utils/mailConnection";

export default function MailCallback() {
  const navigate = useNavigate();
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const provider = getPendingMailProvider();

    if (!provider) {
      navigate("/abonelik/yeni", { replace: true });
      return;
    }

    if (!session) {
      navigate("/auth", { replace: true });
      return;
    }

    navigate(`/abonelik/yeni?mail_connected=1&provider=${provider}`, {
      replace: true,
    });
  }, [isLoading, navigate, session]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center gap-3 text-slate-500">
      <LoaderCircle className="h-5 w-5 animate-spin" />
      Mail hesabi baglaniyor...
    </div>
  );
}
