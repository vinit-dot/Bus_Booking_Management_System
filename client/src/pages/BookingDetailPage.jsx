import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { PageSpinner } from '../components/common/Spinner';
import { ArrowLeft, Printer, Star } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function BookingDetailPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    api.get(`/bookings/${id}`).then(r => setBooking(r.data.data)).finally(() => setLoading(false));
  }, [id]);

  const submitReview = async () => {
    try {
      await api.post('/reviews', { busId: booking.bus._id, bookingId: booking._id, ...review });
      toast.success('Review submitted!');
      setReviewSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <Layout><PageSpinner /></Layout>;
  if (!booking) return <Layout><div className="text-center py-20 text-gray-500">Booking not found.</div></Layout>;

  const { bookingId, route, bus, travelDate, passengers, selectedSeats, totalAmount, paymentStatus, bookingStatus, paymentMethod } = booking;

  const statusColor = { confirmed: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', cancelled: 'bg-red-100 text-red-700' };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/my-bookings" className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm">
            <ArrowLeft size={16} /> My Bookings
          </Link>
        </div>

        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-display font-bold text-gray-900">Booking Details</h1>
          <button onClick={() => window.print()} className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 hover:border-gray-300 px-3 py-2 rounded-lg">
            <Printer size={15} /> Print
          </button>
        </div>

        {/* Status */}
        <div className="card p-5 mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">Booking ID</p>
            <p className="font-mono font-bold text-lg text-gray-900">{bookingId}</p>
          </div>
          <span className={`badge text-sm px-3 py-1 ${statusColor[bookingStatus] || 'bg-gray-100 text-gray-600'} capitalize`}>{bookingStatus}</span>
        </div>

        {/* Journey Info */}
        <div className="card p-5 mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">Journey Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              ['Bus', `${bus?.busName} (${bus?.busNumber})`],
              ['Bus Type', bus?.busType],
              ['From', route?.fromCity],
              ['To', route?.toCity],
              ['Departure', route?.departureTime],
              ['Arrival', route?.arrivalTime],
              ['Duration', route?.duration],
              ['Travel Date', new Date(travelDate).toDateString()],
              ['Seats', selectedSeats?.join(', ')],
              ['Payment', `₹${totalAmount} · ${paymentStatus} · ${paymentMethod}`],
            ].map(([label, value]) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className="font-medium text-gray-800 capitalize">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Passengers */}
        <div className="card p-5 mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">Passengers</h2>
          <div className="divide-y divide-gray-100">
            {passengers?.map((p, i) => (
              <div key={i} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-gray-800">{p.name}</p>
                  <p className="text-gray-500">{p.gender} · {p.age} years</p>
                </div>
                <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-2.5 py-1 rounded">{p.seatNumber}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review (only for confirmed past bookings) */}
        {bookingStatus === 'confirmed' && !reviewSubmitted && (
          <div className="card p-5 mb-4">
            <h2 className="font-semibold text-gray-900 mb-3">Rate Your Journey</h2>
            <div className="flex items-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button" onClick={() => setReview(p => ({ ...p, rating: star }))}
                  className="transition-transform hover:scale-110">
                  <Star size={24} className={star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                </button>
              ))}
              <span className="text-sm text-gray-500 ml-2">{review.rating}/5</span>
            </div>
            <textarea value={review.comment} onChange={e => setReview(p => ({ ...p, comment: e.target.value }))}
              placeholder="Share your experience..." rows={3}
              className="input-field text-sm resize-none mb-3" />
            <button onClick={submitReview} className="btn-primary text-sm py-2">Submit Review</button>
          </div>
        )}
        {reviewSubmitted && (
          <div className="card p-4 mb-4 bg-green-50 border-green-200 text-green-700 text-sm">
            ✓ Thank you for your review!
          </div>
        )}

        <Link to="/my-bookings" className="btn-secondary flex items-center gap-2 justify-center w-full">
          <ArrowLeft size={15} /> Back to My Bookings
        </Link>
      </div>
    </Layout>
  );
}
