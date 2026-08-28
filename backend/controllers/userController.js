const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user.toResponse(),
  });
};

// @desc    Update user profile (e.g. displayName)
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { displayName } = req.body;

    if (!displayName || displayName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Display name cannot be empty',
      });
    }

    if (displayName.trim().length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Display name cannot exceed 50 characters',
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.displayName = displayName.trim();
    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser.toResponse(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
