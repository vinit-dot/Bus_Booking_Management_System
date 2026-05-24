const BusRoute = require('../models/Route.model');

// @GET /api/routes
const getAllRoutes = async (req, res) => {
  try {
    const routes = await BusRoute.find().populate('bus', 'busName busNumber busType');
    res.json({ success: true, data: routes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/routes/cities — unique city list for search dropdowns
const getCities = async (req, res) => {
  try {
    const fromCities = await BusRoute.distinct('fromCity');
    const toCities = await BusRoute.distinct('toCity');
    const cities = [...new Set([...fromCities, ...toCities])].sort();
    res.json({ success: true, data: cities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/routes/:id
const getRouteById = async (req, res) => {
  try {
    const route = await BusRoute.findById(req.params.id).populate('bus');
    if (!route) return res.status(404).json({ success: false, message: 'Route not found' });
    res.json({ success: true, data: route });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/routes (admin)
const createRoute = async (req, res) => {
  try {
    const route = await BusRoute.create(req.body);
    res.status(201).json({ success: true, data: route });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/routes/:id (admin)
const updateRoute = async (req, res) => {
  try {
    const route = await BusRoute.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('bus');
    if (!route) return res.status(404).json({ success: false, message: 'Route not found' });
    res.json({ success: true, data: route });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/routes/:id (admin)
const deleteRoute = async (req, res) => {
  try {
    await BusRoute.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Route deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllRoutes, getCities, getRouteById, createRoute, updateRoute, deleteRoute };
