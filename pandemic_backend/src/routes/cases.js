const express = require('express');
const axios = require('axios');
const CaseReport = require('../models/CaseReport');
const Area = require('../models/Area');
const City = require('../models/City');
const Country = require('../models/Country');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

function calcRisk(activeCases, population) {
  const rate = population > 0 ? (activeCases / population) * 1000 : 0; // per 1000
  if (rate >= 50) return 'critical';
  if (rate >= 20) return 'high';
  if (rate >= 5) return 'moderate';
  return 'low';
}

// Report new cases
router.post('/', protect, authorize('admin', 'health_worker'), async (req, res) => {
  try {
    const { areaId, newCases = 0, recovered = 0, deaths = 0, notes, reportDate } = req.body;

    const area = await Area.findById(areaId);
    if (!area) return res.status(404).json({ message: 'Area not found' });

    const activeDelta = newCases - recovered - deaths;

    const report = await CaseReport.create({
      area: areaId,
      city: area.city,
      country: area.country,
      newCases,
      recovered,
      deaths,
      activeDelta,
      notes,
      reportDate: reportDate || new Date(),
      reportedBy: req.user._id
    });

    // Update area totals
    area.totalCases += newCases;
    area.totalRecovered += recovered;
    area.totalDeaths += deaths;
    area.activeCases = Math.max(0, area.activeCases + activeDelta);
    area.riskLevel = calcRisk(area.activeCases, area.population);
    await area.save();

    // Update city
    const city = await City.findById(area.city);
    if (city) {
      city.totalCases += newCases;
      city.totalRecovered += recovered;
      city.totalDeaths += deaths;
      city.activeCases = Math.max(0, city.activeCases + activeDelta);
      await city.save();
    }

    // Update country
    const country = await Country.findById(area.country);
    if (country) {
      country.totalCases += newCases;
      country.totalRecovered += recovered;
      country.totalDeaths += deaths;
      country.activeCases = Math.max(0, country.activeCases + activeDelta);
      await country.save();
    }

    const populated = await CaseReport.findById(report._id)
      .populate('area', 'name riskLevel')
      .populate('city', 'name')
      .populate('country', 'name')
      .populate('reportedBy', 'name');

    res.status(201).json(populated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// List reports
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.area) filter.area = req.query.area;
    if (req.query.city) filter.city = req.query.city;
    if (req.query.country) filter.country = req.query.country;

    const reports = await CaseReport.find(filter)
      .populate('area', 'name riskLevel')
      .populate('city', 'name')
      .populate('country', 'name code')
      .populate('reportedBy', 'name')
      .sort({ reportDate: -1 })
      .limit(100);

    res.json(reports);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Summary / stats (optionally enriched by Python)
router.get('/summary', async (req, res) => {
  try {
    const countries = await Country.find().sort({ totalCases: -1 });
    const totalCases = countries.reduce((s, c) => s + c.totalCases, 0);
    const totalRecovered = countries.reduce((s, c) => s + c.totalRecovered, 0);
    const totalDeaths = countries.reduce((s, c) => s + c.totalDeaths, 0);
    const activeCases = countries.reduce((s, c) => s + c.activeCases, 0);

    const riskCounts = await Area.aggregate([
      { $group: { _id: '$riskLevel', count: { $sum: 1 } } }
    ]);

    let analytics = null;
    try {
      const areas = await Area.find().select('name activeCases totalCases totalDeaths population riskLevel');
      const pyRes = await axios.post(
        `${process.env.PYTHON_SERVICE_URL || 'http://localhost:8000'}/analyze`,
        {
          areas: areas.map(a => ({
            name: a.name,
            active: a.activeCases,
            total: a.totalCases,
            deaths: a.totalDeaths,
            population: a.population,
            risk: a.riskLevel
          })),
          global: { totalCases, totalRecovered, totalDeaths, activeCases }
        },
        { timeout: 4000 }
      );
      analytics = pyRes.data;
    } catch (err) {
      // Python optional
    }

    res.json({
      global: { totalCases, totalRecovered, totalDeaths, activeCases },
      countries,
      riskCounts,
      analytics
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
