import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/common/Layout';
import BookingSteps from '../components/booking/BookingSteps';
import { PageSpinner } from '../components/common/Spinner';
import { CheckCircle, Download, Bus, MapPin, Clock, Users, Printer } from 'lucide-react';
import api from '../services/api';

export default function BookingSuccessPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/bookings/${id}`).then(r => setBooking(r.data.data)).finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => window.print();

  if (loading) return <Layout><PageSpinner /></Layout>;
  if (!booking) return <Layout><div className="text-center py-20 text-gray-500">Booking not found.</div></Layout>;

  const { bookingId, route, bus, travelDate, passengers, selectedSeats, totalAmount, paymentStatus } = booking;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <BookingSteps current={4} />

        {/* Success banner */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={44} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-500">Your ticket has been sent to your email</p>
        </div>

        {/* Ticket */}
        <div className="card overflow-hidden mb-6" id="ticket">
          {/* Ticket header */}
          <div className="bg-gradient-to-r from-primary-600 to-red-700 text-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bus size={20} />
                <span className="font-display font-bold">{bus?.busName}</span>
                <span className="text-white/70 text-sm">· {bus?.busType}</span>
              </div>
              <div className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {paymentStatus === 'paid' ? '✓ CONFIRMED' : 'PENDING'}
              </div>
            </div>
          </div>

          {/* Dashed separator */}
          <div className="relative border-t-2 border-dashed border-gray-200 mx-4">
            <div className="absolute -left-7 -top-3.5 w-7 h-7 bg-gray-50 rounded-full border border-gray-100" />
            <div className="absolute -right-7 -top-3.5 w-7 h-7 bg-gray-50 rounded-full border border-gray-100" />
          </div>

          <div className="p-6">
            {/* Route */}
            <div className="flex items-center gap-4 mb-5">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{route?.departureTime}</p>
                <p className="text-sm text-gray-500">{route?.fromCity}</p>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="flex items-center gap-2 w-full">
                  <div className="w-2 h-2 rounded-full bg-primary-500" />
                  <div className="flex-1 h-px bg-gray-300" />
                  <MapPin size={14} className="text-primary-500" />
                </div>
                <p className="text-xs text-gray-400 mt-1">{route?.duration}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{route?.arrivalTime}</p>
                <p className="text-sm text-gray-500">{route?.toCity}</p>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4 text-sm mb-5">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-0.5">Booking ID</p>
                <p className="font-mono font-bold text-gray-900">{bookingId}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-0.5">Travel Date</p>
                <p className="font-semibold text-gray-900">{new Date(travelDate).toDateString()}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-0.5">Seats</p>
                <p className="font-semibold text-gray-900">{selectedSeats?.join(', ')}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-0.5">Total Paid</p>
                <p className="font-bold text-primary-600">₹{totalAmount}</p>
              </div>
            </div>

            {/* Passengers */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users size={13} /> Passengers
              </p>
              <div className="space-y-2">
                {passengers?.map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                    <span className="font-medium text-gray-800">{p.name}</span>
                    <span className="text-gray-500">{p.gender} · {p.age} yrs · Seat {p.seatNumber}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/my-bookings" className="btn-secondary flex-1 text-center">View All Bookings</Link>
          <button onClick={handlePrint} className="btn-outline flex-1 flex items-center justify-center gap-2">
            <Printer size={16} /> Print Ticket
          </button>
          <Link to="/" className="btn-primary flex-1 text-center">Book Another</Link>
        </div>
      </div>
    </Layout>
  );
}
