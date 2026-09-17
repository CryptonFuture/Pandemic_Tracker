const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
  center: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  totalCases: { type: Number, default: 0 },
  totalRecovered: { type: Number, default: 0 },
  totalDeaths: { type: Number, default: 0 },
  activeCases: { type: Number, default: 0 }
}, { timestamps: true });

citySchema.index({ country: 1, name: 1 }, { unique: true });
citySchema.index({ center: '2dsphere' });

module.exports = mongoose.model('City', citySchema);
