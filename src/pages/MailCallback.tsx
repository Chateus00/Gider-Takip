import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { getPendingMailProvider } from "@/utils/mailConnection";

export default function MailCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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

    const errorCode = searchParams.get("error_code");
    const errorDescription = searchParams.get("error_description");

    if (errorCode) {
      const params = new URLSearchParams({
        provider,
        mail_error: errorCode,
      });

      if (errorDescription) {
        params.set("mail_error_description", errorDescription);
      }

      navigate(`/abonelik/yeni?${params.toString()}`, { replace: true });
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
  }, [isLoading, navigate, searchParams, session]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center gap-3 text-slate-500">
      <LoaderCircle className="h-5 w-5 animate-spin" />
      Mail hesabı bağlanıyor...
    </div>
  );
}
