import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { PageSpinner } from '../components/common/Spinner';
import { Ticket, Bus, MapPin, Calendar, ChevronRight, XCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const statusColors = {
  confirmed: 'bg-green-100 text-green-700',
  pending:   'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    api.get('/bookings/my').then(r => setBookings(r.data.data)).finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(id);
    try {
      await api.put(`/bookings/${id}/cancel`, { reason: 'Cancelled by user' });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, bookingStatus: 'cancelled' } : b));
      toast.success('Booking cancelled successfully');
    } catch {
      toast.error('Failed to cancel booking');
    } finally {
      setCancelling(null);
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.bookingStatus === filter);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-500 text-sm">{bookings.length} total booking(s)</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {['all', 'confirmed', 'pending', 'cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors -mb-px
                ${filter === f ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {f}
            </button>
          ))}
        </div>

        {loading ? <PageSpinner /> : filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <Ticket size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No bookings found</h3>
            <p className="text-gray-400 text-sm mb-6">You haven't made any bookings yet</p>
            <Link to="/search" className="btn-primary">Search Buses</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(booking => (
              <div key={booking._id} className="card p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`badge ${statusColors[booking.bookingStatus] || 'bg-gray-100 text-gray-600'} capitalize`}>
                        {booking.bookingStatus}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">{booking.bookingId}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      <Bus size={15} className="text-gray-400" />
                      <span className="font-semibold text-gray-900">{booking.bus?.busName}</span>
                      <span className="text-gray-400">·</span>
                      <span className="text-sm text-gray-500">{booking.bus?.busType}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <MapPin size={13} className="text-gray-400" />
                      <span>{booking.route?.fromCity} → {booking.route?.toCity}</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {new Date(booking.travelDate).toDateString()}
                      </span>
                      <span>{booking.selectedSeats?.length} seat(s): {booking.selectedSeats?.join(', ')}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <p className="text-xl font-bold text-primary-600">₹{booking.totalAmount}</p>
                    <div className="flex gap-2">
                      {booking.bookingStatus !== 'cancelled' && (
                        <button onClick={() => handleCancel(booking._id)} disabled={cancelling === booking._id}
                          className="flex items-center gap-1 text-xs text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                          {cancelling === booking._id ? '...' : <><XCircle size={13} /> Cancel</>}
                        </button>
                      )}
                      <Link to={`/bookings/${booking._id}`}
                        className="flex items-center gap-1 text-xs text-gray-700 border border-gray-200 hover:border-primary-400 hover:text-primary-600 px-3 py-1.5 rounded-lg transition-colors">
                        Details <ChevronRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
