import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Compass } from 'lucide-react';
import api from '../../api/client';
import { Destination } from '../../types';
import { DestinationCard } from '../../components/tourism/DestinationCard';

export const DestinationsListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCircuit = searchParams.get('circuit') || 'ALL';
  const initialDistrict = searchParams.get('district') || 'ALL';
  const initialCategory = searchParams.get('category') || 'ALL';

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCircuit, setSelectedCircuit] = useState(initialCircuit);
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  useEffect(() => {
    async function loadDestinations() {
      setLoading(true);
      try {
        const params: any = {};
        if (selectedCircuit !== 'ALL') params.circuit = selectedCircuit;
        if (selectedDistrict !== 'ALL') params.district = selectedDistrict;
        if (selectedCategory !== 'ALL') params.category = selectedCategory;
        if (searchQuery) params.search = searchQuery;

        const res = await api.get('/destinations', { params });
        if (res.data.success) {
          setDestinations(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load destinations:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDestinations();
  }, [searchQuery, selectedCircuit, selectedDistrict, selectedCategory]);

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="border-b border-brand-brown/15 pb-6 space-y-2">
        <span className="sub-nav-label text-brand-maroon">HERITAGE SANCTUARIES & LANDMARKS</span>
        <h1 className="text-4xl md:text-6xl font-serif text-brand-black">Bihar Tourism Destinations</h1>
        <p className="text-base font-serif text-brand-black/75 max-w-2xl leading-relaxed">
          From UNESCO World Heritage stupas to ancient monastic universities and wildlife reserves.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-cream p-5 rounded border border-brand-brown/15 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-brand-black/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-brand-brown/20 rounded text-xs pl-9 pr-3 py-3 focus:outline-none focus:border-brand-gold font-sans text-brand-black"
          />
        </div>

        {/* Circuit Filter */}
        <div className="relative">
          <Compass className="w-4 h-4 text-brand-black/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <select
            value={selectedCircuit}
            onChange={(e) => setSelectedCircuit(e.target.value)}
            className="w-full bg-white border border-brand-brown/20 rounded text-xs pl-9 pr-3 py-3 focus:outline-none focus:border-brand-gold font-sans text-brand-black appearance-none"
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
          <Filter className="w-4 h-4 text-brand-black/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full bg-white border border-brand-brown/20 rounded text-xs pl-9 pr-3 py-3 focus:outline-none focus:border-brand-gold font-sans text-brand-black appearance-none"
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

        {/* Category Filter */}
        <div className="relative">
          <Filter className="w-4 h-4 text-brand-black/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-white border border-brand-brown/20 rounded text-xs pl-9 pr-3 py-3 focus:outline-none focus:border-brand-gold font-sans text-brand-black appearance-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Spiritual">Spiritual & Heritage</option>
            <option value="Archaeological">Archaeological</option>
            <option value="Eco">Eco & Wildlife</option>
            <option value="Religious">Religious</option>
          </select>
        </div>
      </div>

      {/* Grid Results */}
      {loading ? (
        <div className="py-20 text-center text-brand-brown font-serif">Searching Bihar destinations...</div>
      ) : destinations.length === 0 ? (
        <div className="py-20 text-center bg-cream rounded border border-brand-brown/15 p-8 space-y-2">
          <h3 className="font-serif text-2xl text-brand-black">No Destinations Found</h3>
          <p className="text-sm font-serif text-brand-brown/80">Try clearing your search query or selecting "All Circuits".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      )}
    </div>
  );
};
