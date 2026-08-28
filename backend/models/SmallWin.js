const mongoose = require('mongoose');

const smallWinSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Small win title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    category: {
      type: String,
      enum: [
        'Completed a difficult task',
        'Finished an assignment',
        'Exercise',
        'Talked to someone',
        'Took a break',
        'Achieved a goal',
        'Other',
      ],
      default: 'Other',
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

const SmallWin = mongoose.model('SmallWin', smallWinSchema);

module.exports = SmallWin;
