import React, { useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LanguageProvider } from './context/LanguageContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AiTravelCompanionDrawer } from './components/ai/AiTravelCompanionDrawer';
import { AppRoutes } from './routes/AppRoutes';

const AppContent: React.FC = () => {
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const location = useLocation();

  const pathname = location.pathname;
  let bgImage = '/tourist.jpeg';
  if (pathname.startsWith('/vendor')) {
    bgImage = '/vendor.jpeg';
  } else if (pathname === '/login' || pathname === '/register') {
    bgImage = '/login.jpeg';
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-between font-serif bg-cover bg-center bg-fixed transition-all duration-700"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      <Header onOpenAi={() => setAiDrawerOpen(true)} />
      <main className="flex-grow">
        <AppRoutes />
      </main>
      <Footer />
      <AiTravelCompanionDrawer
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <AppContent />
          </Router>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
