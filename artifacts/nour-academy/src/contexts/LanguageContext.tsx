import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, LANGUAGES } from "@/i18n/translations";
import type { Lang, Translations } from "@/i18n/translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "ar",
  setLang: () => {},
  t: translations.ar,
  dir: "rtl",
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem("na_lang") as Lang | null;
      if (saved && LANGUAGES.some((l) => l.code === saved)) return saved;
    } catch {}
    return "ar";
  });

  const dir = translations[lang].dir;

  function setLang(newLang: Lang) {
    setLangState(newLang);
    try {
      localStorage.setItem("na_lang", newLang);
    } catch {}
  }

  useEffect(() => {
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
  }, [lang, dir]);

  return (
    <LanguageContext.Provider
      value={{ lang, setLang, t: translations[lang] as Translations, dir }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
