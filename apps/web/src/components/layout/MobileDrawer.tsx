import React from 'react';
import { Link } from 'react-router-dom';
import { X, Sparkles, MapPin, Calendar, Compass, User, Store, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getHomeRouteForRole } from '../../utils/navigation';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAi: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose, onOpenAi }) => {
  const { user, logout } = useAuth();
  const homeRoute = getHomeRouteForRole(user);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-brand-black/95 text-cream flex flex-col justify-between p-6 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cream/15 pb-4">
        <Link to={homeRoute} onClick={onClose} className="font-serif text-3xl font-light text-brand-gold tracking-widest">
          SETU
        </Link>
        <button onClick={onClose} className="p-2 text-cream/70 hover:text-white" aria-label="Close menu">
          <X className="w-7 h-7" />
        </button>
      </div>

      {/* Main Links */}
      <nav className="flex flex-col space-y-6 my-auto text-xl font-serif">
        <Link to="/explore/circuits" onClick={onClose} className="flex items-center space-x-4 hover:text-brand-gold">
          <Compass className="w-6 h-6 text-brand-gold" />
          <span>EXPLORE CIRCUITS</span>
        </Link>
        <Link to="/explore/destinations" onClick={onClose} className="flex items-center space-x-4 hover:text-brand-gold">
          <MapPin className="w-6 h-6 text-brand-gold" />
          <span>DESTINATIONS</span>
        </Link>
        <Link to="/maps" onClick={onClose} className="flex items-center space-x-4 hover:text-brand-gold">
          <MapPin className="w-6 h-6 text-brand-gold" />
          <span>INTERACTIVE MAPS</span>
        </Link>
        <Link to="/calendar" onClick={onClose} className="flex items-center space-x-4 hover:text-brand-gold">
          <Calendar className="w-6 h-6 text-brand-gold" />
          <span>CALENDAR & EVENTS</span>
        </Link>

        <button
          onClick={() => {
            onClose();
            onOpenAi();
          }}
          className="flex items-center space-x-4 text-brand-gold hover:text-white text-left font-serif"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span>SETU AI COMPANION</span>
        </button>

        {user?.role === 'VENDOR' && (
          <Link to={homeRoute} onClick={onClose} className="flex items-center space-x-4 text-amber-300 hover:text-amber-200">
            <Store className="w-6 h-6" />
            <span>VENDOR DASHBOARD</span>
          </Link>
        )}

        {user?.role === 'ADMIN' && (
          <Link to="/admin" onClick={onClose} className="flex items-center space-x-4 text-emerald-300 hover:text-emerald-200">
            <Shield className="w-6 h-6" />
            <span>ADMIN CONSOLE</span>
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
              Sign Out
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/login"
              onClick={onClose}
              className="py-3 text-center border border-cream/30 text-xs tracking-widest uppercase hover:bg-white/10"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={onClose}
              className="py-3 text-center bg-brand-gold text-brand-black text-xs font-semibold tracking-widest uppercase hover:bg-amber-400"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
