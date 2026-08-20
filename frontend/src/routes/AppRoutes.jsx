import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import LandingPage from '../components/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DriverRegisterPage from '../pages/auth/DriverRegisterPage';

// Rider Pages
import RiderDashboard from '../pages/rider/RiderDashboard';
import BookRidePage from '../pages/rider/BookRidePage';
import RideHistoryPage from '../pages/rider/RideHistoryPage';
import ProfilePage from '../pages/rider/ProfilePage';
import NotificationsPage from '../pages/rider/NotificationsPage';

// Driver Pages
import DriverDashboard from '../pages/driver/DriverDashboard';
import VehiclePage from '../pages/driver/VehiclePage';
import DriverEarnings from '../pages/driver/DriverEarnings';
import DriverDocuments from '../pages/driver/DriverDocuments';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import UsersPage from '../pages/admin/UsersPage';
import DriversPage from '../pages/admin/DriversPage';
import RidesPage from '../pages/admin/RidesPage';
import SettingsPage from '../pages/admin/SettingsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/driver/register" element={<DriverRegisterPage />} />

      {/* Rider Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_RIDER']} />}>
        <Route path="/rider" element={<RiderDashboard />} />
        <Route path="/rider/book" element={<BookRidePage />} />
        <Route path="/rider/history" element={<RideHistoryPage />} />
        <Route path="/rider/profile" element={<ProfilePage />} />
        <Route path="/rider/notifications" element={<NotificationsPage />} />
      </Route>

      {/* Driver Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_DRIVER', 'ROLE_ADMIN']} />}>
        <Route path="/driver" element={<DriverDashboard />} />
        <Route path="/driver/vehicles" element={<VehiclePage />} />
        <Route path="/driver/earnings" element={<DriverEarnings />} />
        <Route path="/driver/documents" element={<DriverDocuments />} />
        <Route path="/driver/history" element={<RideHistoryPage />} />
        <Route path="/driver/notifications" element={<NotificationsPage />} />
        <Route path="/driver/profile" element={<ProfilePage />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/drivers" element={<DriversPage />} />
        <Route path="/admin/vehicles" element={<VehiclePage />} />
        <Route path="/admin/rides" element={<RidesPage />} />
        <Route path="/admin/rides/active" element={<RidesPage />} />
        <Route path="/admin/notifications" element={<NotificationsPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
