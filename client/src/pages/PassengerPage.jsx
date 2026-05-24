import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import BookingSteps from '../components/booking/BookingSteps';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { User, Phone, Mail, ChevronRight, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PassengerPage() {
  const navigate = useNavigate();
  const { bookingData, updateBooking } = useBooking();
  const { user } = useAuth();
  const { selectedSeats, route, bus, totalAmount } = bookingData;

  const [contact, setContact] = useState({ phone: user?.phone || '', email: user?.email || '' });
  const [passengers, setPassengers] = useState(
    selectedSeats.map((seat, i) => ({ name: i === 0 ? user?.name || '' : '', age: '', gender: 'Male', seatNumber: seat }))
  );

  if (!selectedSeats?.length) { navigate('/search'); return null; }

  const updatePassenger = (idx, field, value) => {
    setPassengers(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    for (const p of passengers) {
      if (!p.name.trim() || !p.age || !p.gender) return toast.error('Please fill all passenger details');
      if (p.age < 1 || p.age > 120) return toast.error('Please enter a valid age');
    }
    if (!contact.phone) return toast.error('Contact number is required');
    updateBooking({ passengers, contactNumber: contact.phone, contactEmail: contact.email });
    navigate('/payment');
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <BookingSteps current={2} />

        <form onSubmit={handleSubmit}>
          {/* Journey info */}
          {route && (
            <div className="card p-4 mb-6 bg-primary-50 border-primary-200">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-bold text-gray-900">{route.fromCity} → {route.toCity}</p>
                  <p className="text-gray-500">{route.departureTime} · {bus?.busName}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-600 text-lg">₹{totalAmount}</p>
                  <p className="text-xs text-gray-500">{selectedSeats.length} seat(s)</p>
                </div>
              </div>
            </div>
          )}

          {/* Passengers */}
          <div className="space-y-4 mb-6">
            {passengers.map((p, idx) => (
              <div key={idx} className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</div>
                  <h3 className="font-semibold text-gray-900">Passenger {idx + 1}</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Seat {p.seatNumber}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Full Name *</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" required value={p.name} onChange={e => updatePassenger(idx, 'name', e.target.value)}
                        placeholder="Enter full name" className="input-field pl-8 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Age *</label>
                    <input type="number" required min="1" max="120" value={p.age}
                      onChange={e => updatePassenger(idx, 'age', e.target.value)}
                      placeholder="Age" className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Gender *</label>
                    <select value={p.gender} onChange={e => updatePassenger(idx, 'gender', e.target.value)}
                      className="input-field text-sm">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="card p-5 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Contact Details</h3>
            <p className="text-xs text-gray-500 mb-4">Booking confirmation will be sent here</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Phone Number *</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" required value={contact.phone} onChange={e => setContact(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+91 98765 43210" className="input-field pl-8 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={contact.email} onChange={e => setContact(p => ({ ...p, email: e.target.value }))}
                    placeholder="email@example.com" className="input-field pl-8 text-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-4">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex items-center gap-2">
              <ChevronLeft size={16} /> Back
            </button>
            <button type="submit" className="btn-primary flex items-center gap-2 px-8">
              Proceed to Payment <ChevronRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
