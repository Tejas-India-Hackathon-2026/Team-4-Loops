import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-black text-cream border-t border-cream/15 pt-20 pb-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

        {/* Brand & Manifesto */}
        <div className="md:col-span-4 space-y-6">
          <Link to="/" className="font-serif text-4xl text-brand-gold tracking-widest block">
            SETU
          </Link>
          <p className="text-cream/70 font-serif text-sm leading-relaxed max-w-sm">
            Bridging millennia of sacred wisdom, UNESCO world heritage, and artisanal Mithila craftsmanship with modern digital tourism.
          </p>
          <div className="pt-2">
            <span className="sub-nav-label text-brand-gold text-xs block mb-2">OFFICIAL PLATFORM</span>
            <p className="text-xs text-cream/50">Department of Tourism & Cultural Preservation, Bihar</p>
          </div>
        </div>

        {/* Circuits */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="sub-nav-label text-brand-gold">FEATURED CIRCUITS</h4>
          <ul className="space-y-2.5 text-sm font-serif text-cream/80">
            <li><Link to="/explore/circuits/buddhist-circuit" className="hover:text-brand-gold transition-colors">Buddhist Heritage Circuit</Link></li>
            <li><Link to="/explore/circuits/eco-circuit" className="hover:text-brand-gold transition-colors">Eco & Wilderness Circuit</Link></li>
            <li><Link to="/explore/circuits/ramayan-circuit" className="hover:text-brand-gold transition-colors">Ramayan Spiritual Trail</Link></li>
            <li><Link to="/explore/circuits/sikh-circuit" className="hover:text-brand-gold transition-colors">Sikh Heritage Circuit</Link></li>
            <li><Link to="/explore/destinations" className="hover:text-brand-gold transition-colors text-xs sub-nav-label text-brand-gold pt-2 block">All Destinations &rarr;</Link></li>
          </ul>
        </div>

        {/* Experiences */}
        <div className="md:col-span-2 space-y-4">
          <h4 className="sub-nav-label text-brand-gold">EXPERIENCES</h4>
          <ul className="space-y-2.5 text-sm font-serif text-cream/80">
            <li><Link to="/experience/festivals/chhath-puja" className="hover:text-brand-gold transition-colors">Chhath Puja Mahaparv</Link></li>
            <li><Link to="/experience/fairs/sonepur-mela" className="hover:text-brand-gold transition-colors">Sonepur Cattle Fair</Link></li>
            <li><Link to="/calendar" className="hover:text-brand-gold transition-colors">Cultural Calendar</Link></li>
            <li><Link to="/maps" className="hover:text-brand-gold transition-colors">Interactive Maps</Link></li>
          </ul>
        </div>

        {/* Vendors & Marketplace */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="sub-nav-label text-brand-gold">PARTNER MARKETPLACE</h4>
          <p className="text-xs text-cream/70 font-serif leading-relaxed">
            Are you a certified local guide, heritage homestay host, or artisan in Bihar? Join the SETU Marketplace platform.
          </p>
          <Link
            to="/register?role=VENDOR"
            className="inline-flex items-center space-x-2 text-xs sub-nav-label border border-brand-gold text-brand-gold px-4 py-2.5 rounded-sm hover:bg-brand-gold hover:text-brand-black transition-all"
          >
            <span>BECOME A VENDOR</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto border-t border-cream/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-cream/50 space-y-4 md:space-y-0">
        <p>&copy; {new Date().getFullYear()} SETU Bihar Tourism & Travel Marketplace. All rights reserved.</p>
        <div className="flex items-center space-x-6">
          <Link to="/explore/circuits" className="hover:text-cream">Circuits</Link>
          <Link to="/maps" className="hover:text-cream">Maps</Link>
          <Link to="/calendar" className="hover:text-cream">Calendar</Link>
          <Link to="/login" className="hover:text-cream">Vendor Access</Link>
        </div>
      </div>
    </footer>
  );
};
