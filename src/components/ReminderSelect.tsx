import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, LoaderCircle } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

interface ReminderSelectProps {
  value: number;
  disabled?: boolean;
  isSaving?: boolean;
  variant?: "light" | "dark";
  onChange: (value: number) => void | Promise<void>;
}

const reminderOptions = [0, 1, 3, 7, 14] as const;

function getReminderOptionLabel(option: number, t: (key: string) => string) {
  if (option === 0) {
    return t("reminder.options.off");
  }

  return t(
    option === 1
      ? "reminder.options.one"
      : option === 3
        ? "reminder.options.three"
        : option === 7
          ? "reminder.options.seven"
          : "reminder.options.fourteen"
  );
}

export default function ReminderSelect({
  value,
  disabled = false,
  isSaving = false,
  variant = "light",
  onChange,
}: ReminderSelectProps) {
  const { t } = useI18n();
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

  const isDark = variant === "dark";
  const buttonClassName = isDark
    ? "border border-white/10 bg-white/10 text-white hover:bg-white/15"
    : "border border-emerald-100 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/70";
  const panelClassName = isDark
    ? "border border-white/10 bg-slate-950/95 text-white shadow-[0_24px_60px_rgba(2,6,23,0.45)]"
    : "border border-emerald-100 bg-white text-slate-800 shadow-[0_20px_50px_rgba(15,23,42,0.12)]";
  const mutedClassName = isDark ? "text-slate-300" : "text-slate-500";
  const selectedClassName = isDark ? "bg-emerald-400/15 text-emerald-100" : "bg-emerald-50 text-emerald-800";
  const optionHoverClassName = isDark ? "hover:bg-white/10" : "hover:bg-slate-50";

  async function handleSelect(option: number) {
    setIsOpen(false);
    await onChange(option);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={`inline-flex min-w-[170px] items-center justify-between gap-3 rounded-[18px] px-4 py-3 text-left text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${buttonClassName}`}
      >
        <div className="flex min-w-0 flex-col">
          <span className={`text-[11px] uppercase tracking-[0.18em] ${mutedClassName}`}>
            {t("reminder.cardLabel")}
          </span>
          <span className="truncate">{getReminderOptionLabel(value, t)}</span>
        </div>
        <span className="flex items-center gap-2">
          {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          <ChevronDown className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`} />
        </span>
      </button>

      {isOpen ? (
        <div
          className={`absolute right-0 z-30 mt-3 min-w-full overflow-hidden rounded-[22px] p-2 backdrop-blur ${panelClassName}`}
        >
          <div className="space-y-1">
            {reminderOptions.map((option) => {
              const isSelected = option === value;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => void handleSelect(option)}
                  className={`flex w-full items-center justify-between rounded-[16px] px-4 py-3 text-left text-sm transition ${isSelected ? selectedClassName : optionHoverClassName}`}
                >
                  <span>{getReminderOptionLabel(option, t)}</span>
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
