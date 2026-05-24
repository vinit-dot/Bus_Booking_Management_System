const Review = require('../models/Review.model');
const Bus = require('../models/Bus.model');

// @POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { busId, bookingId, rating, comment } = req.body;
    const existing = await Review.findOne({ user: req.user._id, bus: busId });
    if (existing) return res.status(400).json({ success: false, message: 'You have already reviewed this bus' });

    const review = await Review.create({ user: req.user._id, bus: busId, booking: bookingId, rating, comment, isVerified: !!bookingId });

    // Update bus rating
    const allReviews = await Review.find({ bus: busId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Bus.findByIdAndUpdate(busId, { rating: avgRating.toFixed(1), totalRatings: allReviews.length });

    const populated = await review.populate('user', 'name');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/reviews/bus/:busId
const getBusReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ bus: req.params.busId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Access denied' });
    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createReview, getBusReviews, deleteReview };
