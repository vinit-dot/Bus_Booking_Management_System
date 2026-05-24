import { useState, useEffect } from 'react';
import { PageSpinner } from '../../components/common/Spinner';
import api from '../../services/api';

const statusColors = {
  confirmed: 'bg-green-100 text-green-700',
  pending:   'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (statusFilter) params.set('status', statusFilter);
    api.get(`/bookings?${params}`)
      .then(r => { setBookings(r.data.data); setTotalPages(r.data.pages || 1); })
      .finally(() => setLoading(false));
  };

  useEffect(fetchBookings, [page, statusFilter]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-500 text-sm">All customer bookings</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? <PageSpinner /> : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    {['Booking ID', 'Passenger', 'Bus', 'Route', 'Date', 'Seats', 'Amount', 'Payment', 'Status'].map(h => (
                      <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.length ? bookings.map(b => (
                    <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{b.bookingId}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{b.user?.name}</p>
                          <p className="text-xs text-gray-400">{b.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{b.bus?.busName}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{b.route?.fromCity} → {b.route?.toCity}</td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{new Date(b.travelDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-gray-600">{b.selectedSeats?.join(', ')}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">₹{b.totalAmount}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${b.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : b.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'} capitalize`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge capitalize ${statusColors[b.bookingStatus] || 'bg-gray-100 text-gray-600'}`}>
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">No bookings found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary text-sm py-1.5 px-4">Prev</button>
              <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary text-sm py-1.5 px-4">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
