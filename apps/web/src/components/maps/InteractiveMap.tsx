import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { MapPin, Search, Filter, Compass } from 'lucide-react';
import { Destination } from '../../types';

// Custom SVG marker pin generator
const createCustomIcon = (category: string) => {
  let color = '#5A1F24'; // default Maroon
  if (category.toLowerCase().includes('spiritual')) color = '#B88A28';
  if (category.toLowerCase().includes('eco') || category.toLowerCase().includes('wildlife')) color = '#2E7D32';
  if (category.toLowerCase().includes('heritage') || category.toLowerCase().includes('archaeological')) color = '#3B2118';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32" stroke="#FAF8F3" stroke-width="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;

  return L.divIcon({
    html: svg,
    className: 'custom-map-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30]
  });
};

interface InteractiveMapProps {
  destinations: Destination[];
  height?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  destinations,
  height = '650px',
  initialCenter = [25.4, 85.3], // Central Bihar view
  initialZoom = 8
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCircuit, setSelectedCircuit] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCircuit =
      selectedCircuit === 'ALL' || dest.circuit?.slug === selectedCircuit;

    const matchesDistrict =
      selectedDistrict === 'ALL' || dest.district?.slug === selectedDistrict;

    return matchesSearch && matchesCircuit && matchesDistrict;
  });

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Map Filter Controls Bar */}
      <div className="bg-cream p-4 rounded border border-brand-brown/15 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-brand-black/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search map locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-brand-brown/20 rounded text-xs pl-9 pr-3 py-2.5 focus:outline-none focus:border-brand-gold text-brand-black font-sans"
          />
        </div>

        {/* Circuit Filter */}
        <div className="relative">
          <Filter className="w-4 h-4 text-brand-black/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <select
            value={selectedCircuit}
            onChange={(e) => setSelectedCircuit(e.target.value)}
            className="w-full bg-white border border-brand-brown/20 rounded text-xs pl-9 pr-3 py-2.5 focus:outline-none focus:border-brand-gold text-brand-black font-sans appearance-none"
          >
            <option value="ALL">All Circuits</option>
            <option value="buddhist-circuit">Buddhist Circuit</option>
            <option value="eco-circuit">Eco Circuit</option>
            <option value="ramayan-circuit">Ramayan Circuit</option>
            <option value="sikh-circuit">Sikh Circuit</option>
          </select>
        </div>

        {/* District Filter */}
        <div className="relative">
          <Compass className="w-4 h-4 text-brand-black/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full bg-white border border-brand-brown/20 rounded text-xs pl-9 pr-3 py-2.5 focus:outline-none focus:border-brand-gold text-brand-black font-sans appearance-none"
          >
            <option value="ALL">All Districts</option>
            <option value="gaya">Gaya</option>
            <option value="nalanda">Nalanda</option>
            <option value="patna">Patna</option>
            <option value="vaishali">Vaishali</option>
            <option value="madhubani">Madhubani</option>
            <option value="rohtas">Rohtas</option>
            <option value="west-champaran">West Champaran</option>
          </select>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative rounded overflow-hidden shadow-lg border border-brand-brown/15" style={{ height }}>
        <MapContainer
          center={initialCenter}
          zoom={initialZoom}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          {/* Tile Layer: OpenStreetMap Standard */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredDestinations.map((dest) => (
            <Marker
              key={dest.id}
              position={[dest.latitude, dest.longitude]}
              icon={createCustomIcon(dest.category)}
            >
              <Popup>
                <div className="flex flex-col">
                  <img
                    src={dest.heroImage}
                    alt={dest.name}
                    className="w-full h-28 object-cover"
                  />
                  <div className="p-3 space-y-1.5 bg-cream">
                    <span className="text-[9px] sub-nav-label text-brand-maroon uppercase">{dest.category}</span>
                    <h4 className="font-serif text-base text-brand-black font-bold leading-tight">{dest.name}</h4>
                    <p className="text-xs text-brand-brown font-sans flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-brand-gold inline" />
                      <span>{dest.district?.name || 'Bihar'}</span>
                    </p>
                    <Link
                      to={`/explore/destinations/${dest.slug}`}
                      className="mt-2 block text-center bg-brand-maroon text-white text-xs sub-nav-label py-1.5 rounded hover:bg-brand-black transition-colors"
                    >
                      EXPLORE DESTINATION &rarr;
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="flex items-center justify-between text-xs text-brand-brown/70 font-sans px-1">
        <span>Showing {filteredDestinations.length} interactive locations</span>
        <span className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B88A28] inline-block" /> Spiritual
          <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32] inline-block ml-2" /> Eco/Wildlife
          <span className="w-2.5 h-2.5 rounded-full bg-[#5A1F24] inline-block ml-2" /> Heritage
        </span>
      </div>
    </div>
  );
};
