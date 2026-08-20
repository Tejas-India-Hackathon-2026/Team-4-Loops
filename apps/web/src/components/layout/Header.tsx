import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, ChevronDown, User, Store, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import { getHomeRouteForRole } from '../../utils/navigation';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { MegaMenuExplore } from './MegaMenuExplore';
import { MegaMenuExperience } from './MegaMenuExperience';
import { MobileDrawer } from './MobileDrawer';

interface HeaderProps {
  onOpenAi: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAi }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<'explore' | 'experience' | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setActiveMenu(null);
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === '/';
  const homeRoute = getHomeRouteForRole(user);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled || activeMenu !== null || !isHome
            ? 'glass-header border-b border-brand-brown/10 text-brand-black shadow-sm'
            : 'bg-gradient-to-b from-black/60 via-black/20 to-transparent text-white'
        }`}
      >
        <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 h-20 flex items-center justify-between">
          {/* Logo (Far Left) */}
          <div className="flex-1 flex items-center justify-start">
            <Link
              to={homeRoute}
              className="font-serif text-3xl font-medium tracking-[0.2em] hover:opacity-90 transition-opacity text-brand-gold flex items-center space-x-2.5 group whitespace-nowrap"
            >
              {/* Elegant Golden Arch Bridge Emblem */}
              <svg
                className="w-7 h-7 text-brand-gold flex-shrink-0 transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_0_8px_rgba(198,155,69,0.4)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 18C3 11.5 7 6.5 12 6.5C17 6.5 21 11.5 21 18" />
                <path d="M2 18H22" />
                <path d="M7 18V12" />
                <path d="M12 18V9.5" />
                <path d="M17 18V12" />
              </svg>

              <span className="relative pb-0.5 border-b-2 border-brand-gold/60 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] font-serif">
                SETU
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links (Centered with Breathable Spacing) */}
          <nav className="hidden lg:flex flex-initial items-center justify-center space-x-8 lg:space-x-10 xl:space-x-14 2xl:space-x-18 sub-nav-label">
            {/* EXPLORE Mega-menu Button */}
            <div className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === 'explore' ? null : 'explore')}
                className="py-2 flex items-center space-x-1 hover:text-brand-gold transition-colors focus:outline-none whitespace-nowrap"
              >
                <span>{t('nav.explore', 'EXPLORE').toUpperCase()}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeMenu === 'explore' ? 'rotate-180 text-brand-gold' : ''}`} />
              </button>
            </div>

            <Link to="/maps" className="py-2 flex items-center hover:text-brand-gold transition-colors whitespace-nowrap">
              {t('nav.maps', 'MAPS').toUpperCase()}
            </Link>

            <Link to="/calendar" className="py-2 flex items-center hover:text-brand-gold transition-colors whitespace-nowrap">
              {t('nav.calendar', 'CALENDAR').toUpperCase()}
            </Link>

            {/* EXPERIENCE Mega-menu Button */}
            <div className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === 'experience' ? null : 'experience')}
                className="py-2 flex items-center space-x-1 hover:text-brand-gold transition-colors focus:outline-none whitespace-nowrap"
              >
                <span>{t('nav.experience', 'EXPERIENCE').toUpperCase()}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeMenu === 'experience' ? 'rotate-180 text-brand-gold' : ''}`} />
              </button>
            </div>
          </nav>

          {/* Actions Right (Far Right with Breathable Spacing) */}
          <div className="flex-1 flex items-center justify-end space-x-3 sm:space-x-4 lg:space-x-5">
            {/* Language Switcher Dropdown */}
            <LanguageSwitcher compact={isHome && !isScrolled && activeMenu === null} />

            {/* AI Companion Button - Tourist & Guests Only */}
            {(!user || user.role === 'TOURIST') && (
              <button
                onClick={onOpenAi}
                className="h-9 px-3.5 rounded-full border border-brand-gold/70 ring-1 ring-brand-gold/20 bg-gradient-to-r from-brand-gold/25 via-brand-gold/15 to-brand-gold/5 hover:from-brand-gold/40 hover:to-brand-gold/20 text-brand-gold transition-all duration-300 text-xs sub-nav-label flex items-center space-x-2 shadow-[0_0_15px_rgba(198,155,69,0.2)] hover:shadow-[0_0_22px_rgba(198,155,69,0.4)] hover:border-brand-gold group whitespace-nowrap"
                title="Open SETU AI Travel Companion"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-gold transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 drop-shadow-[0_0_8px_rgba(198,155,69,0.8)]" />
                <span className="hidden sm:inline tracking-wider font-semibold">{t('nav.aiGuide', 'AI CONCIERGE').toUpperCase()}</span>
              </button>
            )}

            {/* Role quick links */}
            {user?.role === 'VENDOR' && (
              <Link to={homeRoute} className="h-9 px-3 hidden sm:flex items-center space-x-1 text-xs sub-nav-label text-amber-700 hover:text-amber-900 bg-amber-50 rounded border border-amber-200 whitespace-nowrap">
                <Store className="w-3.5 h-3.5" />
                <span>{t('nav.vendorDashboard', 'VENDOR').toUpperCase()}</span>
              </Link>
            )}

            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="h-9 px-3 hidden sm:flex items-center space-x-1 text-xs sub-nav-label text-emerald-700 hover:text-emerald-900 bg-emerald-50 rounded border border-emerald-200 whitespace-nowrap">
                <Shield className="w-3.5 h-3.5" />
                <span>{t('nav.adminDashboard', 'ADMIN').toUpperCase()}</span>
              </Link>
            )}

            {/* User Profile / Auth Button */}
            {user ? (
              <Link
                to="/account"
                className="h-9 px-2.5 flex items-center space-x-2 text-xs sub-nav-label hover:text-brand-gold transition-colors whitespace-nowrap"
              >
                <div className="w-7 h-7 rounded-full bg-brand-brown text-cream flex items-center justify-center text-xs font-semibold">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden md:inline">{user.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="h-9 px-3.5 flex items-center space-x-1 text-xs sub-nav-label border border-brand-gold/60 text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-all rounded-sm font-semibold whitespace-nowrap"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t('nav.signIn', 'SIGN IN').toUpperCase()}</span>
              </Link>
            )}

            {/* Mobile Drawer Trigger */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="h-9 w-9 lg:hidden flex items-center justify-center rounded hover:bg-white/10 transition-colors"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mega Menus Overlay Render */}
        {activeMenu === 'explore' && <MegaMenuExplore onClose={() => setActiveMenu(null)} />}
        {activeMenu === 'experience' && <MegaMenuExperience onClose={() => setActiveMenu(null)} />}
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        onOpenAi={onOpenAi}
      />
    </>
  );
};
