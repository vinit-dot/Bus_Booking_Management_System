import { createContext, useContext, useState } from 'react';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState({
    route: null,
    bus: null,
    travelDate: null,
    selectedSeats: [],
    passengers: [],
    contactNumber: '',
    contactEmail: '',
    totalAmount: 0,
  });

  const updateBooking = (updates) => setBookingData(prev => ({ ...prev, ...updates }));
  const resetBooking = () => setBookingData({ route: null, bus: null, travelDate: null, selectedSeats: [], passengers: [], contactNumber: '', contactEmail: '', totalAmount: 0 });

  return (
    <BookingContext.Provider value={{ bookingData, updateBooking, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
};
