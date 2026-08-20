import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface MegaMenuExploreProps {
  onClose: () => void;
}

export const MegaMenuExplore: React.FC<MegaMenuExploreProps> = ({ onClose }) => {
  return (
    <div className="w-full bg-cream border-b border-brand-brown/15 shadow-2xl py-10 px-6 md:px-12 transition-all duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Column 1: CIRCUITS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-brand-brown/15 pb-2">
            <span className="sub-nav-label text-brand-maroon">01 / CIRCUITS</span>
            <Link
              to="/explore/circuits"
              onClick={onClose}
              className="text-xs sub-nav-label text-brand-black/70 hover:text-brand-black flex items-center space-x-1"
            >
              <span>VIEW ALL</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="group overflow-hidden rounded relative aspect-[16/9] mb-3">
            <img
              src="https://www.agoda.com/wp-content/uploads/2023/10/4-Great-Buddha-Bodhgaya-Buddhist-Circuit-India.jpg"
              alt="Buddhist Circuit"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
              <span className="text-white text-lg font-serif">Buddhist Circuit</span>
            </div>
          </div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/explore/circuits/buddhist-circuit" onClick={onClose} className="hover:text-brand-maroon transition-colors block py-1 font-serif text-base">
                Buddhist Circuit — Bodh Gaya & Nalanda
              </Link>
            </li>
            <li>
              <Link to="/explore/circuits/eco-circuit" onClick={onClose} className="hover:text-brand-maroon transition-colors block py-1 font-serif text-base">
                Eco Circuit — Valmiki Tiger Reserve
              </Link>
            </li>
            <li>
              <Link to="/explore/circuits/ramayan-circuit" onClick={onClose} className="hover:text-brand-maroon transition-colors block py-1 font-serif text-base">
                Ramayan Circuit — Sitamarhi & Buxar
              </Link>
            </li>
            <li>
              <Link to="/explore/circuits/sikh-circuit" onClick={onClose} className="hover:text-brand-maroon transition-colors block py-1 font-serif text-base">
                Sikh Heritage Circuit — Patna Sahib
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: DESTINATIONS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-brand-brown/15 pb-2">
            <span className="sub-nav-label text-brand-maroon">02 / DESTINATIONS</span>
            <Link
              to="/explore/destinations"
              onClick={onClose}
              className="text-xs sub-nav-label text-brand-black/70 hover:text-brand-black flex items-center space-x-1"
            >
              <span>VIEW ALL</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="group overflow-hidden rounded relative aspect-[16/9] mb-3">
            <img
              src="https://metro.yoinfra.com/uploads/nalanda_mahavihara_b029c5cc57.jpg"
              alt="Nalanda Ruins"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
              <span className="text-white text-lg font-serif">Nalanda Mahavihara</span>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            <li><Link to="/explore/destinations/mahabodhi-temple" onClick={onClose} className="hover:text-brand-maroon py-1 block font-serif">Mahabodhi Temple</Link></li>
            <li><Link to="/explore/destinations/nalanda-university-ruins" onClick={onClose} className="hover:text-brand-maroon py-1 block font-serif">Nalanda Ruins</Link></li>
            <li><Link to="/explore/destinations/rajgir-vishwa-shanti-stupa" onClick={onClose} className="hover:text-brand-maroon py-1 block font-serif">Rajgir Peace Pagoda</Link></li>
            <li><Link to="/explore/destinations/takht-sri-patna-sahib" onClick={onClose} className="hover:text-brand-maroon py-1 block font-serif">Patna Sahib</Link></li>
            <li><Link to="/explore/destinations/vaishali-ashoka-pillar" onClick={onClose} className="hover:text-brand-maroon py-1 block font-serif">Vaishali Lion Pillar</Link></li>
            <li><Link to="/explore/destinations/valmiki-tiger-reserve" onClick={onClose} className="hover:text-brand-maroon py-1 block font-serif">Valmiki Park</Link></li>
          </ul>
        </div>

        {/* Column 3: DISTRICTS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-brand-brown/15 pb-2">
            <span className="sub-nav-label text-brand-maroon">03 / DISTRICTS</span>
            <Link
              to="/explore/districts"
              onClick={onClose}
              className="text-xs sub-nav-label text-brand-black/70 hover:text-brand-black flex items-center space-x-1"
            >
              <span>VIEW ALL</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="group overflow-hidden rounded relative aspect-[16/9] mb-3">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_IrusE4BumL8YBXD-JEGfRInt8_lvw8UN8Dz0FhX_-g&s=10"
              alt="Madhubani District"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
              <span className="text-white text-lg font-serif">Madhubani Heartland</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link to="/explore/districts/gaya" onClick={onClose} className="hover:text-brand-maroon py-1 block font-serif">Gaya District</Link>
            <Link to="/explore/districts/nalanda" onClick={onClose} className="hover:text-brand-maroon py-1 block font-serif">Nalanda District</Link>
            <Link to="/explore/districts/patna" onClick={onClose} className="hover:text-brand-maroon py-1 block font-serif">Patna District</Link>
            <Link to="/explore/districts/vaishali" onClick={onClose} className="hover:text-brand-maroon py-1 block font-serif">Vaishali District</Link>
            <Link to="/explore/districts/madhubani" onClick={onClose} className="hover:text-brand-maroon py-1 block font-serif">Madhubani District</Link>
            <Link to="/explore/districts/rohtas" onClick={onClose} className="hover:text-brand-maroon py-1 block font-serif">Rohtas District</Link>
          </div>
        </div>

      </div>
    </div>
  );
};
