import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, Calendar, Utensils, ArrowRight } from 'lucide-react';

export const ExperienceListingPage: React.FC = () => {
  const { category } = useParams<{ category?: string }>();

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
      <div className="border-b border-brand-brown/15 pb-6 space-y-2">
        <span className="sub-nav-label text-brand-maroon">CULTURAL IMMERSION</span>
        <h1 className="text-4xl md:text-6xl font-serif text-brand-black">Experience Bihar Culture</h1>
        <p className="text-base font-serif text-brand-black/75 max-w-2xl leading-relaxed">
          Touch sacred rituals, see ancient folk melas, and taste legendary Mithila culinary heritage.
        </p>
      </div>

      {/* Three Pillars Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* TOUCH */}
        <div className="bg-white border border-brand-brown/15 rounded p-8 space-y-4 hover:shadow-lg transition-all">
          <div className="flex items-center space-x-2 text-brand-maroon">
            <Sparkles className="w-5 h-5" />
            <span className="sub-nav-label">TOUCH / FESTIVALS</span>
          </div>
          <h3 className="text-2xl font-serif text-brand-black">Sacred Festivals</h3>
          <p className="text-sm font-serif text-brand-black/75 leading-relaxed">
            Witness millions gather along holy rivers for Chhath Puja, Pitru Paksha, and Prakash Parv.
          </p>
          <Link
            to="/experience/festivals/chhath-puja"
            className="inline-flex items-center space-x-2 text-xs sub-nav-label text-brand-maroon hover:text-brand-black font-semibold pt-2"
          >
            <span>DISCOVER CHHATH PUJA</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* SEE */}
        <div className="bg-white border border-brand-brown/15 rounded p-8 space-y-4 hover:shadow-lg transition-all">
          <div className="flex items-center space-x-2 text-brand-maroon">
            <Calendar className="w-5 h-5" />
            <span className="sub-nav-label">SEE / FAIRS</span>
          </div>
          <h3 className="text-2xl font-serif text-brand-black">Historic Fairs & Melas</h3>
          <p className="text-sm font-serif text-brand-black/75 leading-relaxed">
            Explore Sonepur Mela and Rajgir Mahotsav for folk arts, theatre, and traditional handicrafts.
          </p>
          <Link
            to="/experience/fairs/sonepur-mela"
            className="inline-flex items-center space-x-2 text-xs sub-nav-label text-brand-maroon hover:text-brand-black font-semibold pt-2"
          >
            <span>DISCOVER SONEPUR MELA</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* TASTE */}
        <div className="bg-white border border-brand-brown/15 rounded p-8 space-y-4 hover:shadow-lg transition-all">
          <div className="flex items-center space-x-2 text-brand-maroon">
            <Utensils className="w-5 h-5" />
            <span className="sub-nav-label">TASTE / CUISINE</span>
          </div>
          <h3 className="text-2xl font-serif text-brand-black">Gastronomy & Traditions</h3>
          <p className="text-sm font-serif text-brand-black/75 leading-relaxed">
            Savor authentic Litti Chokha, GI-tagged Silao Khaja, Mithila Makhana, and festive Prasad.
          </p>
          <Link
            to="/experience/taste/litti-chokha"
            className="inline-flex items-center space-x-2 text-xs sub-nav-label text-brand-maroon hover:text-brand-black font-semibold pt-2"
          >
            <span>DISCOVER CUISINE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
