const Bus = require('../models/Bus.model');
const BusRoute = require('../models/Route.model');
const Booking = require('../models/Booking.model');

// @GET /api/buses/search?from=Delhi&to=Chandigarh&date=2024-01-15
const searchBuses = async (req, res) => {
  try {
    const { from, to, date } = req.query;
    if (!from || !to || !date) return res.status(400).json({ success: false, message: 'from, to, and date are required' });

    const travelDate = new Date(date);
    const dayOfWeek = travelDate.getDay();

    // Find routes matching from/to and running on that day
    const routes = await BusRoute.find({
      fromCity: { $regex: from, $options: 'i' },
      toCity: { $regex: to, $options: 'i' },
      isActive: true,
      $or: [{ travelDays: dayOfWeek }, { travelDays: { $size: 0 } }],
    }).populate('bus');

    // For each route, calculate available seats on that date
    const results = await Promise.all(
      routes
        .filter((r) => r.bus && r.bus.isActive)
        .map(async (route) => {
          // Get bookings for this route on this date to know booked seats
          const bookings = await Booking.find({
            route: route._id,
            travelDate: { $gte: new Date(date), $lt: new Date(new Date(date).getTime() + 86400000) },
            bookingStatus: { $ne: 'cancelled' },
          });
          const bookedSeats = bookings.flatMap((b) => b.selectedSeats);
          const availableSeats = route.bus.totalSeats - bookedSeats.length;

          return {
            route: {
              _id: route._id,
              fromCity: route.fromCity,
              toCity: route.toCity,
              departureTime: route.departureTime,
              arrivalTime: route.arrivalTime,
              duration: route.duration,
              distance: route.distance,
              basePrice: route.basePrice,
            },
            bus: {
              _id: route.bus._id,
              busName: route.bus.busName,
              busNumber: route.bus.busNumber,
              busType: route.bus.busType,
              amenities: route.bus.amenities,
              rating: route.bus.rating,
              totalRatings: route.bus.totalRatings,
              operator: route.bus.operator,
            },
            availableSeats,
            bookedSeats,
            travelDate: date,
          };
        })
    );

    res.json({ success: true, count: results.length, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/buses/:busId/seats?routeId=xxx&date=xxx
const getBusSeats = async (req, res) => {
  try {
    const { busId } = req.params;
    const { routeId, date } = req.query;

    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ success: false, message: 'Bus not found' });

    // Get bookings to mark seats
    const bookings = await Booking.find({
      bus: busId,
      route: routeId,
      travelDate: { $gte: new Date(date), $lt: new Date(new Date(date).getTime() + 86400000) },
      bookingStatus: { $ne: 'cancelled' },
    });

    const bookedSeats = bookings.flatMap((b) => b.selectedSeats);
    const route = await require('../models/Route.model').findById(routeId);
    const pricePerSeat = route ? route.basePrice : 0;

    const seats = bus.seats.map((seat) => ({
      seatNumber: seat.seatNumber,
      seatType: seat.seatType,
      isAvailable: !bookedSeats.includes(seat.seatNumber),
      price: seat.price || pricePerSeat,
    }));

    res.json({ success: true, data: { busId, busName: bus.busName, busType: bus.busType, totalSeats: bus.totalSeats, seats } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/buses — all buses (admin)
const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json({ success: true, count: buses.length, data: buses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/buses/:id
const getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ success: false, message: 'Bus not found' });
    res.json({ success: true, data: bus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/buses (admin)
const createBus = async (req, res) => {
  try {
    const bus = await Bus.create(req.body);
    res.status(201).json({ success: true, data: bus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/buses/:id (admin)
const updateBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!bus) return res.status(404).json({ success: false, message: 'Bus not found' });
    res.json({ success: true, data: bus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/buses/:id (admin)
const deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) return res.status(404).json({ success: false, message: 'Bus not found' });
    res.json({ success: true, message: 'Bus deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { searchBuses, getBusSeats, getAllBuses, getBusById, createBus, updateBus, deleteBus };
