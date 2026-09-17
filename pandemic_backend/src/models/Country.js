const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true, uppercase: true }, // PK, IN, etc.
  center: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
  },
  totalCases: { type: Number, default: 0 },
  totalRecovered: { type: Number, default: 0 },
  totalDeaths: { type: Number, default: 0 },
  activeCases: { type: Number, default: 0 }
}, { timestamps: true });

countrySchema.index({ center: '2dsphere' });

module.exports = mongoose.model('Country', countrySchema);
