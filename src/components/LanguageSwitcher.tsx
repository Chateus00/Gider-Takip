import { Languages } from "lucide-react";
import { languageMeta, type Language } from "@/i18n/translations";
import { useI18n } from "@/contexts/I18nContext";

interface LanguageSwitcherProps {
  compact?: boolean;
}

export default function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useI18n();

  return (
    <label
      className={`inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-2 text-sm text-slate-700 ${
        compact ? "" : "shadow-sm"
      }`}
    >
      <Languages className="h-4 w-4 text-emerald-700" />
      <span className="text-slate-500">{t("common.language")}</span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
        className="bg-transparent font-medium outline-none"
      >
        {Object.entries(languageMeta).map(([code, meta]) => (
          <option key={code} value={code}>
            {meta.label}
          </option>
        ))}
      </select>
    </label>
  );
}
