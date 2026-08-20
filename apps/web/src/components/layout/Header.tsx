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
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link
            to={homeRoute}
            className="font-serif text-3xl font-light tracking-widest hover:opacity-80 transition-opacity text-brand-gold flex items-center space-x-2"
          >
            <span>SETU</span>
            <span className="text-[10px] sub-nav-label tracking-widest border border-brand-gold/40 px-1.5 py-0.5 rounded text-brand-gold hidden sm:inline-block">
              {t('nav.logoTag', 'BIHAR TOURISM')}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-9 sub-nav-label">
            {/* EXPLORE Mega-menu Button */}
            <div className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === 'explore' ? null : 'explore')}
                className="flex items-center space-x-1 hover:text-brand-gold transition-colors py-2 focus:outline-none"
              >
                <span>{t('nav.explore', 'EXPLORE').toUpperCase()}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeMenu === 'explore' ? 'rotate-180 text-brand-gold' : ''}`} />
              </button>
            </div>

            <Link to="/maps" className="hover:text-brand-gold transition-colors">
              {t('nav.maps', 'MAPS').toUpperCase()}
            </Link>

            <Link to="/calendar" className="hover:text-brand-gold transition-colors">
              {t('nav.calendar', 'CALENDAR').toUpperCase()}
            </Link>

            {/* EXPERIENCE Mega-menu Button */}
            <div className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === 'experience' ? null : 'experience')}
                className="flex items-center space-x-1 hover:text-brand-gold transition-colors py-2 focus:outline-none"
              >
                <span>{t('nav.experience', 'EXPERIENCE').toUpperCase()}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeMenu === 'experience' ? 'rotate-180 text-brand-gold' : ''}`} />
              </button>
            </div>
          </nav>

          {/* Actions Right */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Language Switcher Dropdown */}
            <LanguageSwitcher compact={isHome && !isScrolled && activeMenu === null} />

            {/* AI Companion Button - Tourist & Guests Only */}
            {(!user || user.role === 'TOURIST') && (
              <button
                onClick={onOpenAi}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-brand-gold/40 bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold transition-all text-xs sub-nav-label"
                title="Open SETU AI Travel Companion"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-brand-gold" />
                <span className="hidden sm:inline">{t('nav.aiGuide', 'AI CONCIERGE').toUpperCase()}</span>
              </button>
            )}

            {/* Role quick links */}
            {user?.role === 'VENDOR' && (
              <Link to={homeRoute} className="hidden sm:flex items-center space-x-1 text-xs sub-nav-label text-amber-700 hover:text-amber-900 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                <Store className="w-3.5 h-3.5" />
                <span>{t('nav.vendorDashboard', 'VENDOR').toUpperCase()}</span>
              </Link>
            )}

            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="hidden sm:flex items-center space-x-1 text-xs sub-nav-label text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                <Shield className="w-3.5 h-3.5" />
                <span>{t('nav.adminDashboard', 'ADMIN').toUpperCase()}</span>
              </Link>
            )}

            {/* User Profile / Auth Button */}
            {user ? (
              <Link
                to="/account"
                className="flex items-center space-x-2 text-xs sub-nav-label hover:text-brand-gold transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-brand-brown text-cream flex items-center justify-center text-xs font-semibold">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden md:inline">{user.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 text-xs sub-nav-label px-3.5 py-1.5 border border-brand-gold/60 text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-all rounded-sm font-semibold"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t('nav.signIn', 'SIGN IN').toUpperCase()}</span>
              </Link>
            )}

            {/* Mobile Drawer Trigger */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 hover:opacity-80 transition-opacity"
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
