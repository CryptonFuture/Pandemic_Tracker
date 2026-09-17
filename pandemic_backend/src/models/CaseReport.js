const mongoose = require('mongoose');

const caseReportSchema = new mongoose.Schema({
  area: { type: mongoose.Schema.Types.ObjectId, ref: 'Area', required: true },
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
  reportDate: { type: Date, default: Date.now },
  newCases: { type: Number, default: 0, min: 0 },
  recovered: { type: Number, default: 0, min: 0 },
  deaths: { type: Number, default: 0, min: 0 },
  activeDelta: { type: Number, default: 0 }, // newCases - recovered - deaths
  notes: String,
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  source: { type: String, default: 'manual' } // manual | import | api
}, { timestamps: true });

caseReportSchema.index({ area: 1, reportDate: -1 });
caseReportSchema.index({ country: 1, reportDate: -1 });

module.exports = mongoose.model('CaseReport', caseReportSchema);
