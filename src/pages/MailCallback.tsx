import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
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

    if (session) {
      navigate(`/abonelik/yeni?mail_connected=1&provider=${provider}`, {
        replace: true,
      });
      return;
    }

    let isCancelled = false;

    const waitForSession = async () => {
      for (let attempt = 0; attempt < 10; attempt += 1) {
        const { data } = await supabase.auth.getSession();

        if (isCancelled) {
          return;
        }

        if (data.session) {
          navigate(`/abonelik/yeni?mail_connected=1&provider=${provider}`, {
            replace: true,
          });
          return;
        }

        await new Promise((resolve) => window.setTimeout(resolve, 300));
      }

      if (!isCancelled) {
        navigate("/auth", { replace: true });
      }
    };

    void waitForSession();

    return () => {
      isCancelled = true;
    };
  }, [isLoading, navigate, session]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center gap-3 text-slate-500">
      <LoaderCircle className="h-5 w-5 animate-spin" />
      Mail hesabi baglaniyor...
    </div>
  );
}
