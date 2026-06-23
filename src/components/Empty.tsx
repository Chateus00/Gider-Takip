import { useI18n } from "@/contexts/I18nContext";
import { cn } from "@/lib/utils";

// Empty component
export default function Empty() {
  const { t } = useI18n();

  return (
    <div className={cn("flex h-full items-center justify-center")}>{t("common.loading")}</div>
  );
}
