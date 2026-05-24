const Booking = require('../models/Booking.model');
const Bus = require('../models/Bus.model');
const BusRoute = require('../models/Route.model');
const { sendEmail } = require('../utils/email.util');
const { generateTicketHTML } = require('../utils/ticket.util');

// @POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { routeId, busId, travelDate, passengers, selectedSeats, contactNumber, contactEmail, paymentMethod } = req.body;

    // Validate seats are still available
    const existingBookings = await Booking.find({
      bus: busId,
      route: routeId,
      travelDate: { $gte: new Date(travelDate), $lt: new Date(new Date(travelDate).getTime() + 86400000) },
      bookingStatus: { $ne: 'cancelled' },
    });
    const bookedSeats = existingBookings.flatMap((b) => b.selectedSeats);
    const conflict = selectedSeats.some((s) => bookedSeats.includes(s));
    if (conflict) return res.status(400).json({ success: false, message: 'One or more selected seats are no longer available' });

    const route = await BusRoute.findById(routeId);
    const totalAmount = route.basePrice * selectedSeats.length;

    const booking = await Booking.create({
      user: req.user._id,
      route: routeId,
      bus: busId,
      travelDate,
      passengers,
      selectedSeats,
      totalAmount,
      contactNumber,
      contactEmail: contactEmail || req.user.email,
      paymentMethod,
      bookingStatus: 'pending',
      paymentStatus: 'pending',
    });

    const populated = await booking.populate([{ path: 'route', populate: { path: 'bus' } }, { path: 'bus' }, { path: 'user', select: 'name email' }]);

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/bookings/my
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('route')
      .populate('bus', 'busName busNumber busType')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/bookings/:id
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('route')
      .populate('bus')
      .populate('user', 'name email phone');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // Only owner or admin can view
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Access denied' });

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Access denied' });
    if (booking.bookingStatus === 'cancelled')
      return res.status(400).json({ success: false, message: 'Booking already cancelled' });

    booking.bookingStatus = 'cancelled';
    booking.cancellationReason = req.body.reason || 'Cancelled by user';
    booking.cancelledAt = new Date();
    await booking.save();

    // Send cancellation email
    await sendEmail({
      to: booking.contactEmail || req.user.email,
      subject: `Booking Cancelled - ${booking.bookingId}`,
      html: `<h2>Booking Cancelled</h2><p>Your booking <strong>${booking.bookingId}</strong> has been cancelled.</p>`,
    }).catch(() => {});

    res.json({ success: true, message: 'Booking cancelled successfully', data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/bookings (admin — all bookings)
const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = status ? { bookingStatus: status } : {};
    const bookings = await Booking.find(filter)
      .populate('user', 'name email')
      .populate('route')
      .populate('bus', 'busName busNumber')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Booking.countDocuments(filter);
    res.json({ success: true, data: bookings, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createBooking, getMyBookings, getBookingById, cancelBooking, getAllBookings };
