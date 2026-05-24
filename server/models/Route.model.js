const mongoose = require('mongoose');

const busRouteSchema = new mongoose.Schema(
  {
    bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
    fromCity: { type: String, required: true, trim: true },
    toCity: { type: String, required: true, trim: true },
    departureTime: { type: String, required: true }, // "08:00 AM"
    arrivalTime: { type: String, required: true },   // "02:00 PM"
    duration: { type: String, required: true },       // "6h 00m"
    distance: { type: Number },                       // km
    basePrice: { type: Number, required: true },
    travelDays: [{ type: Number }], // 0=Sun, 1=Mon ... 6=Sat (runs on these days)
    isActive: { type: Boolean, default: true },
    availableDates: [{ type: Date }], // specific available dates
  },
  { timestamps: true }
);

module.exports = mongoose.model('BusRoute', busRouteSchema);
