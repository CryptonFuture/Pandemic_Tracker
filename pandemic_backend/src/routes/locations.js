const express = require('express');
const Country = require('../models/Country');
const City = require('../models/City');
const Area = require('../models/Area');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// ========== COUNTRIES ==========
router.get('/countries', async (req, res) => {
  try {
    const countries = await Country.find().sort({ name: 1 });
    res.json(countries);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/countries', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, code, longitude, latitude } = req.body;
    const country = await Country.create({
      name, code,
      center: { type: 'Point', coordinates: [longitude || 0, latitude || 0] }
    });
    res.status(201).json(country);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// ========== CITIES ==========
router.get('/cities', async (req, res) => {
  try {
    const filter = {};
    if (req.query.country) filter.country = req.query.country;
    const cities = await City.find(filter).populate('country', 'name code').sort({ name: 1 });
    res.json(cities);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/cities', protect, authorize('admin', 'health_worker'), async (req, res) => {
  try {
    const { name, countryId, longitude, latitude } = req.body;
    const city = await City.create({
      name,
      country: countryId,
      center: { type: 'Point', coordinates: [longitude || 0, latitude || 0] }
    });
    res.status(201).json(await City.findById(city._id).populate('country', 'name code'));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// ========== AREAS ==========
router.get('/areas', async (req, res) => {
  try {
    const filter = {};
    if (req.query.city) filter.city = req.query.city;
    if (req.query.country) filter.country = req.query.country;
    if (req.query.riskLevel) filter.riskLevel = req.query.riskLevel;

    const areas = await Area.find(filter)
      .populate('city', 'name')
      .populate('country', 'name code')
      .sort({ activeCases: -1 });
    res.json(areas);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/areas/:id', async (req, res) => {
  try {
    const area = await Area.findById(req.params.id)
      .populate('city', 'name')
      .populate('country', 'name code');
    if (!area) return res.status(404).json({ message: 'Area not found' });
    res.json(area);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/areas', protect, authorize('admin', 'health_worker'), async (req, res) => {
  try {
    const { name, cityId, countryId, longitude, latitude, population } = req.body;
    const area = await Area.create({
      name,
      city: cityId,
      country: countryId,
      center: { type: 'Point', coordinates: [longitude || 0, latitude || 0] },
      population: population || 10000
    });
    res.status(201).json(await Area.findById(area._id).populate('city', 'name').populate('country', 'name'));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Map data endpoint - all areas with coordinates for markers
router.get('/map-data', async (req, res) => {
  try {
    const filter = {};
    if (req.query.country) filter.country = req.query.country;
    if (req.query.city) filter.city = req.query.city;

    const areas = await Area.find(filter)
      .populate('city', 'name')
      .populate('country', 'name code')
      .select('name center totalCases activeCases totalRecovered totalDeaths riskLevel population city country');

    res.json(areas);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
