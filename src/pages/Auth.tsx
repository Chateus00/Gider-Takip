import { Navigate, useLocation } from "react-router-dom";
import AuthPanel from "@/components/AuthPanel";
import { useAuth } from "@/contexts/AuthContext";

export default function Auth() {
  const { session, isLoading } = useAuth();
  const location = useLocation();
  const from =
    typeof location.state?.from === "string" && location.state.from.startsWith("/")
      ? location.state.from
      : "/";

  if (!isLoading && session) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <AuthPanel />
    </div>
  );
}
