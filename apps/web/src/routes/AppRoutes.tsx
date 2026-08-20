import React from 'react';
import { Routes, Route } from 'react-router-dom';

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
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
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

      {/* Vendor Dashboard */}
      <Route path="/vendor/*" element={<VendorDashboardPage />} />

      {/* Admin Management */}
      <Route path="/admin/*" element={<AdminDashboardPage />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
