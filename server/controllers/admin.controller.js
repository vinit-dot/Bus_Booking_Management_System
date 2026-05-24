const User = require('../models/User.model');
const Bus = require('../models/Bus.model');
const Booking = require('../models/Booking.model');
const BusRoute = require('../models/Route.model');

// @GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalBuses, totalBookings, totalRoutes] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Bus.countDocuments(),
      Booking.countDocuments(),
      BusRoute.countDocuments(),
    ]);

    const revenueData = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);

    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('bus', 'busName')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalBuses,
        totalBookings,
        totalRoutes,
        totalRevenue: revenueData[0]?.totalRevenue || 0,
        recentBookings,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/admin/users/:id/toggle
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getDashboardStats, getAllUsers, toggleUserStatus };
