const express = require('express');
const router = express.Router();
const { createReview, getBusReviews, deleteReview } = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, createReview);
router.get('/bus/:busId', getBusReviews);
router.delete('/:id', protect, deleteReview);

module.exports = router;
