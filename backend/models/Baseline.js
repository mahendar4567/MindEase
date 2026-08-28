const mongoose = require('mongoose');

const rangeSchema = new mongoose.Schema(
  {
    mean: { type: Number, default: 0 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    stdDev: { type: Number, default: 0 },
  },
  { _id: false }
);

const baselineSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    moodRange: rangeSchema,
    stressRange: rangeSchema,
    energyRange: rangeSchema,
    sleepDurationRange: rangeSchema,
    sleepQualityRange: rangeSchema,
    totalCheckInsAnalyzed: { type: Number, default: 0 },
    lastCalculatedDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Baseline = mongoose.model('Baseline', baselineSchema);

module.exports = Baseline;
