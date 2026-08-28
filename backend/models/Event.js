const mongoose = require('mongoose');

const reflectionSchema = new mongoose.Schema(
  {
    moodScore: { type: Number, min: 1, max: 10 },
    stressScore: { type: Number, min: 1, max: 10 },
    note: { type: String, trim: true, maxlength: 300 },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      enum: [
        'Exam',
        'Assignment Deadline',
        'Project Submission',
        'Placement Interview',
        'Career Event',
        'Personal Event',
        'Other',
      ],
      default: 'Other',
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    beforeReflection: reflectionSchema,
    afterReflection: reflectionSchema,
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
