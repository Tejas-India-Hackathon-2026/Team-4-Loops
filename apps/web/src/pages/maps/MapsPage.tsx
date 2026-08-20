import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { Destination } from '../../types';
import { InteractiveMap } from '../../components/maps/InteractiveMap';
import { MapPin, Compass } from 'lucide-react';

export const MapsPage: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAllDestinations() {
      try {
        const res = await api.get('/destinations');
        if (res.data.success) {
          setDestinations(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load map destinations:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAllDestinations();
  }, []);

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-brand-brown/15 pb-6 space-y-2">
        <div className="flex items-center space-x-2 text-brand-maroon">
          <Compass className="w-5 h-5" />
          <span className="sub-nav-label">GEOGRAPHIC EXPLORER</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif text-brand-black">Interactive Bihar Map</h1>
        <p className="text-base font-serif text-brand-black/75 max-w-2xl leading-relaxed">
          Navigate sacred spiritual circuits, heritage monuments, and eco-parks across all Bihar districts.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-brand-brown font-serif">Loading interactive map data...</div>
      ) : (
        <div className="space-y-6">
          <InteractiveMap destinations={destinations} height="700px" />
        </div>
      )}
    </div>
  );
};
