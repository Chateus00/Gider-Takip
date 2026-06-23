/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { defaultLanguage, getStoredLanguage, languageMeta, languageStorageKey, translate, type Language } from "@/i18n/translations";

interface I18nContextValue {
  language: Language;
  locale: string;
  direction: "ltr" | "rtl";
  setLanguage: (language: Language) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
  tList: (key: string, values?: Record<string, string | number>) => string[];
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => getStoredLanguage());

  useEffect(() => {
    window.localStorage.setItem(languageStorageKey, language);
    document.documentElement.lang = language;
    document.documentElement.dir = languageMeta[language].dir;
  }, [language]);

  const value = useMemo<I18nContextValue>(() => {
    return {
      language,
      locale: languageMeta[language].locale,
      direction: languageMeta[language].dir,
      setLanguage,
      t(key, values) {
        const translated = translate(key, values, language);
        return Array.isArray(translated) ? translated.join(", ") : translated;
      },
      tList(key, values) {
        const translated = translate(key, values, language);
        return Array.isArray(translated) ? translated : [translated];
      },
    };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider.");
  }

  return context;
}

export function getLocale(language = getStoredLanguage()) {
  return languageMeta[language]?.locale ?? languageMeta[defaultLanguage].locale;
}
