import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useTranslation, SupportedLanguage } from '../../context/LanguageContext';

interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bho', label: 'Bhojpuri', nativeLabel: 'भोजपुरी', flag: '🇮🇳' }
];

export const LanguageSwitcher: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1.5 rounded-full transition-all duration-300 font-sans ${
          compact
            ? 'px-2.5 py-1 text-xs bg-white/10 hover:bg-white/20 text-current border border-white/20'
            : 'px-3 py-1.5 text-xs font-semibold bg-cream hover:bg-cream-light text-brand-black border border-brand-brown/20 shadow-sm'
        }`}
        aria-label="Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-brand-maroon flex-shrink-0" />
        <span className="font-semibold">{currentLang.nativeLabel}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-lg bg-white shadow-xl border border-brand-brown/15 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-1 border-b border-brand-brown/10 text-[10px] font-bold sub-nav-label text-brand-maroon">
            SELECT LANGUAGE
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                language === lang.code
                  ? 'bg-brand-maroon/10 text-brand-maroon font-bold'
                  : 'text-brand-black hover:bg-cream'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm">{lang.flag}</span>
                <span>{lang.nativeLabel}</span>
                <span className="text-[10px] text-brand-brown/60">({lang.label})</span>
              </div>
              {language === lang.code && <Check className="w-3.5 h-3.5 text-brand-maroon" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
