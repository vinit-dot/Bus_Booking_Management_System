import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/common/Layout';
import SeatMap from '../components/booking/SeatMap';
import BookingSteps from '../components/booking/BookingSteps';
import { PageSpinner } from '../components/common/Spinner';
import { useBooking } from '../context/BookingContext';
import { Clock, MapPin, Bus, ChevronRight } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function SeatSelectPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const routeId = searchParams.get('routeId');
  const busId = searchParams.get('busId');
  const date = searchParams.get('date');

  const { bookingData, updateBooking } = useBooking();
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [pricePerSeat, setPricePerSeat] = useState(0);

  useEffect(() => {
    if (!busId || !routeId || !date) { navigate('/search'); return; }
    api.get(`/buses/${busId}/seats?routeId=${routeId}&date=${date}`)
      .then(res => {
        setSeats(res.data.data.seats);
        const price = res.data.data.seats.find(s => s.price)?.price || bookingData.route?.basePrice || 0;
        setPricePerSeat(price);
      })
      .catch(() => toast.error('Failed to load seat data'))
      .finally(() => setLoading(false));
  }, [busId, routeId, date]);

  const toggleSeat = (seatNum) => {
    setSelectedSeats(prev =>
      prev.includes(seatNum) ? prev.filter(s => s !== seatNum) : prev.length >= 6 ? (toast.error('Max 6 seats per booking'), prev) : [...prev, seatNum]
    );
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) return toast.error('Please select at least one seat');
    updateBooking({ selectedSeats, totalAmount: selectedSeats.length * pricePerSeat });
    navigate('/passengers');
  };

  const { route, bus } = bookingData;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <BookingSteps current={1} />

        {/* Journey summary */}
        {route && (
          <div className="card p-4 mb-6 flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <Bus size={16} className="text-primary-600" />
              <span className="font-semibold">{bus?.busName}</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-500">{bus?.busType}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={14} className="text-gray-400" />
              <span>{route.fromCity} → {route.toCity}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={14} className="text-gray-400" />
              <span>{route.departureTime} – {route.arrivalTime}</span>
            </div>
            <div className="ml-auto text-primary-600 font-bold">₹{pricePerSeat}/seat</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seat map */}
          <div className="lg:col-span-2 card p-6">
            <h2 className="text-lg font-display font-bold text-gray-900 mb-5">Select Your Seats</h2>
            {loading ? <PageSpinner /> : <SeatMap seats={seats} selectedSeats={selectedSeats} onToggle={toggleSeat} />}
          </div>

          {/* Summary */}
          <div className="card p-6 h-fit lg:sticky lg:top-24">
            <h3 className="font-display font-bold text-gray-900 mb-4">Booking Summary</h3>
            {selectedSeats.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No seats selected yet</p>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Selected Seats</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSeats.map(s => (
                      <span key={s} className="bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-0.5 rounded">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>{selectedSeats.length} seat(s) × ₹{pricePerSeat}</span>
                    <span>₹{selectedSeats.length * pricePerSeat}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 text-base border-t pt-2">
                    <span>Total</span>
                    <span className="text-primary-600">₹{selectedSeats.length * pricePerSeat}</span>
                  </div>
                </div>
              </div>
            )}
            <button onClick={handleProceed} disabled={!selectedSeats.length}
              className="btn-primary w-full mt-5 flex items-center justify-center gap-2">
              Continue <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
