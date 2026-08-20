import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AiTravelCompanionDrawer } from './components/ai/AiTravelCompanionDrawer';
import { AppRoutes } from './routes/AppRoutes';

export const App: React.FC = () => {
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen flex flex-col justify-between bg-cream-light font-serif">
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
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
