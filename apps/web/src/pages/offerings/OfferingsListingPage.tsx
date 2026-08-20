import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Offering } from '../../types';
import { MapPin, Clock } from 'lucide-react';

export const OfferingsListingPage: React.FC = () => {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOfferings() {
      try {
        const res = await api.get('/offerings');
        if (res.data.success) setOfferings(res.data.data);
      } catch (err) {
        console.error('Error loading offerings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOfferings();
  }, []);

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <span className="text-xs sub-nav-label text-brand-maroon">GUIDED TOURS & EXPERIENCES</span>
        <h1 className="text-4xl font-serif text-brand-black">Book Bihar Tourism Offerings</h1>
        <p className="text-sm font-serif text-brand-brown/80">Curated experiences from verified local vendors.</p>
      </div>

      {loading ? (
        <p className="font-serif text-brand-brown text-center py-16">Loading offerings...</p>
      ) : offerings.length === 0 ? (
        <p className="font-serif text-brand-brown text-center py-16">No offerings available right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offerings.map((off) => (
            <Link
              key={off.id}
              to={`/offerings/${off.slug}`}
              className="bg-white border border-brand-brown/15 rounded overflow-hidden shadow-sm hover:shadow-md transition-all block"
            >
              <img src={off.coverImage} alt={off.title} className="w-full h-44 object-cover" />
              <div className="p-5 space-y-2">
                <span className="text-[10px] sub-nav-label text-brand-maroon uppercase">{off.category}</span>
                <h3 className="font-serif text-lg text-brand-black font-semibold leading-snug">{off.title}</h3>
                <div className="flex items-center space-x-3 text-xs font-sans text-brand-brown">
                  <span className="flex items-center space-x-1"><MapPin className="w-3.5 h-3.5" /><span>{off.location}</span></span>
                  <span className="flex items-center space-x-1"><Clock className="w-3.5 h-3.5" /><span>{off.duration}</span></span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-brand-brown/10">
                  <span className="font-serif text-xl font-bold text-brand-black">₹{off.price.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] sub-nav-label text-brand-brown/70">{off.vendor?.businessName}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
