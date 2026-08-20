import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { TourismEvent } from '../../types';

interface EventCardProps {
  event: TourismEvent;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const startDateStr = format(new Date(event.startDate), 'MMM dd, yyyy');
  const endDateStr = format(new Date(event.endDate), 'MMM dd, yyyy');

  return (
    <div className="group bg-cream border border-brand-brown/15 rounded overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between">
      <div>
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={event.heroImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute top-3 left-3 bg-brand-maroon text-white text-[10px] sub-nav-label px-2.5 py-1 rounded">
            {event.category}
          </div>
        </div>

        <div className="p-6 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-sans text-brand-maroon font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            <span>{startDateStr} — {endDateStr}</span>
          </div>

          <h3 className="text-xl font-serif text-brand-black group-hover:text-brand-maroon transition-colors">
            {event.title}
          </h3>

          <div className="flex items-center space-x-1 text-xs text-brand-brown/80 font-sans">
            <MapPin className="w-3.5 h-3.5 text-brand-mustard" />
            <span>{event.location}</span>
          </div>

          <p className="text-sm font-serif text-brand-black/75 line-clamp-3 leading-relaxed pt-1">
            {event.description}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-2">
        <Link
          to={`/experience/events/${event.slug}`}
          className="inline-flex items-center justify-between w-full text-xs sub-nav-label text-brand-maroon font-semibold border-t border-brand-brown/10 pt-3 group-hover:text-brand-black transition-colors"
        >
          <span>VIEW EVENT DETAILS</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
