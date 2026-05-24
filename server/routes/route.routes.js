const express = require('express');
const router = express.Router();
const { getAllRoutes, getCities, getRouteById, createRoute, updateRoute, deleteRoute } = require('../controllers/route.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/cities', getCities);
router.get('/', getAllRoutes);
router.get('/:id', getRouteById);
router.post('/', protect, adminOnly, createRoute);
router.put('/:id', protect, adminOnly, updateRoute);
router.delete('/:id', protect, adminOnly, deleteRoute);

module.exports = router;
