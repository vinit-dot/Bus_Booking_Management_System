import { Monitor } from 'lucide-react';

const SeatLegend = () => (
  <div className="flex items-center gap-5 text-xs text-gray-600 flex-wrap">
    {[
      { color: 'bg-gray-100 border-gray-300', label: 'Available' },
      { color: 'bg-primary-100 border-primary-500', label: 'Selected' },
      { color: 'bg-red-100 border-red-300', label: 'Booked' },
      { color: 'bg-purple-100 border-purple-300', label: 'Ladies' },
    ].map(({ color, label }) => (
      <div key={label} className="flex items-center gap-1.5">
        <div className={`w-5 h-5 rounded border-2 ${color}`} />
        <span>{label}</span>
      </div>
    ))}
  </div>
);

export default function SeatMap({ seats, selectedSeats, onToggle, busType }) {
  if (!seats?.length) return <p className="text-gray-500 text-center py-8">No seat data available.</p>;

  // Group seats into rows of 4 (2 + aisle + 2)
  const rows = [];
  for (let i = 0; i < seats.length; i += 4) {
    rows.push(seats.slice(i, i + 4));
  }

  const isSelected = (seatNum) => selectedSeats.includes(seatNum);

  const getSeatStyle = (seat) => {
    if (!seat.isAvailable) return 'bg-red-50 border-red-300 text-red-400 cursor-not-allowed';
    if (isSelected(seat.seatNumber)) return 'bg-primary-100 border-primary-500 text-primary-700 shadow-sm';
    return 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-primary-50 hover:border-primary-400 cursor-pointer';
  };

  return (
    <div className="space-y-5">
      <SeatLegend />

      {/* Bus front indicator */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 bg-gray-100 px-4 py-1.5 rounded-full">
          <Monitor size={14} />
          <span>Driver / Front of Bus</span>
        </div>

        {/* Seat grid */}
        <div className="bg-gray-50 rounded-xl p-4 border border-dashed border-gray-300 w-full max-w-sm mx-auto">
          <div className="space-y-2">
            {rows.map((row, ri) => (
              <div key={ri} className="flex items-center gap-1">
                <span className="text-xs text-gray-400 w-5 text-center flex-shrink-0">{ri + 1}</span>
                {/* Left pair */}
                <div className="flex gap-1">
                  {row.slice(0, 2).map((seat, si) => seat ? (
                    <button
                      key={seat.seatNumber}
                      type="button"
                      disabled={!seat.isAvailable}
                      onClick={() => seat.isAvailable && onToggle(seat.seatNumber)}
                      className={`seat-btn w-10 h-10 rounded-lg border-2 text-xs font-semibold transition-all ${getSeatStyle(seat)}`}
                      title={`${seat.seatNumber} - ₹${seat.price}`}
                    >
                      {seat.seatNumber.replace('S', '')}
                    </button>
                  ) : <div key={si} className="w-10 h-10" />)}
                </div>

                {/* Aisle */}
                <div className="w-5 flex-shrink-0" />

                {/* Right pair */}
                <div className="flex gap-1">
                  {row.slice(2, 4).map((seat, si) => seat ? (
                    <button
                      key={seat.seatNumber}
                      type="button"
                      disabled={!seat.isAvailable}
                      onClick={() => seat.isAvailable && onToggle(seat.seatNumber)}
                      className={`seat-btn w-10 h-10 rounded-lg border-2 text-xs font-semibold transition-all ${getSeatStyle(seat)}`}
                      title={`${seat.seatNumber} - ₹${seat.price}`}
                    >
                      {seat.seatNumber.replace('S', '')}
                    </button>
                  ) : <div key={si} className="w-10 h-10" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
