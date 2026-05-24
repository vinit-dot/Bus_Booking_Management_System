/**
 * Seed Script — populates the database with sample buses, routes, and an admin user
 * Run: node server/seed.js
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User    = require('./models/User.model');
const Bus     = require('./models/Bus.model');
const BusRoute = require('./models/Route.model');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/busbook';

const buses = [
  { busName: 'Volvo Gold Express', busNumber: 'HR-26-AA-1234', busType: 'Volvo', totalSeats: 40, amenities: ['WiFi', 'USB Charging', 'AC', 'Blanket'], operator: { name: 'GoGo Travels', contact: '9876543210', email: 'gogo@example.com' } },
  { busName: 'Green Line AC', busNumber: 'PB-10-BB-5678', busType: 'AC', totalSeats: 44, amenities: ['AC', 'USB Charging'], operator: { name: 'Green Line', contact: '9123456789', email: 'greenline@example.com' } },
  { busName: 'Royal Sleeper', busNumber: 'DL-01-CC-9012', busType: 'Sleeper', totalSeats: 36, amenities: ['AC', 'Blanket', 'Reading Light'], operator: { name: 'Royal Travels', contact: '9988776655', email: 'royal@example.com' } },
  { busName: 'City Express', busNumber: 'MH-12-DD-3456', busType: 'Non-AC', totalSeats: 48, amenities: [], operator: { name: 'City Bus Co.', contact: '9001234567', email: 'city@example.com' } },
  { busName: 'Semi Comfort Plus', busNumber: 'KA-01-EE-7890', busType: 'Semi-Sleeper', totalSeats: 40, amenities: ['AC', 'USB Charging', 'Meals'], operator: { name: 'Comfort Travels', contact: '8800112233', email: 'comfort@example.com' } },
];

const routes = (busIds) => [
  { bus: busIds[0], fromCity: 'Delhi', toCity: 'Chandigarh', departureTime: '07:00 AM', arrivalTime: '11:30 AM', duration: '4h 30m', distance: 275, basePrice: 450, travelDays: [] },
  { bus: busIds[0], fromCity: 'Delhi', toCity: 'Chandigarh', departureTime: '10:00 PM', arrivalTime: '02:30 AM', duration: '4h 30m', distance: 275, basePrice: 500, travelDays: [] },
  { bus: busIds[1], fromCity: 'Chandigarh', toCity: 'Delhi', departureTime: '06:00 AM', arrivalTime: '10:30 AM', duration: '4h 30m', distance: 275, basePrice: 450, travelDays: [] },
  { bus: busIds[2], fromCity: 'Mumbai', toCity: 'Pune', departureTime: '08:00 AM', arrivalTime: '11:30 AM', duration: '3h 30m', distance: 150, basePrice: 300, travelDays: [] },
  { bus: busIds[3], fromCity: 'Mumbai', toCity: 'Pune', departureTime: '05:00 PM', arrivalTime: '08:30 PM', duration: '3h 30m', distance: 150, basePrice: 250, travelDays: [] },
  { bus: busIds[2], fromCity: 'Bangalore', toCity: 'Hyderabad', departureTime: '09:00 PM', arrivalTime: '07:00 AM', duration: '10h', distance: 570, basePrice: 850, travelDays: [] },
  { bus: busIds[4], fromCity: 'Chennai', toCity: 'Coimbatore', departureTime: '10:00 PM', arrivalTime: '04:00 AM', duration: '6h', distance: 500, basePrice: 600, travelDays: [] },
  { bus: busIds[1], fromCity: 'Delhi', toCity: 'Agra', departureTime: '07:30 AM', arrivalTime: '11:00 AM', duration: '3h 30m', distance: 230, basePrice: 350, travelDays: [] },
  { bus: busIds[3], fromCity: 'Kolkata', toCity: 'Siliguri', departureTime: '08:00 PM', arrivalTime: '04:00 AM', duration: '8h', distance: 600, basePrice: 700, travelDays: [] },
  { bus: busIds[4], fromCity: 'Hyderabad', toCity: 'Bangalore', departureTime: '10:00 PM', arrivalTime: '08:00 AM', duration: '10h', distance: 570, basePrice: 800, travelDays: [] },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([User.deleteMany(), Bus.deleteMany(), BusRoute.deleteMany()]);
    console.log('🗑  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@busbook.com',
      password: 'admin123',
      phone: '9999999999',
      role: 'admin',
    });
    console.log(`👤 Admin created: admin@busbook.com / admin123`);

    // Create sample user
    await User.create({ name: 'Rajesh Kumar', email: 'user@busbook.com', password: 'user1234', phone: '9876543210', role: 'user' });
    console.log(`👤 Sample user: user@busbook.com / user1234`);

    // Create buses
    const createdBuses = await Bus.insertMany(buses);
    console.log(`🚌 Created ${createdBuses.length} buses`);

    // Create routes
    const busIds = createdBuses.map(b => b._id);
    await BusRoute.insertMany(routes(busIds));
    console.log(`🛣  Created routes`);

    console.log('\n✅ Seed completed!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin Login:   admin@busbook.com / admin123');
    console.log('User Login:    user@busbook.com / user1234');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
