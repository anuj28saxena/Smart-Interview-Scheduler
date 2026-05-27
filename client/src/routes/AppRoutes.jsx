import { Route, Routes } from 'react-router-dom';
import { AuthPage } from '../pages/AuthPage';
import { BookingsPage } from '../pages/BookingsPage';
import { DashboardPage } from '../pages/DashboardPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { SlotsPage } from '../pages/SlotsPage';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/slots" element={<ProtectedRoute role="recruiter"><SlotsPage /></ProtectedRoute>} />
      <Route path="/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
    </Routes>
  );
}
