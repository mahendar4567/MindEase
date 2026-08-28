const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Semester title is required'],
      trim: true,
      default: 'Current Semester',
    },
    startDate: {
      type: Date,
      required: [true, 'Semester start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'Semester end date is required'],
    },
  },
  {
    timestamps: true,
  }
);

const Semester = mongoose.model('Semester', semesterSchema);

module.exports = Semester;
