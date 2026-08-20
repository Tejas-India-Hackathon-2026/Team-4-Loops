import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Calendar, MapPin, Ticket, Eye, Sparkles, Clock, Navigation,
  Compass
} from 'lucide-react';
import api from '../../api/client';
import { TourismEvent } from '../../types';
import { Lightbox } from '../../components/common/Lightbox';
import { SpotInteractiveMap } from '../../components/tourism/SpotInteractiveMap';
import { DestinationCard } from '../../components/tourism/DestinationCard';

export const ExperienceDetailPage: React.FC = () => {
  const { category, slug } = useParams<{ category?: string; slug?: string }>();
  const [event, setEvent] = useState<TourismEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'map' | 'gallery'>('overview');

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    async function loadEvent() {
      setLoading(true);
      try {
        const res = await api.get(`/events/${slug}`);
        if (res.data.success) {
          setEvent(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load event details:', err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) loadEvent();
  }, [slug]);

  const fallbackTitle = slug ? slug.replace(/-/g, ' ').toUpperCase() : 'CULTURAL EXPERIENCE';
  const displayTitle = event?.title || fallbackTitle;
  const heroImage = event?.heroImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80';
  const galleryImages = event?.gallery && event.gallery.length > 0 ? event.gallery : [heroImage];

  const startDateStr = event ? new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
  const endDateStr = event ? new Date(event.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
  const datesFormatted = event ? (startDateStr === endDateStr ? startDateStr : `${startDateStr} – ${endDateStr}`) : 'Annual Festival';

  const tabDefs = [
    { id: 'overview', label: 'OVERVIEW & CELEBRATION' },
    { id: 'map', label: 'INTERACTIVE MAP & NEARBY STAYS' },
    { id: 'gallery', label: `PHOTO GALLERY (${galleryImages.length})` }
  ];

  return (
    <div className="pt-24 pb-24 font-sans">
      {/* Full-bleed Hero Banner */}
      <div className="relative h-[60vh] min-h-[420px] w-full bg-brand-black text-white overflow-hidden">
        <img src={heroImage} alt={displayTitle} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-black/40 to-transparent" />

        <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-6 md:px-12 space-y-3">
          <Link to="/calendar" className="inline-flex items-center space-x-2 text-xs sub-nav-label text-brand-gold hover:text-white mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>2026 CULTURAL CALENDAR</span>
          </Link>
          <div className="flex items-center space-x-3">
            <span className="text-xs sub-nav-label bg-brand-gold/20 text-brand-gold border border-brand-gold/40 px-2.5 py-1 rounded">
              {event?.category ? String(event.category).toUpperCase() : 'CULTURE & FAIR'}
            </span>
            {event?.isLunar && (
              <span className="text-[10px] sub-nav-label bg-amber-900/60 text-amber-200 border border-amber-500/40 px-2 py-0.5 rounded">
                🌕 LUNAR CALENDAR FESTIVAL
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-cream font-normal tracking-tight">{displayTitle}</h1>
          {event && (
            <div className="flex flex-wrap items-center gap-6 text-xs font-serif text-cream/90 pt-1">
              <span className="flex items-center space-x-1.5"><Calendar className="w-4 h-4 text-brand-gold" /> <span>{datesFormatted}</span></span>
              <span className="flex items-center space-x-1.5"><MapPin className="w-4 h-4 text-brand-gold" /> <span>{event.location}, {event.district}</span></span>
            </div>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 space-y-12">
        {/* Quick-Facts Card Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-cream p-5 rounded-xl border border-brand-brown/15 shadow-sm space-y-1">
            <div className="flex items-center space-x-2 text-brand-maroon">
              <Calendar className="w-4 h-4 text-brand-gold" />
              <span className="sub-nav-label text-[10px]">FESTIVAL DATES</span>
            </div>
            <p className="font-serif text-sm md:text-base font-bold text-brand-black">
              {datesFormatted}
            </p>
          </div>

          <div className="bg-cream p-5 rounded-xl border border-brand-brown/15 shadow-sm space-y-1">
            <div className="flex items-center space-x-2 text-brand-maroon">
              <Clock className="w-4 h-4 text-brand-gold" />
              <span className="sub-nav-label text-[10px]">DURATION</span>
            </div>
            <p className="font-serif text-sm md:text-base font-bold text-brand-black">
              Multi-Day Celebration
            </p>
          </div>

          <div className="bg-cream p-5 rounded-xl border border-brand-brown/15 shadow-sm space-y-1">
            <div className="flex items-center space-x-2 text-brand-maroon">
              <Ticket className="w-4 h-4 text-brand-gold" />
              <span className="sub-nav-label text-[10px]">ENTRY & ADMISSION</span>
            </div>
            <p className="font-serif text-sm md:text-base font-bold text-brand-black">
              Free Open Entry
            </p>
          </div>

          <div className="bg-cream p-5 rounded-xl border border-brand-brown/15 shadow-sm space-y-1">
            <div className="flex items-center space-x-2 text-brand-maroon">
              <Navigation className="w-4 h-4 text-brand-gold" />
              <span className="sub-nav-label text-[10px]">LOCATION / REACH</span>
            </div>
            <p className="font-serif text-sm md:text-base font-bold text-brand-black truncate">
              {event?.district || 'Bihar'} Junction / Airport
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-brand-brown/20 flex space-x-8">
          {tabDefs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 sub-nav-label text-xs tracking-wider transition-all relative ${
                activeTab === tab.id
                  ? 'text-brand-maroon font-bold'
                  : 'text-brand-brown/60 hover:text-brand-black font-medium'
              }`}
            >
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-maroon rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Main Grid: Content Tabs (Left 8 cols) + Plan Your Visit Sidebar (Right 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-8 font-serif text-brand-black/85 leading-relaxed">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* About Section */}
                <div className="bg-cream p-8 rounded-xl border border-brand-brown/15 space-y-4 shadow-sm">
                  <span className="sub-nav-label text-brand-maroon">HERITAGE & TRADITIONS</span>
                  <h3 className="text-2xl font-serif font-bold text-brand-black">About {displayTitle}</h3>
                  <p className="text-base md:text-lg leading-relaxed font-serif text-brand-black/85">
                    {event?.description || `Immerse yourself in ${displayTitle}, an integral part of Bihar’s living spiritual and cultural heritage. Celebrated with profound devotion and grand public processions, it draws pilgrims and art connoisseurs from across India.`}
                  </p>
                </div>

                {/* What to Expect */}
                <div className="bg-white p-6 rounded-xl border border-brand-brown/15 space-y-4">
                  <h4 className="sub-nav-label text-brand-maroon text-xs">WHAT TO EXPECT & HIGHLIGHTS</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                    <div className="flex items-start space-x-3 p-3 bg-cream/50 rounded-lg border border-brand-brown/10">
                      <Sparkles className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold text-brand-black">Ritual Processions & Prayers</strong>
                        <span className="text-brand-brown/80">Traditional chanting, sacred lamps, and ceremonial offerings at dawn and dusk.</span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-cream/50 rounded-lg border border-brand-brown/10">
                      <Compass className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold text-brand-black">Artisan Fairs & Mithila Crafts</strong>
                        <span className="text-brand-brown/80">Local vendor stalls featuring handwoven textiles, terracotta, and authentic Bihari cuisine.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Specifications */}
                <div className="bg-white p-6 rounded-xl border border-brand-brown/15 space-y-4">
                  <h4 className="sub-nav-label text-brand-maroon text-xs">EVENT SPECIFICATIONS</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
                    <div>
                      <span className="text-brand-brown/70 block text-[10px] sub-nav-label">DISTRICT</span>
                      <span className="font-bold text-brand-black text-sm">{event?.district || 'Bihar'}</span>
                    </div>
                    <div>
                      <span className="text-brand-brown/70 block text-[10px] sub-nav-label">CATEGORY</span>
                      <span className="font-bold text-brand-black text-sm">{event?.category || 'Cultural'}</span>
                    </div>
                    <div>
                      <span className="text-brand-brown/70 block text-[10px] sub-nav-label">SCHEDULE</span>
                      <span className="font-bold text-brand-black text-sm">{datesFormatted}</span>
                    </div>
                    <div>
                      <span className="text-brand-brown/70 block text-[10px] sub-nav-label">GPS COORDINATES</span>
                      <span className="font-mono text-brand-black">{event?.latitude?.toFixed(4) || '25.4000'}° N, {event?.longitude?.toFixed(4) || '85.3000'}° E</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'map' && (
              <div className="space-y-4">
                {event && (
                  <SpotInteractiveMap
                    destination={{
                      id: event.id,
                      name: event.title,
                      latitude: event.latitude,
                      longitude: event.longitude,
                      heroImage: event.heroImage
                    }}
                    vendors={event.nearbyVendors || []}
                  />
                )}
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="sub-nav-label text-brand-maroon text-xs">PHOTOGRAPHIC COLLECTION ({galleryImages.length})</span>
                  <span className="text-xs text-brand-brown font-sans">Click image to enlarge</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {galleryImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setLightboxIndex(idx);
                        setLightboxOpen(true);
                      }}
                      className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer border border-brand-brown/15 shadow-sm hover:shadow-md transition-all"
                    >
                      <img src={imgUrl} alt={`${displayTitle} ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Eye className="w-6 h-6 text-brand-gold" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar CTA Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-brand-brown/15 shadow-sm space-y-6">
              <h4 className="sub-nav-label text-brand-maroon">PLAN YOUR VISIT</h4>
              <p className="text-xs font-serif text-brand-black/80">
                Experience this event with curated guide services, authentic local cuisine tastings, and private transport.
              </p>
              <div className="space-y-3">
                <Link
                  to="/calendar"
                  className="w-full py-3 bg-cream text-brand-black sub-nav-label text-xs tracking-widest text-center rounded border border-brand-brown/20 hover:bg-brand-brown hover:text-white transition-all block font-semibold"
                >
                  VIEW FULL CALENDAR
                </Link>
                <Link
                  to="/explore/circuits"
                  className="w-full py-3 bg-brand-black text-brand-gold sub-nav-label text-xs tracking-widest text-center rounded hover:bg-brand-maroon hover:text-white transition-all block font-semibold"
                >
                  BOOK HERITAGE TOUR
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Nearby Attractions Cross-Link Section */}
        {event?.nearbyAttractions && event.nearbyAttractions.length > 0 && (
          <div className="pt-12 border-t border-brand-brown/15 space-y-6">
            <div className="space-y-1">
              <span className="sub-nav-label text-brand-maroon">REGIONAL EXPLORATION</span>
              <h3 className="text-2xl md:text-3xl font-serif text-brand-black">
                NEARBY HERITAGE ATTRACTIONS IN {event.district.toUpperCase()}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {event.nearbyAttractions.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          </div>
        )}
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
