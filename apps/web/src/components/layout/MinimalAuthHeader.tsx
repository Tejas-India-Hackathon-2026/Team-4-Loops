import React from 'react';
import { Link } from 'react-router-dom';

export const MinimalAuthHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass-header border-b border-brand-brown/10 text-brand-black shadow-sm h-20 flex items-center justify-between px-6 sm:px-8 lg:px-12 xl:px-16">
      <Link
        to="/"
        className="font-serif text-3xl font-medium tracking-[0.2em] hover:opacity-90 transition-opacity text-brand-gold flex items-center space-x-2.5 group whitespace-nowrap"
      >
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
    </header>
  );
};
