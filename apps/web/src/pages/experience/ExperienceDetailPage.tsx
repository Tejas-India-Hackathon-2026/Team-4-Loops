import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Ticket, Eye, Sparkles } from 'lucide-react';
import api from '../../api/client';
import { TourismEvent } from '../../types';
import { Lightbox } from '../../components/common/Lightbox';

export const ExperienceDetailPage: React.FC = () => {
  const { category, slug } = useParams<{ category?: string; slug?: string }>();
  const [event, setEvent] = useState<TourismEvent | null>(null);
  const [loading, setLoading] = useState(true);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    async function loadEvent() {
      try {
        const res = await api.get(`/events/${slug}`);
        if (res.data.success) {
          setEvent(res.data.data);
        }
      } catch {
        // Fallback for custom taste/festivals
      } finally {
        setLoading(false);
      }
    }
    if (slug) loadEvent();
  }, [slug]);

  // Generic fallback if not in events database
  const fallbackTitle = slug ? slug.replace(/-/g, ' ').toUpperCase() : 'CULTURAL EXPERIENCE';
  const displayTitle = event?.title || fallbackTitle;
  const heroImage = event?.heroImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80';
  const galleryImages = event?.gallery && event.gallery.length > 0 ? event.gallery : [heroImage];

  return (
    <div className="pt-24 pb-24">
      {/* Full-bleed Hero */}
      <div className="relative h-[65vh] min-h-[400px] w-full bg-brand-black text-white overflow-hidden">
        <img src={heroImage} alt={displayTitle} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-black/30 to-transparent" />

        <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-6 md:px-12 space-y-3">
          <Link to="/experience" className="inline-flex items-center space-x-2 text-xs sub-nav-label text-brand-gold hover:text-white mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>ALL EXPERIENCES</span>
          </Link>
          <span className="text-xs sub-nav-label text-brand-gold block">{category ? category.toUpperCase() : 'CULTURE'}</span>
          <h1 className="text-4xl md:text-6xl font-serif text-cream">{displayTitle}</h1>
          {event && (
            <div className="flex items-center space-x-4 text-xs font-serif text-cream/80 pt-1">
              <span className="flex items-center space-x-1"><Calendar className="w-4 h-4 text-brand-gold" /> {new Date(event.startDate).toLocaleDateString()}</span>
              <span className="flex items-center space-x-1"><MapPin className="w-4 h-4 text-brand-gold" /> {event.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-8 font-serif text-brand-black/85 leading-relaxed">
            <div className="bg-cream p-8 rounded border border-brand-brown/15 space-y-4">
              <h3 className="sub-nav-label text-brand-maroon">ABOUT THIS CULTURAL EXPERIENCE</h3>
              <p className="text-lg">
                {event?.description || `Immerse yourself in ${displayTitle}, an integral part of Bihar’s living spiritual and cultural heritage.`}
              </p>
            </div>

            {/* Photo Gallery */}
            <div className="space-y-4">
              <h3 className="sub-nav-label text-brand-maroon">PHOTOGRAPHIC HIGHLIGHTS</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setLightboxIndex(idx);
                      setLightboxOpen(true);
                    }}
                    className="group relative aspect-[4/3] rounded overflow-hidden cursor-pointer border border-brand-brown/15 shadow-sm"
                  >
                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Eye className="w-6 h-6" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar CTA Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded border border-brand-brown/15 shadow-sm space-y-6">
              <h4 className="sub-nav-label text-brand-maroon">PLAN YOUR VISIT</h4>
              <p className="text-xs font-serif text-brand-black/80">
                Experience this event with curated guide services, authentic local cuisine tastings, and private transport.
              </p>
              <div className="space-y-3">
                <Link
                  to="/calendar"
                  className="w-full py-3 bg-cream text-brand-black sub-nav-label text-xs tracking-widest text-center rounded border border-brand-brown/20 hover:bg-brand-brown hover:text-white transition-all block"
                >
                  VIEW FULL CALENDAR
                </Link>
                <Link
                  to="/explore/circuits"
                  className="w-full py-3 bg-brand-black text-brand-gold sub-nav-label text-xs tracking-widest text-center rounded hover:bg-brand-maroon hover:text-white transition-all block"
                >
                  BOOK HERITAGE TOUR
                </Link>
              </div>
            </div>
          </div>
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
