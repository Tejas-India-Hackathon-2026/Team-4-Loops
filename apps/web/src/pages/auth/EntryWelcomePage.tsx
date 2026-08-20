import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Store, Check, ArrowRight, Globe } from 'lucide-react';
import { useTranslation, SupportedLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { getHomeRouteForRole } from '../../utils/navigation';

export type UserTypeRole = 'TOURIST' | 'VENDOR';

export const EntryWelcomePage: React.FC<{ onCompleteEntry?: () => void }> = ({ onCompleteEntry }) => {
  const { setLanguage, t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserTypeRole>('TOURIST');
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('en');

  // When role changes, ensure selected language is valid for that role
  const handleRoleSelect = (role: UserTypeRole) => {
    setSelectedRole(role);
    if (role === 'TOURIST' && selectedLang === 'bho') {
      setSelectedLang('hi'); // Fallback from Bhojpuri if Tourist selected
    }
  };

  const handleEnter = () => {
    // 1. Set language in i18n system
    setLanguage(selectedLang);

    // 2. Mark entry completion in localStorage
    localStorage.setItem('setu_entry_completed', 'true');
    localStorage.setItem('setu_preferred_role', selectedRole);

    if (onCompleteEntry) {
      onCompleteEntry();
    }

    // 3. Perform Role-aware Navigation
    if (user) {
      navigate(getHomeRouteForRole(user));
    } else {
      if (selectedRole === 'VENDOR') {
        navigate('/vendor/local-dashboard');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen bg-brand-black text-cream flex flex-col justify-between items-center p-6 md:p-12 relative overflow-hidden">
      {/* Subtle Background Art Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/30 via-brand-black to-brand-black pointer-events-none" />

      {/* Header / Brand */}
      <div className="relative z-10 text-center space-y-3 pt-6 max-w-2xl mx-auto">
        <span className="sub-nav-label text-brand-gold tracking-[0.3em] block text-xs">
          WELCOME TO BIHAR TOURISM & LOCAL MARKETPLACE
        </span>
        <h1 className="font-serif text-5xl md:text-7xl text-cream font-light tracking-widest">
          SETU
        </h1>
        <p className="text-sm md:text-base font-serif text-cream/80 max-w-lg mx-auto leading-relaxed">
          Please select your profile and language to personalize your Bihar experience.
        </p>
      </div>

      {/* Main Choice Container */}
      <div className="relative z-10 w-full max-w-2xl bg-white/5 border border-brand-gold/20 backdrop-blur-md rounded-2xl p-6 sm:p-10 my-8 shadow-2xl space-y-8">

        {/* STEP 1: ROLE SELECTION */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold sub-nav-label text-brand-gold">
            <span className="w-5 h-5 rounded-full bg-brand-gold text-brand-black flex items-center justify-center text-[10px]">1</span>
            <span>WHO ARE YOU? / आप कौन हैं?</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tourist Option */}
            <button
              type="button"
              onClick={() => handleRoleSelect('TOURIST')}
              className={`p-5 rounded-xl border-2 transition-all flex flex-col items-center text-center space-y-3 ${
                selectedRole === 'TOURIST'
                  ? 'bg-brand-gold text-brand-black border-brand-gold shadow-lg font-bold scale-[1.02]'
                  : 'bg-white/5 text-cream border-white/10 hover:border-brand-gold/50 hover:bg-white/10'
              }`}
            >
              <div className={`p-3 rounded-full ${selectedRole === 'TOURIST' ? 'bg-brand-black text-brand-gold' : 'bg-white/10 text-brand-gold'}`}>
                <Compass className="w-8 h-8" />
              </div>
              <div>
                <span className="block text-lg font-serif font-bold">Tourist / Traveler</span>
                <span className="text-xs opacity-90 font-sans block mt-0.5">सैलानी / यात्री</span>
                <span className="text-[11px] opacity-75 block mt-2 font-serif">Explore circuits, festivals & heritage</span>
              </div>
            </button>

            {/* Vendor Option */}
            <button
              type="button"
              onClick={() => handleRoleSelect('VENDOR')}
              className={`p-5 rounded-xl border-2 transition-all flex flex-col items-center text-center space-y-3 ${
                selectedRole === 'VENDOR'
                  ? 'bg-brand-gold text-brand-black border-brand-gold shadow-lg font-bold scale-[1.02]'
                  : 'bg-white/5 text-cream border-white/10 hover:border-brand-gold/50 hover:bg-white/10'
              }`}
            >
              <div className={`p-3 rounded-full ${selectedRole === 'VENDOR' ? 'bg-brand-black text-brand-gold' : 'bg-white/10 text-brand-gold'}`}>
                <Store className="w-8 h-8" />
              </div>
              <div>
                <span className="block text-lg font-serif font-bold">Local Vendor / Artisan</span>
                <span className="text-xs opacity-90 font-sans block mt-0.5">स्थानीय विक्रेता / कारीगर</span>
                <span className="text-[11px] opacity-75 block mt-2 font-serif">List handicrafts, products & stays</span>
              </div>
            </button>
          </div>
        </div>

        {/* STEP 2: LANGUAGE SELECTION */}
        <div className="space-y-4 border-t border-white/10 pt-6">
          <div className="flex items-center space-x-2 text-xs font-bold sub-nav-label text-brand-gold">
            <span className="w-5 h-5 rounded-full bg-brand-gold text-brand-black flex items-center justify-center text-[10px]">2</span>
            <span>CHOOSE LANGUAGE / भाषा चुनें</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* English */}
            <button
              type="button"
              onClick={() => setSelectedLang('en')}
              className={`py-3 px-4 rounded-lg border-2 text-sm font-sans flex items-center justify-between transition-all ${
                selectedLang === 'en'
                  ? 'bg-white text-brand-black border-white font-bold shadow'
                  : 'bg-white/5 text-cream border-white/10 hover:border-white/40'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>🇬🇧</span>
                <span>English</span>
              </div>
              {selectedLang === 'en' && <Check className="w-4 h-4 text-brand-maroon" />}
            </button>

            {/* Hindi */}
            <button
              type="button"
              onClick={() => setSelectedLang('hi')}
              className={`py-3 px-4 rounded-lg border-2 text-sm font-sans flex items-center justify-between transition-all ${
                selectedLang === 'hi'
                  ? 'bg-white text-brand-black border-white font-bold shadow'
                  : 'bg-white/5 text-cream border-white/10 hover:border-white/40'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>🇮🇳</span>
                <span>हिन्दी (Hindi)</span>
              </div>
              {selectedLang === 'hi' && <Check className="w-4 h-4 text-brand-maroon" />}
            </button>

            {/* Bhojpuri - Only visible for Vendor selection per requirements */}
            {selectedRole === 'VENDOR' ? (
              <button
                type="button"
                onClick={() => setSelectedLang('bho')}
                className={`py-3 px-4 rounded-lg border-2 text-sm font-sans flex items-center justify-between transition-all ${
                  selectedLang === 'bho'
                    ? 'bg-white text-brand-black border-white font-bold shadow'
                    : 'bg-white/5 text-cream border-white/10 hover:border-white/40'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>🇮🇳</span>
                  <span>भोजपुरी (Bhojpuri)</span>
                </div>
                {selectedLang === 'bho' && <Check className="w-4 h-4 text-brand-maroon" />}
              </button>
            ) : (
              <div className="py-3 px-4 rounded-lg border border-white/5 bg-black/20 text-cream/40 text-xs flex items-center justify-center text-center">
                <span>Bhojpuri available for Vendors</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleEnter}
          className="w-full py-4 bg-brand-gold hover:bg-amber-400 text-brand-black font-bold sub-nav-label text-sm tracking-widest rounded-xl transition-all shadow-xl flex items-center justify-center space-x-3 group"
        >
          <span>ENTER SETU BIHAR TOURISM</span>
          <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Footer Disclaimer */}
      <div className="relative z-10 text-center text-xs font-sans text-cream/50">
        <p>You can change your language anytime from the top navigation bar.</p>
      </div>
    </div>
  );
};
