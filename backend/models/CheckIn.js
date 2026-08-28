const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    moodScore: {
      type: Number,
      required: [true, 'Mood score is required'],
      min: [1, 'Mood score must be at least 1'],
      max: [10, 'Mood score cannot exceed 10'],
    },
    stressScore: {
      type: Number,
      required: [true, 'Stress score is required'],
      min: [1, 'Stress score must be at least 1'],
      max: [10, 'Stress score cannot exceed 10'],
    },
    energyLevel: {
      type: Number,
      min: [1, 'Energy level must be at least 1'],
      max: [10, 'Energy level cannot exceed 10'],
      default: 5,
    },
    triggers: [
      {
        type: String,
        trim: true,
      },
    ],
    helpfulActions: [
      {
        type: String,
        trim: true,
      },
    ],
    sleepDuration: {
      type: Number,
      min: [0, 'Sleep duration cannot be negative'],
      max: [24, 'Sleep duration cannot exceed 24 hours'],
    },
    sleepQuality: {
      type: Number,
      min: [1, 'Sleep quality must be at least 1'],
      max: [5, 'Sleep quality cannot exceed 5'],
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, 'Note cannot exceed 500 characters'],
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const CheckIn = mongoose.model('CheckIn', checkInSchema);

module.exports = CheckIn;
