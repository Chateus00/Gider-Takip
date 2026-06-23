import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Languages } from "lucide-react";
import { languageMeta, type Language } from "@/i18n/translations";
import { useI18n } from "@/contexts/I18nContext";

interface LanguageSwitcherProps {
  compact?: boolean;
}

export default function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={`inline-flex items-center justify-between gap-3 rounded-[18px] border border-emerald-100 bg-white px-4 py-3 text-left text-sm text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50/70 ${
          compact ? "" : "shadow-sm"
        }`}
      >
        <span className="flex items-center gap-2">
          <Languages className="h-4 w-4 text-emerald-700" />
          <span className="flex min-w-0 flex-col">
            <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              {t("common.language")}
            </span>
            <span className="font-medium text-slate-800">{languageMeta[language].label}</span>
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-30 mt-3 min-w-full overflow-hidden rounded-[22px] border border-emerald-100 bg-white p-2 text-slate-800 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="space-y-1">
            {Object.entries(languageMeta).map(([code, meta]) => {
              const isSelected = code === language;

              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setLanguage(code as Language);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-[16px] px-4 py-3 text-left text-sm transition ${
                    isSelected ? "bg-emerald-50 text-emerald-800" : "hover:bg-slate-50"
                  }`}
                >
                  <span>{meta.label}</span>
                  {isSelected ? <Check className="h-4 w-4" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
