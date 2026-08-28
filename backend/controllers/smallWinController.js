const SmallWin = require('../models/SmallWin');

// @desc    Create Small Win
// @route   POST /api/smallwins
// @access  Private
const createSmallWin = async (req, res, next) => {
  try {
    const { title, category, date } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Small win title is required',
      });
    }

    const smallWin = await SmallWin.create({
      userId: req.user._id,
      title: String(title).trim(),
      category: category || 'Other',
      date: date ? new Date(date) : new Date(),
    });

    return res.status(201).json({
      success: true,
      message: 'Small win recorded successfully!',
      smallWin,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's Small Wins
// @route   GET /api/smallwins
// @access  Private
const getSmallWins = async (req, res, next) => {
  try {
    const smallWins = await SmallWin.find({ userId: req.user._id }).sort({ date: -1 });

    return res.status(200).json({
      success: true,
      count: smallWins.length,
      smallWins,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Small Win
// @route   DELETE /api/smallwins/:id
// @access  Private
const deleteSmallWin = async (req, res, next) => {
  try {
    const smallWin = await SmallWin.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!smallWin) {
      return res.status(404).json({
        success: false,
        message: 'Small win not found or unauthorized',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Small win removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSmallWin,
  getSmallWins,
  deleteSmallWin,
};
