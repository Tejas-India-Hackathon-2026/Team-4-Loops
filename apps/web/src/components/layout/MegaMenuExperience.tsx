import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, Utensils } from 'lucide-react';

interface MegaMenuExperienceProps {
  onClose: () => void;
}

export const MegaMenuExperience: React.FC<MegaMenuExperienceProps> = ({ onClose }) => {
  return (
    <div className="w-full bg-cream border-b border-brand-brown/15 shadow-2xl py-10 px-6 md:px-12 transition-all duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* TOUCH: FESTIVALS */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-brand-brown/15 pb-2">
            <Sparkles className="w-4 h-4 text-brand-maroon" />
            <span className="sub-nav-label text-brand-maroon">TOUCH / FESTIVALS</span>
          </div>
          <div className="group overflow-hidden rounded relative aspect-[16/9] mb-3">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
              alt="Chhath Puja Mahaparv"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
              <span className="text-white text-lg font-serif">Chhath Puja Mahaparv</span>
            </div>
          </div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/experience/festivals/chhath-puja" onClick={onClose} className="hover:text-brand-maroon transition-colors block py-1 font-serif text-base">
                Chhath Puja — Sun God Eco Festival
              </Link>
            </li>
            <li>
              <Link to="/experience/festivals/pitru-paksha-mela" onClick={onClose} className="hover:text-brand-maroon transition-colors block py-1 font-serif text-base">
                Pitru Paksha — Sacred Gaya Rituals
              </Link>
            </li>
            <li>
              <Link to="/experience/festivals/prakash-parv" onClick={onClose} className="hover:text-brand-maroon transition-colors block py-1 font-serif text-base">
                Prakash Parv — Patna Sahib Celebrations
              </Link>
            </li>
            <li>
              <Link to="/experience/festivals/rajgir-mahotsav" onClick={onClose} className="hover:text-brand-maroon transition-colors block py-1 font-serif text-base">
                Rajgir Mahotsav — Arts & Classical Dance
              </Link>
            </li>
          </ul>
        </div>

        {/* SEE: FAIRS */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-brand-brown/15 pb-2">
            <Calendar className="w-4 h-4 text-brand-maroon" />
            <span className="sub-nav-label text-brand-maroon">SEE / FAIRS</span>
          </div>
          <div className="group overflow-hidden rounded relative aspect-[16/9] mb-3">
            <img
              src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80"
              alt="Sonepur Cattle Fair"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
              <span className="text-white text-lg font-serif">Sonepur Mela</span>
            </div>
          </div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/experience/fairs/sonepur-mela" onClick={onClose} className="hover:text-brand-maroon transition-colors block py-1 font-serif text-base">
                Sonepur Mela — Asia’s Historic Fair
              </Link>
            </li>
            <li>
              <Link to="/experience/fairs/shravani-mela" onClick={onClose} className="hover:text-brand-maroon transition-colors block py-1 font-serif text-base">
                Shravani Mela — Sultanganj Kanwar Yatra
              </Link>
            </li>
          </ul>
        </div>

        {/* TASTE: CUISINE */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-brand-brown/15 pb-2">
            <Utensils className="w-4 h-4 text-brand-maroon" />
            <span className="sub-nav-label text-brand-maroon">TASTE / CUISINE</span>
          </div>
          <div className="group overflow-hidden rounded relative aspect-[16/9] mb-3">
            <img
              src="https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80"
              alt="Authentic Bihari Cuisine"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
              <span className="text-white text-lg font-serif">Traditional Gastronomy</span>
            </div>
          </div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/experience/taste/litti-chokha" onClick={onClose} className="hover:text-brand-maroon transition-colors block py-1 font-serif text-base">
                Litti Chokha & Sattu Delicacies
              </Link>
            </li>
            <li>
              <Link to="/experience/taste/thekua-festive-sweets" onClick={onClose} className="hover:text-brand-maroon transition-colors block py-1 font-serif text-base">
                Thekua & Traditional Chhath Prasad
              </Link>
            </li>
            <li>
              <Link to="/experience/taste/makhana-culinary-traditions" onClick={onClose} className="hover:text-brand-maroon transition-colors block py-1 font-serif text-base">
                Mithila Makhana Heritage
              </Link>
            </li>
            <li>
              <Link to="/experience/taste/silao-khaja" onClick={onClose} className="hover:text-brand-maroon transition-colors block py-1 font-serif text-base">
                Silao Khaja — GI Tag Sweet
              </Link>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};
