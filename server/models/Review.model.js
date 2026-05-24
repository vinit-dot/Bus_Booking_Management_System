const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
    isVerified: { type: Boolean, default: false }, // verified if user actually travelled
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, bus: 1 }, { unique: true }); // One review per bus per user

module.exports = mongoose.model('Review', reviewSchema);
