import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

// Pages
import HomePage        from './pages/HomePage';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import ForgotPassword  from './pages/ForgotPasswordPage';
import ResetPassword   from './pages/ResetPasswordPage';
import SearchPage      from './pages/SearchPage';
import BusListPage     from './pages/BusListPage';
import SeatSelectPage  from './pages/SeatSelectPage';
import PassengerPage   from './pages/PassengerPage';
import PaymentPage     from './pages/PaymentPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import MyBookingsPage  from './pages/MyBookingsPage';
import BookingDetailPage from './pages/BookingDetailPage';
import ProfilePage     from './pages/ProfilePage';

// Admin Pages
import AdminLayout     from './pages/admin/AdminLayout';
import AdminDashboard  from './pages/admin/AdminDashboard';
import AdminBuses      from './pages/admin/AdminBuses';
import AdminRoutes     from './pages/admin/AdminRoutes';
import AdminBookings   from './pages/admin/AdminBookings';
import AdminUsers      from './pages/admin/AdminUsers';

// Guards
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" /></div>;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user?.role === 'admin' ? children : <Navigate to="/" replace />;
};

const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"                    element={<HomePage />} />
      <Route path="/search"              element={<SearchPage />} />
      <Route path="/buses"               element={<BusListPage />} />
      <Route path="/forgot-password"     element={<GuestRoute><ForgotPassword /></GuestRoute>} />
      <Route path="/reset-password/:token" element={<GuestRoute><ResetPassword /></GuestRoute>} />

      {/* Auth */}
      <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      {/* Booking Flow (protected) */}
      <Route path="/seats"       element={<PrivateRoute><SeatSelectPage /></PrivateRoute>} />
      <Route path="/passengers"  element={<PrivateRoute><PassengerPage /></PrivateRoute>} />
      <Route path="/payment"     element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
      <Route path="/booking-success/:id" element={<PrivateRoute><BookingSuccessPage /></PrivateRoute>} />

      {/* User */}
      <Route path="/my-bookings"        element={<PrivateRoute><MyBookingsPage /></PrivateRoute>} />
      <Route path="/bookings/:id"       element={<PrivateRoute><BookingDetailPage /></PrivateRoute>} />
      <Route path="/profile"            element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index       element={<AdminDashboard />} />
        <Route path="buses"    element={<AdminBuses />} />
        <Route path="routes"   element={<AdminRoutes />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="users"    element={<AdminUsers />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <AppRoutes />
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
