const bcrypt = require('bcryptjs');
const PrivacySettings = require('../models/PrivacySettings');

// @desc    Setup or Update Privacy PIN
// @route   POST /api/privacy/pin
// @access  Private
const setupPin = async (req, res, next) => {
  try {
    const { pin } = req.body;

    if (!pin || String(pin).length < 4) {
      return res.status(400).json({
        success: false,
        message: 'PIN must be at least 4 digits',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const pinHash = await bcrypt.hash(String(pin), salt);

    const settings = await PrivacySettings.findOneAndUpdate(
      { userId: req.user._id },
      { userId: req.user._id, pinHash, privacyModeEnabled: true },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Privacy PIN setup successfully',
      privacyModeEnabled: settings.privacyModeEnabled,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Privacy PIN
// @route   POST /api/privacy/verify-pin
// @access  Private
const verifyPin = async (req, res, next) => {
  try {
    const { pin } = req.body;

    const settings = await PrivacySettings.findOne({ userId: req.user._id });

    if (!settings || !settings.pinHash) {
      return res.status(400).json({
        success: false,
        message: 'No Privacy PIN configured for this account',
      });
    }

    const isMatch = await bcrypt.compare(String(pin), settings.pinHash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect Privacy PIN',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'PIN verified successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle Privacy Mode state
// @route   PUT /api/privacy/mode
// @access  Private
const togglePrivacyMode = async (req, res, next) => {
  try {
    const { enabled } = req.body;

    const settings = await PrivacySettings.findOneAndUpdate(
      { userId: req.user._id },
      { userId: req.user._id, privacyModeEnabled: Boolean(enabled) },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      privacyModeEnabled: settings.privacyModeEnabled,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  setupPin,
  verifyPin,
  togglePrivacyMode,
};
