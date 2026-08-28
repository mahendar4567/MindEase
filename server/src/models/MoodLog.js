const mongoose = require('mongoose');

const moodLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  mood: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  stressLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  note: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('MoodLog', moodLogSchema);
