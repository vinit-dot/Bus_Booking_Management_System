const generateTicketHTML = (booking) => {
  const { bookingId, bus, route, travelDate, passengers, selectedSeats, totalAmount } = booking;
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
        .ticket { border: 2px dashed #e74c3c; border-radius: 12px; padding: 24px; max-width: 600px; margin: auto; }
        .header { background: #e74c3c; color: white; padding: 16px; border-radius: 8px; text-align: center; }
        .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .label { font-weight: bold; color: #666; }
        .badge { background: #27ae60; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="ticket">
        <div class="header">
          <h2>🚌 BusBook — E-Ticket</h2>
          <span class="badge">CONFIRMED</span>
        </div>
        <br/>
        <div class="row"><span class="label">Booking ID</span><span>${bookingId}</span></div>
        <div class="row"><span class="label">Bus</span><span>${bus?.busName} (${bus?.busNumber})</span></div>
        <div class="row"><span class="label">From</span><span>${route?.fromCity}</span></div>
        <div class="row"><span class="label">To</span><span>${route?.toCity}</span></div>
        <div class="row"><span class="label">Date</span><span>${new Date(travelDate).toDateString()}</span></div>
        <div class="row"><span class="label">Departure</span><span>${route?.departureTime}</span></div>
        <div class="row"><span class="label">Arrival</span><span>${route?.arrivalTime}</span></div>
        <div class="row"><span class="label">Seats</span><span>${selectedSeats?.join(', ')}</span></div>
        <div class="row"><span class="label">Passengers</span><span>${passengers?.map(p => p.name).join(', ')}</span></div>
        <div class="row"><span class="label">Total Paid</span><span>₹${totalAmount}</span></div>
        <br/>
        <p style="text-align:center; color:#999; font-size:12px;">Please carry this ticket. Safe travels!</p>
      </div>
    </body>
    </html>
  `;
};

module.exports = { generateTicketHTML };
