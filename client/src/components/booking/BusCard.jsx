import { useNavigate } from 'react-router-dom';
import { Clock, Users, Star, Wifi, Zap, Wind, Coffee, ArrowRight } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

const amenityIcons = { WiFi: <Wifi size={13} />, 'USB Charging': <Zap size={13} />, AC: <Wind size={13} />, Meals: <Coffee size={13} /> };

const busTypeColors = {
  'AC':           'bg-blue-100 text-blue-700',
  'Non-AC':       'bg-gray-100 text-gray-700',
  'Sleeper':      'bg-purple-100 text-purple-700',
  'Semi-Sleeper': 'bg-indigo-100 text-indigo-700',
  'Volvo':        'bg-green-100 text-green-700',
};

export default function BusCard({ result, travelDate }) {
  const { route, bus, availableSeats } = result;
  const { updateBooking } = useBooking();
  const navigate = useNavigate();

  const handleSelect = () => {
    updateBooking({ route, bus, travelDate, selectedSeats: [], passengers: [], totalAmount: 0 });
    navigate(`/seats?routeId=${route._id}&busId=${bus._id}&date=${travelDate}`);
  };

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display font-bold text-gray-900">{bus.busName}</h3>
              <span className={`badge ${busTypeColors[bus.busType] || 'bg-gray-100 text-gray-600'}`}>{bus.busType}</span>
            </div>
            <p className="text-xs text-gray-500">{bus.busNumber} · Operated by {bus.operator?.name || bus.busName}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-display font-bold text-primary-600">₹{route.basePrice}</p>
            <p className="text-xs text-gray-500">per seat</p>
          </div>
        </div>

        {/* Journey times */}
        <div className="flex items-center gap-4 mb-4">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{route.departureTime}</p>
            <p className="text-xs text-gray-500">{route.fromCity}</p>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <p className="text-xs text-gray-400 mb-1">{route.duration}</p>
            <div className="w-full flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary-600 flex-shrink-0" />
              <div className="flex-1 h-px bg-gray-300 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-gray-300" />
              </div>
              <ArrowRight size={14} className="text-gray-400 flex-shrink-0" />
            </div>
            {route.distance && <p className="text-xs text-gray-400 mt-1">{route.distance} km</p>}
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{route.arrivalTime}</p>
            <p className="text-xs text-gray-500">{route.toCity}</p>
          </div>
        </div>

        {/* Bottom info */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4">
            {/* Rating */}
            {bus.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star size={13} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-semibold text-gray-700">{Number(bus.rating).toFixed(1)}</span>
                <span className="text-xs text-gray-400">({bus.totalRatings})</span>
              </div>
            )}
            {/* Seats */}
            <div className="flex items-center gap-1">
              <Users size={13} className="text-gray-400" />
              <span className={`text-xs font-semibold ${availableSeats < 5 ? 'text-red-600' : 'text-gray-600'}`}>
                {availableSeats} seats left
              </span>
            </div>
            {/* Amenities */}
            <div className="hidden sm:flex items-center gap-1.5">
              {bus.amenities?.slice(0, 3).map(a => (
                <span key={a} className="flex items-center gap-1 bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded text-xs" title={a}>
                  {amenityIcons[a] || null} {a}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={handleSelect}
            disabled={availableSeats === 0}
            className="btn-primary py-2 px-5 text-sm disabled:opacity-50"
          >
            {availableSeats === 0 ? 'Sold Out' : 'Select Seats'}
          </button>
        </div>
      </div>
    </div>
  );
}
