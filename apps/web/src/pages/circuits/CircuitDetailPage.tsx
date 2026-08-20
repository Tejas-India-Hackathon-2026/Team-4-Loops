import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ArrowLeft, Play, Eye } from 'lucide-react';
import api from '../../api/client';
import { Circuit } from '../../types';
import { TabView, TabItem } from '../../components/common/TabView';
import { Lightbox } from '../../components/common/Lightbox';
import { DestinationCard } from '../../components/tourism/DestinationCard';
import { InteractiveMap } from '../../components/maps/InteractiveMap';

export const CircuitDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [circuit, setCircuit] = useState<Circuit | null>(null);
  const [loading, setLoading] = useState(true);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    async function loadCircuit() {
      try {
        const res = await api.get(`/circuits/${slug}`);
        if (res.data.success) {
          setCircuit(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load circuit detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCircuit();
  }, [slug]);

  if (loading) {
    return <div className="pt-32 pb-24 text-center text-brand-brown font-serif">Loading circuit details...</div>;
  }

  if (!circuit) {
    return (
      <div className="pt-32 pb-24 text-center space-y-4">
        <h2 className="text-3xl font-serif text-brand-black">Circuit Not Found</h2>
        <Link to="/explore/circuits" className="text-brand-maroon underline sub-nav-label">Return to Circuits</Link>
      </div>
    );
  }

  const galleryImages = [
    circuit.heroImage,
    ...(circuit.destinations?.map(d => d.heroImage) || [])
  ];

  // Tab Contents Definition
  const tabs: TabItem[] = [
    {
      id: 'overview',
      label: 'OVERVIEW',
      content: (
        <div className="space-y-6 font-serif text-brand-black/85 leading-relaxed text-base">
          <p>{circuit.overview}</p>
          <div className="bg-cream p-6 rounded border border-brand-brown/15 space-y-3">
            <h4 className="sub-nav-label text-brand-maroon">WHY TRAVEL THIS CIRCUIT</h4>
            <ul className="list-disc list-inside space-y-1.5 text-sm">
              <li>Comprehensive coverage of Bihar’s key UNESCO and spiritual landmarks.</li>
              <li>Connected via modern national highways and dedicated tourist transport routes.</li>
              <li>Curated local guide support and authentic culinary stops along the trail.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'locations',
      label: 'LOCATIONS',
      content: (
        <div className="space-y-6">
          <h3 className="sub-nav-label text-brand-maroon">DESTINATIONS ALONG THIS TRAIL</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {circuit.destinations && circuit.destinations.length > 0 ? (
              circuit.destinations.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))
            ) : (
              <p className="text-sm font-serif text-brand-brown/70">No specific destinations tagged yet.</p>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'maps',
      label: 'MAPS & ROUTE',
      content: (
        <div className="space-y-4">
          <p className="text-sm font-serif text-brand-black/80">
            Interactive geographic trail showing key stops along the {circuit.name}.
          </p>
          <InteractiveMap destinations={circuit.destinations || []} height="500px" />
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
      id: 'video',
      label: 'VIDEO DISCOVERY',
      content: (
        <div className="bg-brand-black text-white p-8 rounded border border-brand-brown/20 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-brand-gold text-brand-black flex items-center justify-center mx-auto shadow-lg">
            <Play className="w-6 h-6 fill-current ml-1" />
          </div>
          <h4 className="font-serif text-2xl text-brand-gold">Immersive Video Documentary</h4>
          <p className="font-serif text-cream/70 text-sm max-w-lg mx-auto">
            Watch the official 4K Bihar Tourism film showcasing the spiritual aura and architectural wonders of the {circuit.name}.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="pt-24 pb-24">
      {/* Hero Full-bleed Banner */}
      <div className="relative h-[65vh] min-h-[400px] w-full bg-brand-black text-white overflow-hidden">
        <img
          src={circuit.heroImage}
          alt={circuit.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-black/30 to-transparent" />

        <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-6 md:px-12 space-y-3">
          <Link
            to="/explore/circuits"
            className="inline-flex items-center space-x-2 text-xs sub-nav-label text-brand-gold hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ALL CIRCUITS</span>
          </Link>
          <span className="text-xs sub-nav-label text-brand-gold block">SACRED TRAIL</span>
          <h1 className="text-4xl md:text-6xl font-serif text-cream">{circuit.name}</h1>
          <div className="flex items-center space-x-2 text-xs font-serif text-cream/80 pt-1">
            <MapPin className="w-4 h-4 text-brand-gold" />
            <span>{circuit.locations.join(' • ')}</span>
          </div>
        </div>
      </div>

      {/* Main Tabbed Content Area */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12">
        <TabView tabs={tabs} defaultTabId="overview" />
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
