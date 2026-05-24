const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  seatType: { type: String, enum: ['window', 'aisle', 'middle'], default: 'aisle' },
  price: { type: Number },
});

const busSchema = new mongoose.Schema(
  {
    busName: { type: String, required: true, trim: true },
    busNumber: { type: String, required: true, unique: true },
    busType: { type: String, enum: ['AC', 'Non-AC', 'Sleeper', 'Semi-Sleeper', 'Volvo'], required: true },
    totalSeats: { type: Number, required: true, default: 40 },
    seats: [seatSchema],
    amenities: [{ type: String }], // WiFi, USB Charging, etc.
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    operator: {
      name: String,
      contact: String,
      email: String,
    },
  },
  { timestamps: true }
);

// Auto-generate seats when bus is created
busSchema.pre('save', function (next) {
  if (this.isNew && this.seats.length === 0) {
    const seats = [];
    for (let i = 1; i <= this.totalSeats; i++) {
      seats.push({
        seatNumber: `S${i}`,
        isAvailable: true,
        seatType: i % 4 === 1 || i % 4 === 0 ? 'window' : 'aisle',
      });
    }
    this.seats = seats;
  }
  next();
});

module.exports = mongoose.model('Bus', busSchema);
