const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
  center: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  // Risk level auto-calculated or set
  riskLevel: {
    type: String,
    enum: ['low', 'moderate', 'high', 'critical'],
    default: 'low'
  },
  totalCases: { type: Number, default: 0 },
  totalRecovered: { type: Number, default: 0 },
  totalDeaths: { type: Number, default: 0 },
  activeCases: { type: Number, default: 0 },
  population: { type: Number, default: 10000 }
}, { timestamps: true });

areaSchema.index({ city: 1, name: 1 }, { unique: true });
areaSchema.index({ center: '2dsphere' });

module.exports = mongoose.model('Area', areaSchema);
