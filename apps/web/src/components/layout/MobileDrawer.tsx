import React from 'react';
import { Link } from 'react-router-dom';
import { X, Sparkles, MapPin, Calendar, Compass, User, Store, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import { getHomeRouteForRole } from '../../utils/navigation';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAi: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose, onOpenAi }) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const homeRoute = getHomeRouteForRole(user);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-brand-black/95 text-cream flex flex-col justify-between p-6 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cream/15 pb-4">
        <Link to={homeRoute} onClick={onClose} className="font-serif text-3xl font-light text-brand-gold tracking-widest flex items-center space-x-2">
          <span>SETU</span>
          <span className="text-[10px] sub-nav-label tracking-widest border border-brand-gold/40 px-1.5 py-0.5 rounded text-brand-gold">
            {t('nav.logoTag', 'BIHAR TOURISM')}
          </span>
        </Link>
        <div className="flex items-center space-x-3">
          <LanguageSwitcher compact={true} />
          <button onClick={onClose} className="p-2 text-cream/70 hover:text-white" aria-label="Close menu">
            <X className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* Main Links */}
      <nav className="flex flex-col space-y-6 my-auto text-xl font-serif">
        <Link to="/explore/circuits" onClick={onClose} className="flex items-center space-x-4 hover:text-brand-gold">
          <Compass className="w-6 h-6 text-brand-gold" />
          <span>{t('nav.circuits', 'EXPLORE CIRCUITS').toUpperCase()}</span>
        </Link>
        <Link to="/explore/destinations" onClick={onClose} className="flex items-center space-x-4 hover:text-brand-gold">
          <MapPin className="w-6 h-6 text-brand-gold" />
          <span>{t('nav.destinations', 'DESTINATIONS').toUpperCase()}</span>
        </Link>
        <Link to="/maps" onClick={onClose} className="flex items-center space-x-4 hover:text-brand-gold">
          <MapPin className="w-6 h-6 text-brand-gold" />
          <span>{t('nav.maps', 'INTERACTIVE MAPS').toUpperCase()}</span>
        </Link>
        <Link to="/calendar" onClick={onClose} className="flex items-center space-x-4 hover:text-brand-gold">
          <Calendar className="w-6 h-6 text-brand-gold" />
          <span>{t('nav.calendar', 'CULTURAL CALENDAR').toUpperCase()}</span>
        </Link>

        <button
          onClick={() => {
            onClose();
            onOpenAi();
          }}
          className="flex items-center space-x-4 text-brand-gold hover:text-white text-left font-serif"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span>{t('nav.aiGuide', 'SETU AI COMPANION').toUpperCase()}</span>
        </button>

        {user?.role === 'VENDOR' && (
          <Link to={homeRoute} onClick={onClose} className="flex items-center space-x-4 text-amber-300 hover:text-amber-200">
            <Store className="w-6 h-6" />
            <span>{t('nav.vendorDashboard', 'VENDOR DASHBOARD').toUpperCase()}</span>
          </Link>
        )}

        {user?.role === 'ADMIN' && (
          <Link to="/admin" onClick={onClose} className="flex items-center space-x-4 text-emerald-300 hover:text-emerald-200">
            <Shield className="w-6 h-6" />
            <span>{t('nav.adminDashboard', 'ADMIN CONSOLE').toUpperCase()}</span>
          </Link>
        )}
      </nav>

      {/* Footer / Account */}
      <div className="border-t border-cream/15 pt-6 flex flex-col space-y-3">
        {user ? (
          <div className="flex items-center justify-between">
            <Link to="/account" onClick={onClose} className="flex items-center space-x-3 text-sm font-sans">
              <User className="w-5 h-5 text-brand-gold" />
              <span>{user.name} ({user.role})</span>
            </Link>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="text-xs uppercase tracking-widest text-red-300 hover:text-red-100"
            >
              {t('nav.signOut', 'Sign Out')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/login"
              onClick={onClose}
              className="py-3 text-center border border-cream/30 text-xs tracking-widest uppercase hover:bg-white/10"
            >
              {t('nav.signIn', 'Sign In')}
            </Link>
            <Link
              to="/register"
              onClick={onClose}
              className="py-3 text-center bg-brand-gold text-brand-black text-xs tracking-widest uppercase font-bold hover:bg-white"
            >
              {t('nav.register', 'Register')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
