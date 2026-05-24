import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Bus, Ticket, Route, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import { PageSpinner } from '../../components/common/Spinner';
import api from '../../services/api';

const StatCard = ({ icon, label, value, color, to }) => (
  <Link to={to} className="card p-5 hover:shadow-md transition-shadow group">
    <div className="flex items-center justify-between mb-3">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <TrendingUp size={16} className="text-gray-300 group-hover:text-green-400 transition-colors" />
    </div>
    <p className="text-2xl font-display font-bold text-gray-900">{value ?? '—'}</p>
    <p className="text-sm text-gray-500 mt-0.5">{label}</p>
  </Link>
);

const statusColors = {
  confirmed: 'bg-green-100 text-green-700',
  pending:   'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">Overview of your BusBook platform</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard icon={<Users size={20} className="text-blue-600" />}     label="Total Users"    value={stats?.totalUsers}    color="bg-blue-50"   to="/admin/users" />
        <StatCard icon={<Bus size={20} className="text-purple-600" />}     label="Total Buses"   value={stats?.totalBuses}    color="bg-purple-50" to="/admin/buses" />
        <StatCard icon={<Route size={20} className="text-orange-600" />}   label="Total Routes"  value={stats?.totalRoutes}   color="bg-orange-50" to="/admin/routes" />
        <StatCard icon={<Ticket size={20} className="text-primary-600" />} label="Total Bookings" value={stats?.totalBookings} color="bg-red-50"    to="/admin/bookings" />
        <StatCard icon={<TrendingUp size={20} className="text-green-600" />} label="Total Revenue" value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`} color="bg-green-50" to="/admin/bookings" />
      </div>

      {/* Recent Bookings */}
      <div className="card">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-display font-bold text-gray-900">Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-sm text-primary-600 hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                {['Booking ID', 'Passenger', 'Bus', 'Route', 'Date', 'Amount', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats?.recentBookings?.length ? stats.recentBookings.map(b => (
                <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{b.bookingId}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{b.user?.name}</td>
                  <td className="px-4 py-3 text-gray-600">{b.bus?.busName}</td>
                  <td className="px-4 py-3 text-gray-600">{b.route?.fromCity} → {b.route?.toCity}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(b.travelDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">₹{b.totalAmount}</td>
                  <td className="px-4 py-3">
                    <span className={`badge capitalize ${statusColors[b.bookingStatus] || 'bg-gray-100 text-gray-600'}`}>
                      {b.bookingStatus}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No bookings yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
