import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/client';
import { Order, Favorite } from '../../types';
import { User, Calendar, CreditCard, Heart, LogOut, Ticket, CheckCircle2 } from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'bookings' | 'profile' | 'favorites'>('bookings');
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      try {
        const [ordRes, favRes] = await Promise.all([
          api.get('/orders'),
          api.get('/favorites')
        ]);
        if (ordRes.data.success) setOrders(ordRes.data.data);
        if (favRes.data.success) setFavorites(favRes.data.data);
      } catch (err) {
        console.error('Error loading account data:', err);
      } finally {
        setLoading(false);
      }
    }
    if (user) loadUserData();
  }, [user]);

  if (!user) {
    return (
      <div className="pt-32 pb-24 text-center space-y-4">
        <h2 className="text-3xl font-serif text-brand-black">Please Sign In</h2>
        <p className="text-sm font-serif text-brand-brown">You need to be authenticated to view your account dashboard.</p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto space-y-8">
      {/* Account Profile Header */}
      <div className="bg-cream p-8 rounded border border-brand-brown/15 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center space-x-5">
          <div className="w-16 h-16 rounded-full bg-brand-brown text-cream flex items-center justify-center font-serif text-2xl font-bold border-2 border-brand-gold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-serif text-brand-black">{user.name}</h1>
            <p className="text-xs font-sans text-brand-brown/80">{user.email} &bull; Role: <span className="font-semibold text-brand-maroon">{user.role}</span></p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center space-x-2 text-xs sub-nav-label px-4 py-2.5 bg-brand-black text-brand-gold rounded hover:bg-brand-maroon hover:text-white transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>SIGN OUT</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-brand-brown/15 space-x-8">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`py-3 sub-nav-label text-xs tracking-widest border-b-2 transition-all ${
            activeTab === 'bookings' ? 'border-brand-maroon text-brand-black font-bold' : 'border-transparent text-brand-black/60'
          }`}
        >
          MY BOOKINGS ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`py-3 sub-nav-label text-xs tracking-widest border-b-2 transition-all ${
            activeTab === 'favorites' ? 'border-brand-maroon text-brand-black font-bold' : 'border-transparent text-brand-black/60'
          }`}
        >
          SAVED FAVORITES ({favorites.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3 sub-nav-label text-xs tracking-widest border-b-2 transition-all ${
            activeTab === 'profile' ? 'border-brand-maroon text-brand-black font-bold' : 'border-transparent text-brand-black/60'
          }`}
        >
          PROFILE SETTINGS
        </button>
      </div>

      {/* Tab Panel */}
      <div>
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {loading ? (
              <p className="font-serif text-brand-brown text-center py-10">Loading bookings...</p>
            ) : orders.length === 0 ? (
              <div className="bg-white p-12 text-center rounded border border-brand-brown/15 space-y-3">
                <Ticket className="w-10 h-10 text-brand-gold mx-auto" />
                <h3 className="font-serif text-xl text-brand-black">No Active Bookings</h3>
                <p className="text-xs font-serif text-brand-brown/70">Explore tourist offerings and book guided Bihar tours.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white p-6 rounded border border-brand-brown/15 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-xs text-brand-maroon font-bold">{order.orderNumber}</span>
                        <span className={`text-[10px] sub-nav-label px-2.5 py-0.5 rounded ${
                          order.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.paymentStatus}
                        </span>
                        <span className="text-[10px] sub-nav-label px-2.5 py-0.5 rounded bg-cream text-brand-black">
                          {order.orderStatus}
                        </span>
                      </div>
                      <h4 className="font-serif text-xl text-brand-black font-semibold">{order.offering?.title || 'Tour Experience'}</h4>
                      <p className="text-xs font-sans text-brand-brown">Vendor: {order.vendor?.businessName || 'Setu Heritage'} &bull; Date: {new Date(order.bookingDate).toLocaleDateString()}</p>
                    </div>

                    <div className="text-right space-y-1">
                      <span className="font-serif text-2xl font-bold text-brand-black">₹{order.amount.toLocaleString('en-IN')}</span>
                      <span className="block text-[10px] sub-nav-label text-brand-brown/70">{order.quantity} Guest(s)</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.length === 0 ? (
              <div className="col-span-full bg-white p-12 text-center rounded border border-brand-brown/15 space-y-2">
                <Heart className="w-8 h-8 text-brand-maroon mx-auto" />
                <p className="text-sm font-serif text-brand-brown">No saved destinations in your favorites list yet.</p>
              </div>
            ) : (
              favorites.map((fav) => (
                <div key={fav.id} className="bg-white p-5 rounded border border-brand-brown/15 space-y-2">
                  <h4 className="font-serif text-lg font-semibold text-brand-black">{fav.destination?.name}</h4>
                  <p className="text-xs font-sans text-brand-brown">{fav.destination?.category}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white p-8 rounded border border-brand-brown/15 max-w-xl space-y-6">
            <h3 className="sub-nav-label text-brand-maroon">PERSONAL INFORMATION</h3>
            <div className="space-y-4 text-sm font-sans">
              <div>
                <label className="block text-xs sub-nav-label text-brand-black/70 mb-1">FULL NAME</label>
                <input type="text" readOnly value={user.name} className="w-full bg-cream p-3 rounded text-brand-black font-semibold border border-brand-brown/15" />
              </div>
              <div>
                <label className="block text-xs sub-nav-label text-brand-black/70 mb-1">EMAIL ADDRESS</label>
                <input type="email" readOnly value={user.email} className="w-full bg-cream p-3 rounded text-brand-black font-semibold border border-brand-brown/15" />
              </div>
              <div>
                <label className="block text-xs sub-nav-label text-brand-black/70 mb-1">PHONE NUMBER</label>
                <input type="text" readOnly value={user.phone || 'Not set'} className="w-full bg-cream p-3 rounded text-brand-black font-semibold border border-brand-brown/15" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
