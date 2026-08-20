import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { addMonths, subMonths, format, isSameMonth } from 'date-fns';
import api from '../../api/client';
import { TourismEvent } from '../../types';
import { EventCard } from '../../components/tourism/EventCard';

export const CalendarPage: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2026, 9, 1)); // Oct 2026 default seed range
  const [events, setEvents] = useState<TourismEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      try {
        const params: any = {};
        if (selectedCategory !== 'ALL') params.category = selectedCategory;

        const res = await api.get('/events', { params });
        if (res.data.success) {
          setEvents(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, [selectedCategory]);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const todayMonth = () => setCurrentMonth(new Date());

  const categories = ['ALL', 'Festival', 'Fair', 'Cultural', 'Religious', 'Arts'];

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-brand-brown/15 pb-6 space-y-2">
        <span className="sub-nav-label text-brand-maroon">CULTURAL CALENDAR</span>
        <h1 className="text-4xl md:text-6xl font-serif text-brand-black">Festivals & Tourism Events</h1>
        <p className="text-base font-serif text-brand-black/75 max-w-2xl leading-relaxed">
          Plan your Bihar journey around historic fairs, sacred festivals, and regional cultural celebrations.
        </p>
      </div>

      {/* Month Navigation & Category Filter Controls */}
      <div className="bg-cream p-5 rounded border border-brand-brown/15 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Month Navigation */}
        <div className="flex items-center space-x-4">
          <button
            onClick={prevMonth}
            className="p-2 border border-brand-brown/20 rounded bg-white hover:bg-cream-light text-brand-black"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="font-serif text-2xl font-semibold text-brand-black min-w-[200px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>

          <button
            onClick={nextMonth}
            className="p-2 border border-brand-brown/20 rounded bg-white hover:bg-cream-light text-brand-black"
            aria-label="Next Month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={todayMonth}
            className="text-xs sub-nav-label px-3 py-2 border border-brand-brown/20 rounded bg-white hover:bg-brand-black hover:text-brand-gold transition-colors"
          >
            TODAY
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs sub-nav-label px-3 py-2 rounded transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-maroon text-white shadow-sm'
                  : 'bg-white text-brand-black border border-brand-brown/15 hover:border-brand-maroon'
              }`}
            >
              {cat === 'ALL' ? 'ALL EVENTS' : cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Event Grid */}
      {loading ? (
        <div className="py-20 text-center text-brand-brown font-serif">Loading cultural calendar...</div>
      ) : events.length === 0 ? (
        <div className="py-20 text-center bg-cream rounded border border-brand-brown/15 p-8 space-y-2">
          <h3 className="font-serif text-2xl text-brand-black">No Events Scheduled</h3>
          <p className="text-sm font-serif text-brand-brown/80">Try selecting another month or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((ev) => (
            <EventCard key={ev.id} event={ev} />
          ))}
        </div>
      )}
    </div>
  );
};
