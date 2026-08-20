import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ArrowLeft, Eye, Star, Info, Compass, CheckCircle2, Ticket } from 'lucide-react';
import api from '../../api/client';
import { Destination } from '../../types';
import { TabView, TabItem } from '../../components/common/TabView';
import { Lightbox } from '../../components/common/Lightbox';
import { SpotInteractiveMap } from '../../components/tourism/SpotInteractiveMap';

export const DestinationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    async function loadDestination() {
      try {
        const res = await api.get(`/destinations/${slug}`);
        if (res.data.success) {
          setDestination(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load destination detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDestination();
  }, [slug]);

  if (loading) {
    return <div className="pt-32 pb-24 text-center text-brand-brown font-serif">Loading destination...</div>;
  }

  if (!destination) {
    return (
      <div className="pt-32 pb-24 text-center space-y-4">
        <h2 className="text-3xl font-serif text-brand-black">Destination Not Found</h2>
        <Link to="/explore/destinations" className="text-brand-maroon underline sub-nav-label">Return to Destinations</Link>
      </div>
    );
  }

  const galleryImages = [
    destination.heroImage,
    ...(destination.gallery || [])
  ];

  const travelInfo = destination.travelInformation || {};

  const tabs: TabItem[] = [
    {
      id: 'overview',
      label: 'OVERVIEW',
      content: (
        <div className="space-y-6 font-serif text-brand-black/85 leading-relaxed text-base">
          <p>{destination.overview}</p>
          <div className="bg-cream p-6 rounded border border-brand-brown/15 space-y-4">
            <h4 className="sub-nav-label text-brand-maroon">LOCATION DETAILS</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-brand-brown/70 block">DISTRICT</span>
                <span className="font-semibold">{destination.district?.name || 'N/A'}</span>
              </div>
              <div>
                <span className="text-xs text-brand-brown/70 block">CIRCUIT</span>
                <span className="font-semibold">{destination.circuit?.name || 'Heritage Circuit'}</span>
              </div>
              <div>
                <span className="text-xs text-brand-brown/70 block">CATEGORY</span>
                <span className="font-semibold">{destination.category}</span>
              </div>
              <div>
                <span className="text-xs text-brand-brown/70 block">COORDINATES</span>
                <span className="font-semibold">{destination.latitude.toFixed(4)}° N, {destination.longitude.toFixed(4)}° E</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'interactive-map',
      label: 'SPOT MAP & NEARBY STAYS',
      content: (
        <div className="space-y-4">
          <SpotInteractiveMap
            destination={destination}
            vendors={destination.nearbyVendors || []}
          />
        </div>
      )
    },
    {
      id: 'gallery',
      label: 'PHOTO GALLERY',
      content: (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((imgUrl, idx) => (
            <div
              key={idx}
              onClick={() => {
                setLightboxIndex(idx);
                setLightboxOpen(true);
              }}
              className="group relative aspect-[4/3] rounded overflow-hidden cursor-pointer border border-brand-brown/15 shadow-sm hover:shadow-md transition-all"
            >
              <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Eye className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'travel-info',
      label: 'TRAVEL INFORMATION',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded border border-brand-brown/15 space-y-2">
            <span className="text-xs sub-nav-label text-brand-gold">BEST TIME TO VISIT</span>
            <p className="font-serif text-lg font-semibold text-brand-black">{travelInfo.bestTime || 'October to March'}</p>
          </div>
          <div className="bg-white p-6 rounded border border-brand-brown/15 space-y-2">
            <span className="text-xs sub-nav-label text-brand-gold">HOW TO REACH</span>
            <p className="font-serif text-sm text-brand-black/80">{travelInfo.howToReach || 'Connected via Patna Airport & major railway head.'}</p>
          </div>
          <div className="bg-white p-6 rounded border border-brand-brown/15 space-y-2">
            <span className="text-xs sub-nav-label text-brand-gold">SUGGESTED DURATION</span>
            <p className="font-serif text-lg font-semibold text-brand-black">{travelInfo.suggestedDuration || '1 to 2 Days'}</p>
          </div>
          <div className="bg-white p-6 rounded border border-brand-brown/15 space-y-2">
            <span className="text-xs sub-nav-label text-brand-gold">ENTRY FEE & TIMINGS</span>
            <p className="font-serif text-sm text-brand-black/80">{travelInfo.entryFee || 'Free entrance'}</p>
          </div>
        </div>
      )
    },
    {
      id: 'stays',
      label: 'NEARBY STAYS',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {destination.stays && destination.stays.length > 0 ? (
            destination.stays.map((stay: any, idx: number) => (
              <div key={idx} className="bg-white p-6 rounded border border-brand-brown/15 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-lg text-brand-black font-semibold">{stay.name}</h4>
                  <div className="flex items-center space-x-1 text-xs text-brand-gold mt-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{stay.rating} Rating</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-serif text-base font-bold text-brand-maroon">{stay.price}</span>
                  <span className="block text-[10px] sub-nav-label text-brand-brown/60">PER NIGHT</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm font-serif text-brand-brown/70">No specific hotels listed yet.</p>
          )}
        </div>
      )
    },
    {
      id: 'recommendations',
      label: 'INSIDER RECOMMENDATIONS',
      content: (
        <div className="bg-cream p-6 rounded border border-brand-brown/15 space-y-4">
          <h4 className="sub-nav-label text-brand-maroon">LOCAL INSIDER TIPS</h4>
          <ul className="space-y-3 font-serif text-sm text-brand-black/85">
            {destination.recommendations && destination.recommendations.length > 0 ? (
              destination.recommendations.map((tip: string, idx: number) => (
                <li key={idx} className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))
            ) : (
              <li>No specific recommendations listed.</li>
            )}
          </ul>
        </div>
      )
    }
  ];

  return (
    <div className="pt-24 pb-24">
      {/* Hero Banner */}
      <div className="relative h-[65vh] min-h-[400px] w-full bg-brand-black text-white overflow-hidden">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-black/30 to-transparent" />

        <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-6 md:px-12 space-y-3">
          <Link
            to="/explore/destinations"
            className="inline-flex items-center space-x-2 text-xs sub-nav-label text-brand-gold hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ALL DESTINATIONS</span>
          </Link>
          <span className="text-xs sub-nav-label text-brand-gold block">{destination.category}</span>
          <h1 className="text-4xl md:text-6xl font-serif text-cream">{destination.name}</h1>
          <div className="flex items-center space-x-2 text-xs font-serif text-cream/80 pt-1">
            <MapPin className="w-4 h-4 text-brand-gold" />
            <span>{destination.district?.name || 'Bihar'}</span>
            {destination.circuit && <span>• {destination.circuit.name}</span>}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 space-y-12">
        <TabView tabs={tabs} defaultTabId="overview" />

        {/* Vendor Booking Banner */}
        <div className="bg-brand-black text-cream p-8 rounded border border-brand-gold/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <span className="text-[10px] sub-nav-label text-brand-gold">MARKETPLACE EXPERIENCES</span>
            <h3 className="text-2xl font-serif text-cream">Book Guided Tours & Experiences Near {destination.name}</h3>
            <p className="text-xs font-serif text-cream/70 max-w-xl">
              Verified local vendors offer heritage walking tours, private transport, and craft workshops.
            </p>
          </div>
          <Link
            to="/explore/circuits"
            className="px-6 py-3.5 bg-brand-gold text-brand-black sub-nav-label text-xs tracking-widest font-semibold rounded hover:bg-amber-400 transition-all flex items-center space-x-2 whitespace-nowrap shadow-lg"
          >
            <Ticket className="w-4 h-4" />
            <span>BROWSE OFFERINGS</span>
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        images={galleryImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />
    </div>
  );
};
