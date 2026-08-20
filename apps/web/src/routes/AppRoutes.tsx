import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { EntryWelcomePage } from '../pages/auth/EntryWelcomePage';
import { HomePage } from '../pages/home/HomePage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { CircuitsListingPage } from '../pages/circuits/CircuitsListingPage';
import { CircuitDetailPage } from '../pages/circuits/CircuitDetailPage';
import { DestinationsListingPage } from '../pages/destinations/DestinationsListingPage';
import { DestinationDetailPage } from '../pages/destinations/DestinationDetailPage';
import { DistrictsListingPage } from '../pages/districts/DistrictsListingPage';
import { DistrictDetailPage } from '../pages/districts/DistrictDetailPage';
import { MapsPage } from '../pages/maps/MapsPage';
import { CalendarPage } from '../pages/calendar/CalendarPage';
import { ExperienceListingPage } from '../pages/experience/ExperienceListingPage';
import { ExperienceDetailPage } from '../pages/experience/ExperienceDetailPage';
import { AccountPage } from '../pages/tourist/AccountPage';
import { VendorDashboardPage } from '../pages/vendor/VendorDashboardPage';
import { LocalVendorDashboardPage } from '../pages/vendor/LocalVendorDashboardPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [entryCompleted, setEntryCompleted] = useState<boolean>(() => {
    return localStorage.getItem('setu_entry_completed') === 'true';
  });

  const handleCompleteEntry = () => {
    setEntryCompleted(true);
  };

  // Allow fresh root visits to show entry welcome screen if entry isn't completed and user is not logged in
  const shouldShowWelcome = !user && !entryCompleted;

  return (
    <Routes>
      <Route
        path="/"
        element={
          shouldShowWelcome ? (
            <EntryWelcomePage onCompleteEntry={handleCompleteEntry} />
          ) : (
            <HomePage />
          )
        }
      />
      <Route path="/welcome" element={<EntryWelcomePage onCompleteEntry={handleCompleteEntry} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Explore Routes */}
      <Route path="/explore/circuits" element={<CircuitsListingPage />} />
      <Route path="/explore/circuits/:slug" element={<CircuitDetailPage />} />

      <Route path="/explore/destinations" element={<DestinationsListingPage />} />
      <Route path="/explore/destinations/:slug" element={<DestinationDetailPage />} />

      <Route path="/explore/districts" element={<DistrictsListingPage />} />
      <Route path="/explore/districts/:slug" element={<DistrictDetailPage />} />

      {/* Interactive Maps */}
      <Route path="/maps" element={<MapsPage />} />

      {/* Calendar & Events */}
      <Route path="/calendar" element={<CalendarPage />} />

      {/* Cultural Experience */}
      <Route path="/experience" element={<ExperienceListingPage />} />
      <Route path="/experience/:category" element={<ExperienceListingPage />} />
      <Route path="/experience/:category/:slug" element={<ExperienceDetailPage />} />

      {/* Tourist Account */}
      <Route path="/account/*" element={<AccountPage />} />

      {/* Vendor Dashboards */}
      <Route path="/vendor/local-dashboard" element={<LocalVendorDashboardPage />} />
      <Route path="/vendor/dashboard" element={<VendorDashboardPage />} />
      <Route path="/vendor/*" element={<VendorDashboardPage />} />

      {/* Admin Management */}
      <Route path="/admin/*" element={<AdminDashboardPage />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
