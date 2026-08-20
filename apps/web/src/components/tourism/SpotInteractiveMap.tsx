import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Phone, Store, Hotel, Car, Utensils, Sparkles, AlertCircle } from 'lucide-react';
import { Destination, TourismEvent, Vendor } from '../../types';

import 'leaflet/dist/leaflet.css';

// Fix Leaflet Default Icon Issues in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

// Helper: Calculate Distance in km (Haversine formula)
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Map Bounds Auto-Fitter Component
const MapBoundsController: React.FC<{
  center: [number, number];
  targetPoint?: [number, number] | null;
}> = ({ center, targetPoint }) => {
  const map = useMap();

  useEffect(() => {
    if (targetPoint) {
      const bounds = L.latLngBounds([center, targetPoint]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else {
      map.setView(center, 13);
    }
  }, [map, center, targetPoint]);

  return null;
};

export interface GenericSpot {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  heroImage?: string;
  districtName?: string;
}

interface SpotInteractiveMapProps {
  destination?: Pick<Destination, 'id' | 'name' | 'latitude' | 'longitude' | 'heroImage'> | Pick<TourismEvent, 'id' | 'title' | 'latitude' | 'longitude' | 'heroImage'> | GenericSpot;
  spot?: GenericSpot;
  vendors?: Vendor[];
}

export const SpotInteractiveMap: React.FC<SpotInteractiveMapProps> = ({ destination, spot, vendors = [] }) => {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const targetObj = spot || destination;
  const spotName = spot?.name || (destination ? ('name' in destination ? destination.name : (destination as any).title) : 'Location');
  const districtName = spot?.districtName || (destination && 'district' in destination ? (typeof (destination as any).district === 'string' ? (destination as any).district : (destination as any).district?.name) : 'Bihar');

  // Validate coordinates
  const spotLat = targetObj ? Number(targetObj.latitude) : NaN;
  const spotLng = targetObj ? Number(targetObj.longitude) : NaN;
  const hasValidSpotCoords = !isNaN(spotLat) && !isNaN(spotLng) && spotLat !== 0 && spotLng !== 0;

  if (!hasValidSpotCoords) {
    return (
      <div className="bg-cream border border-brand-brown/15 p-8 rounded-xl text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
        <h3 className="font-serif text-xl font-bold text-brand-black">Interactive Map Unavailable</h3>
        <p className="text-sm font-serif text-brand-brown">
          Coordinates for {spotName} are currently pending official verification.
        </p>
      </div>
    );
  }

  const spotCenter: [number, number] = [spotLat, spotLng];

  // Filter valid vendors with coordinates
  const validVendors = vendors.filter(
    (v) => v.latitude && v.longitude && !isNaN(Number(v.latitude)) && !isNaN(Number(v.longitude))
  );

  // Create custom Leaflet Icons
  const createCustomIcon = (bgColor: string, symbol: string) => {
    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `<div style="background-color: ${bgColor}; width: 34px; height: 34px; border-radius: 50%; display: flex; items-center; justify-content: center; color: white; font-weight: bold; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); font-size: 16px;">${symbol}</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 34],
      popupAnchor: [0, -34]
    });
  };

  const spotIcon = createCustomIcon('#991B1B', '🏛️'); // Maroon/Gold for Destination
  const hotelIcon = createCustomIcon('#1E40AF', '🏨'); // Blue for Hotels
  const foodIcon = createCustomIcon('#D97706', '🍽️'); // Amber for Dining
  const transportIcon = createCustomIcon('#047857', '🚗'); // Emerald for Transport
  const craftIcon = createCustomIcon('#6B21A8', '🎨'); // Purple for Local Crafts

  const getVendorIcon = (bType: string) => {
    const typeLower = (bType || '').toLowerCase();
    if (typeLower.includes('hotel') || typeLower.includes('stay') || typeLower.includes('resort')) return hotelIcon;
    if (typeLower.includes('restaurant') || typeLower.includes('dining')) return foodIcon;
    if (typeLower.includes('cab') || typeLower.includes('transport') || typeLower.includes('travel')) return transportIcon;
    return craftIcon;
  };

  const getVendorCategoryBadge = (bType: string) => {
    const typeLower = (bType || '').toLowerCase();
    if (typeLower.includes('hotel') || typeLower.includes('stay')) return 'bg-blue-100 text-blue-900 border-blue-300';
    if (typeLower.includes('restaurant') || typeLower.includes('dining')) return 'bg-amber-100 text-amber-900 border-amber-300';
    if (typeLower.includes('cab') || typeLower.includes('transport')) return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    return 'bg-purple-100 text-purple-900 border-purple-300';
  };

  const targetCoords: [number, number] | null = selectedVendor
    ? [Number(selectedVendor.latitude), Number(selectedVendor.longitude)]
    : null;

  const calculatedDistance = selectedVendor
    ? calculateDistanceKm(spotLat, spotLng, Number(selectedVendor.latitude), Number(selectedVendor.longitude))
    : null;

  return (
    <div className="bg-cream border border-brand-brown/15 rounded-2xl overflow-hidden shadow-lg space-y-0">
      {/* Header Bar */}
      <div className="bg-brand-black text-cream p-4 px-6 flex flex-wrap items-center justify-between gap-3 border-b border-brand-gold/20">
        <div className="flex items-center space-x-2">
          <Navigation className="w-5 h-5 text-brand-gold animate-pulse" />
          <h3 className="font-serif text-lg font-bold tracking-wide">
            Interactive Map & Nearby Amenities
          </h3>
        </div>

        {selectedVendor && calculatedDistance !== null && (
          <div className="bg-brand-gold text-brand-black text-xs sub-nav-label px-3 py-1.5 rounded-full font-bold shadow flex items-center space-x-1.5">
            <span>Route to {selectedVendor.businessName}:</span>
            <strong className="text-brand-maroon underline">{calculatedDistance} km</strong>
          </div>
        )}
      </div>

      {/* Main Map + Sidebar Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        {/* Leaflet Map Canvas */}
        <div className="lg:col-span-8 relative h-[380px] lg:h-[480px]">
          <MapContainer
            center={spotCenter}
            zoom={13}
            scrollWheelZoom={false}
            className="w-full h-full z-10"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapBoundsController center={spotCenter} targetPoint={targetCoords} />

            {/* Destination / Event Spot Marker */}
            <Marker position={spotCenter} icon={spotIcon}>
              <Popup className="font-serif">
                <div className="p-1 space-y-1">
                  <h4 className="font-bold text-brand-maroon text-sm">{spotName}</h4>
                  <p className="text-xs text-slate-600">{districtName}</p>
                  <span className="text-[9px] bg-brand-gold text-brand-black px-2 py-0.5 rounded font-bold">
                    EVENT / SPOT
                  </span>
                </div>
              </Popup>
            </Marker>

            {/* Nearby Vendors Markers */}
            {validVendors.map((v) => {
              const vLat = Number(v.latitude);
              const vLng = Number(v.longitude);
              const isSelected = selectedVendor?.id === v.id;

              return (
                <Marker
                  key={v.id}
                  position={[vLat, vLng]}
                  icon={getVendorIcon(v.businessType)}
                  eventHandlers={{
                    click: () => setSelectedVendor(v)
                  }}
                >
                  <Popup className="font-serif">
                    <div className="p-1 space-y-1.5 min-w-[180px]">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getVendorCategoryBadge(v.businessType)}`}>
                        {v.businessType}
                      </span>
                      <h5 className="font-bold text-brand-black text-sm">{v.businessName}</h5>
                      <p className="text-xs text-slate-600 leading-tight">{v.address}, {v.city}</p>
                      <div className="pt-1 flex items-center justify-between border-t border-slate-100 text-xs">
                        <span className="text-emerald-700 font-bold">✓ Approved</span>
                        <a href={`tel:${v.phone}`} className="text-brand-maroon font-bold underline flex items-center space-x-1">
                          <Phone className="w-3 h-3 inline" />
                          <span>Call</span>
                        </a>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* Selected Route Polyline */}
            {targetCoords && (
              <Polyline
                positions={[spotCenter, targetCoords]}
                pathOptions={{
                  color: '#991B1B',
                  weight: 5,
                  dashArray: '8, 8',
                  opacity: 0.85
                }}
              />
            )}
          </MapContainer>

          {/* Quick Clear Route Overlay */}
          {selectedVendor && (
            <button
              onClick={() => setSelectedVendor(null)}
              className="absolute top-3 right-3 z-20 bg-white text-brand-black border border-brand-brown/20 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md hover:bg-cream"
            >
              Reset Map View
            </button>
          )}
        </div>

        {/* Sidebar List of Nearby Amenities */}
        <div className="lg:col-span-4 bg-white p-4 sm:p-5 border-t lg:border-t-0 lg:border-l border-brand-brown/15 flex flex-col justify-between overflow-y-auto max-h-[480px]">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-brand-brown/10">
              <span className="sub-nav-label text-brand-maroon text-xs">NEARBY STAYS & AMENITIES</span>
              <span className="text-xs text-brand-brown font-semibold">{validVendors.length} Option(s)</span>
            </div>

            {validVendors.length === 0 ? (
              <div className="py-8 text-center text-xs text-brand-brown font-serif space-y-1">
                <Store className="w-6 h-6 mx-auto text-brand-gold" />
                <p>Searching for nearby certified vendors in {districtName || 'this district'}...</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {validVendors.map((v) => {
                  const dist = calculateDistanceKm(spotLat, spotLng, Number(v.latitude), Number(v.longitude));
                  const isSelected = selectedVendor?.id === v.id;

                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVendor(v)}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-50 border-brand-maroon shadow-sm ring-1 ring-brand-maroon'
                          : 'bg-cream-light border-brand-brown/15 hover:border-brand-maroon hover:bg-cream'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getVendorCategoryBadge(v.businessType)}`}>
                            {v.businessType}
                          </span>
                          <h5 className="font-bold text-brand-black text-sm font-serif mt-1">
                            {v.businessName}
                          </h5>
                          <p className="text-xs text-brand-brown/80 font-sans line-clamp-1">
                            {v.address}, {v.city}
                          </p>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className="text-xs font-bold text-brand-maroon font-sans block">
                            {dist} km
                          </span>
                          <span className="text-[10px] text-emerald-800 font-medium">
                            ✓ Route
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="mt-2.5 pt-2 border-t border-brand-brown/10 flex items-center justify-between text-xs font-sans">
                          <a
                            href={`tel:${v.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-brand-maroon font-bold hover:underline flex items-center space-x-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{v.phone}</span>
                          </a>
                          <span className="text-brand-black font-semibold text-[11px]">
                            Route Active on Map &uarr;
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-brand-brown/10 text-[11px] text-brand-brown/70 font-sans text-center">
            Click any vendor to show directions & route path on map
          </div>
        </div>
      </div>
    </div>
  );
};
