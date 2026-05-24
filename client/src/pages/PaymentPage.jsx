import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import BookingSteps from '../components/booking/BookingSteps';
import { useBooking } from '../context/BookingContext';
import { CreditCard, Smartphone, ChevronLeft, Lock, CheckCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function PaymentPage() {
  const navigate = useNavigate();
  const { bookingData, resetBooking } = useBooking();
  const [payMethod, setPayMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);

  const { route, bus, selectedSeats, passengers, contactNumber, contactEmail, totalAmount, travelDate } = bookingData;

  if (!passengers?.length) { navigate('/search'); return null; }

  const handlePay = async () => {
    setLoading(true);
    try {
      // 1. Create booking
      const bookingRes = await api.post('/bookings', {
        routeId: route._id,
        busId: bus._id,
        travelDate,
        passengers,
        selectedSeats,
        contactNumber,
        contactEmail,
        paymentMethod: payMethod,
        totalAmount,
      });
      const booking = bookingRes.data.data;

      if (payMethod === 'razorpay') {
        // 2. Create Razorpay order
        const orderRes = await api.post('/payments/razorpay/create-order', { bookingId: booking._id });
        const { order, key } = orderRes.data;

        const options = {
          key,
          amount: order.amount,
          currency: 'INR',
          name: 'BusBook',
          description: `Booking ${booking.bookingId}`,
          order_id: order.id,
          handler: async (response) => {
            await api.post('/payments/razorpay/verify', {
              bookingId: booking._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success('Payment successful!');
            resetBooking();
            navigate(`/booking-success/${booking._id}`);
          },
          prefill: { contact: contactNumber, email: contactEmail },
          theme: { color: '#e51d1d' },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', () => toast.error('Payment failed. Please try again.'));
        rzp.open();
      } else {
        // Simulate Stripe (demo mode)
        await new Promise(r => setTimeout(r, 1500));
        await api.post('/payments/stripe/confirm', { bookingId: booking._id, paymentIntentId: 'pi_demo_' + Date.now() });
        toast.success('Payment successful!');
        resetBooking();
        navigate(`/booking-success/${booking._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <BookingSteps current={3} />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Payment options */}
          <div className="md:col-span-3 space-y-4">
            <div className="card p-5">
              <h2 className="font-display font-bold text-gray-900 mb-4">Choose Payment Method</h2>
              {[
                { id: 'razorpay', label: 'Razorpay', sub: 'UPI, Cards, Net Banking, Wallets', icon: <Smartphone size={20} /> },
                { id: 'stripe', label: 'Stripe (Cards)', sub: 'Credit / Debit Card', icon: <CreditCard size={20} /> },
              ].map(m => (
                <label key={m.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all mb-3
                  ${payMethod === m.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value={m.id} checked={payMethod === m.id} onChange={e => setPayMethod(e.target.value)} className="hidden" />
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${payMethod === m.id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {m.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{m.label}</p>
                    <p className="text-xs text-gray-500">{m.sub}</p>
                  </div>
                  {payMethod === m.id && <CheckCircle size={18} className="text-primary-600 ml-auto" />}
                </label>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 px-1">
              <Lock size={12} className="text-green-500" />
              Your payment is 100% secure and encrypted
            </div>
          </div>

          {/* Order summary */}
          <div className="md:col-span-2">
            <div className="card p-5 sticky top-24">
              <h3 className="font-display font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm mb-4">
                <div className="pb-3 border-b border-gray-100">
                  <p className="font-semibold">{route?.fromCity} → {route?.toCity}</p>
                  <p className="text-gray-500 text-xs">{bus?.busName} · {travelDate}</p>
                </div>
                <div className="space-y-1 text-gray-600">
                  {selectedSeats.map((s, i) => (
                    <div key={s} className="flex justify-between">
                      <span>Seat {s} — {passengers[i]?.name}</span>
                      <span>₹{route?.basePrice}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-primary-600">₹{totalAmount}</span>
                </div>
              </div>

              <button onClick={handlePay} disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <Lock size={15} />}
                {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
              </button>

              <button onClick={() => navigate(-1)} className="w-full text-sm text-gray-500 hover:text-gray-700 mt-3 flex items-center justify-center gap-1">
                <ChevronLeft size={14} /> Back to passengers
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
