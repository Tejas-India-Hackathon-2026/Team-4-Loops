import React, { useState } from 'react';
import { X, Sparkles, Send, Calendar, MapPin, Compass, Utensils, CheckCircle2 } from 'lucide-react';
import api from '../../api/client';
import { AiItineraryResponse } from '../../types';

interface AiTravelCompanionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiTravelCompanionDrawer: React.FC<AiTravelCompanionDrawerProps> = ({ isOpen, onClose }) => {
  const [interests, setInterests] = useState<string[]>(['Buddhist heritage', 'Mithila art']);
  const [duration, setDuration] = useState<number>(3);
  const [startingCity, setStartingCity] = useState<string>('Patna');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AiItineraryResponse | null>(null);

  const availableInterests = [
    'Buddhist heritage',
    'Spiritual & Temples',
    'Mithila art',
    'Wildlife & Nature',
    'Ramayan circuit',
    'Sikh history',
    'Traditional cuisine'
  ];

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/ai/recommend', {
        interests,
        durationDays: duration,
        startingCity
      });

      if (res.data.success) {
        setResult(res.data.data);
      }
    } catch (err) {
      console.error('AI Travel Companion Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end transition-opacity duration-300">
      <div className="bg-cream w-full max-w-xl h-full shadow-2xl overflow-y-auto flex flex-col justify-between p-6 md:p-8 border-l border-brand-brown/20">

        {/* Top Title Bar */}
        <div>
          <div className="flex items-center justify-between border-b border-brand-brown/15 pb-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-brand-black text-brand-gold rounded-full">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-brand-black">SETU AI Companion</h3>
                <p className="text-xs font-sans text-brand-brown/70">Personalized Bihar Concierge & Itinerary Planner</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-brand-black/60 hover:text-brand-black">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form Controls */}
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-xs sub-nav-label text-brand-maroon mb-2">
                1. SELECT YOUR TRAVEL INTERESTS
              </label>
              <div className="flex flex-wrap gap-2">
                {availableInterests.map((interest) => {
                  const active = interests.includes(interest);
                  return (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`text-xs px-3 py-1.5 rounded border transition-all font-sans ${
                        active
                          ? 'bg-brand-maroon text-white border-brand-maroon shadow-sm'
                          : 'bg-white text-brand-black border-brand-brown/20 hover:border-brand-maroon'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sub-nav-label text-brand-maroon mb-2">
                  2. DURATION (DAYS)
                </label>
                <input
                  type="number"
                  min={1}
                  max={14}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full bg-white border border-brand-brown/20 rounded p-2.5 text-sm font-sans text-brand-black focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs sub-nav-label text-brand-maroon mb-2">
                  3. STARTING CITY
                </label>
                <select
                  value={startingCity}
                  onChange={(e) => setStartingCity(e.target.value)}
                  className="w-full bg-white border border-brand-brown/20 rounded p-2.5 text-sm font-sans text-brand-black focus:outline-none focus:border-brand-gold"
                >
                  <option value="Patna">Patna</option>
                  <option value="Bodh Gaya">Bodh Gaya</option>
                  <option value="Darbhanga">Darbhanga</option>
                  <option value="Gaya Ji">Gaya Ji</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-black text-brand-gold font-sans text-xs sub-nav-label tracking-widest rounded hover:bg-brand-maroon hover:text-white transition-all flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <span>CURATING ITINERARY...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>CURATE MY BIHAR JOURNEY</span>
                </>
              )}
            </button>
          </form>

          {/* AI Result View */}
          {result && (
            <div className="mt-8 pt-6 border-t border-brand-brown/20 space-y-6">
              <div className="bg-white p-5 rounded border border-brand-gold/30 shadow-sm">
                <span className="text-[10px] sub-nav-label text-brand-gold uppercase tracking-widest">
                  AI SUGGESTED JOURNEY
                </span>
                <h4 className="font-serif text-2xl text-brand-black font-semibold mt-1">{result.title}</h4>
                <p className="text-sm font-serif text-brand-black/80 mt-2 leading-relaxed">{result.summary}</p>
                <div className="mt-3 flex items-center space-x-4 text-xs font-sans text-brand-maroon">
                  <span className="flex items-center space-x-1"><Calendar className="w-3.5 h-3.5" /> {result.suggestedDuration}</span>
                  <span className="flex items-center space-x-1"><Compass className="w-3.5 h-3.5" /> {result.recommendedCircuits.join(', ')}</span>
                </div>
              </div>

              {/* Day by Day */}
              <div className="space-y-4">
                <h5 className="sub-nav-label text-brand-maroon">DAY-BY-DAY ITINERARY</h5>
                {result.dayByDayItinerary.map((day) => (
                  <div key={day.day} className="bg-white p-4 rounded border border-brand-brown/10 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-brand-black font-serif">
                      <span>DAY {day.day}: {day.title}</span>
                    </div>
                    <ul className="space-y-1 text-xs font-serif text-brand-black/75">
                      {day.activities.map((act, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold flex-shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                    {day.recommendedFood && (
                      <div className="pt-2 border-t border-brand-brown/10 flex items-center space-x-2 text-xs font-sans text-brand-maroon">
                        <Utensils className="w-3.5 h-3.5" />
                        <span>Food Tip: {day.recommendedFood}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Insider Tips */}
              {result.insiderTips && (
                <div className="bg-brand-black text-cream p-4 rounded space-y-2 text-xs font-serif">
                  <span className="sub-nav-label text-brand-gold text-[10px]">LOCAL INSIDER TIPS</span>
                  <ul className="space-y-1">
                    {result.insiderTips.map((tip, idx) => (
                      <li key={idx}>&bull; {tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 pt-4 border-t border-brand-brown/15 text-center text-xs font-sans text-brand-brown/60">
          Powered by Google Gemini 2.5 & SETU Bihar Tourism Data
        </div>

      </div>
    </div>
  );
};
