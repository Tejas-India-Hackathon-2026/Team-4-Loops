import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { en } from '../locales/en';
import { hi } from '../locales/hi';
import { bho } from '../locales/bho';

export type SupportedLanguage = 'en' | 'hi' | 'bho';

const translations: Record<SupportedLanguage, any> = {
  en,
  hi,
  bho
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'setu_language';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (saved === 'en' || saved === 'hi' || saved === 'bho')) {
      return saved as SupportedLanguage;
    }
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Nested object lookup helper e.g. t('nav.circuits')
  const t = (keyPath: string, fallback?: string): string => {
    const keys = keyPath.split('.');
    let currentDict = translations[language] || translations.en;
    let fallbackDict = translations.en;

    let result: any = currentDict;
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        result = undefined;
        break;
      }
    }

    if (result && typeof result === 'string') {
      return result;
    }

    // Fallback to English dictionary if key missing in selected language
    let fbResult: any = fallbackDict;
    for (const k of keys) {
      if (fbResult && typeof fbResult === 'object' && k in fbResult) {
        fbResult = fbResult[k];
      } else {
        fbResult = undefined;
        break;
      }
    }

    if (fbResult && typeof fbResult === 'string') {
      return fbResult;
    }

    return fallback || keyPath;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
