const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const passengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  seatNumber: { type: String, required: true },
});

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    route: { type: mongoose.Schema.Types.ObjectId, ref: 'BusRoute', required: true },
    bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
    travelDate: { type: Date, required: true },
    passengers: [passengerSchema],
    selectedSeats: [{ type: String }],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    paymentMethod: { type: String, enum: ['stripe', 'razorpay', 'wallet'] },
    paymentId: { type: String },
    bookingStatus: { type: String, enum: ['confirmed', 'cancelled', 'pending'], default: 'pending' },
    contactNumber: { type: String, required: true },
    contactEmail: { type: String },
    cancellationReason: { type: String },
    cancelledAt: { type: Date },
  },
  { timestamps: true }
);

// Generate unique booking ID
bookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    this.bookingId = 'BB' + uuidv4().replace(/-/g, '').substring(0, 10).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
