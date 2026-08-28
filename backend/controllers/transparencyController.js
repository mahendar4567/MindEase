const User = require('../models/User');
const CheckIn = require('../models/CheckIn');
const Journal = require('../models/Journal');
const Event = require('../models/Event');
const SmallWin = require('../models/SmallWin');
const Baseline = require('../models/Baseline');
const PrivacySettings = require('../models/PrivacySettings');

// @desc    Get Stored Data Metrics
// @route   GET /api/transparency/metrics
// @access  Private
const getDataMetrics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [checkInsCount, journalCount, eventsCount, smallWinsCount] = await Promise.all([
      CheckIn.countDocuments({ userId }),
      Journal.countDocuments({ userId }),
      Event.countDocuments({ userId }),
      SmallWin.countDocuments({ userId }),
    ]);

    return res.status(200).json({
      success: true,
      metrics: {
        userEmail: req.user.email,
        accountCreated: req.user.createdAt,
        checkInsCount,
        journalCount,
        eventsCount,
        smallWinsCount,
        insightsGeneratedCount: checkInsCount * 4 + eventsCount * 2,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export Personal Data (JSON Bundle)
// @route   GET /api/transparency/export
// @access  Private
const exportUserData = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [user, checkIns, journals, events, smallWins, baseline] = await Promise.all([
      User.findById(userId).select('-password'),
      CheckIn.find({ userId }).sort({ date: -1 }),
      Journal.find({ userId }).sort({ date: -1 }),
      Event.find({ userId }).sort({ eventDate: 1 }),
      SmallWin.find({ userId }).sort({ date: -1 }),
      Baseline.findOne({ userId }),
    ]);

    const exportBundle = {
      exportDate: new Date(),
      platform: 'MindEase Student Wellness Platform',
      userProfile: user,
      checkIns,
      journals,
      events,
      smallWins,
      baselineSummary: baseline,
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="mindease_export_${Date.now()}.json"`);

    return res.status(200).send(JSON.stringify(exportBundle, null, 2));
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Selected Data Category
// @route   DELETE /api/transparency/category/:category
// @access  Private
const deleteCategoryData = async (req, res, next) => {
  try {
    const { category } = req.params;
    const userId = req.user._id;

    let deletedCount = 0;

    if (category === 'checkins') {
      const result = await CheckIn.deleteMany({ userId });
      deletedCount = result.deletedCount;
    } else if (category === 'journal') {
      const result = await Journal.deleteMany({ userId });
      deletedCount = result.deletedCount;
    } else if (category === 'events') {
      const result = await Event.deleteMany({ userId });
      deletedCount = result.deletedCount;
    } else if (category === 'smallwins') {
      const result = await SmallWin.deleteMany({ userId });
      deletedCount = result.deletedCount;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid data category specified',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Deleted ${deletedCount} item(s) from category "${category}"`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Entire User Account & All Data
// @route   DELETE /api/transparency/account
// @access  Private
const deleteAccountData = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Delete all linked documents
    await Promise.all([
      CheckIn.deleteMany({ userId }),
      Journal.deleteMany({ userId }),
      Event.deleteMany({ userId }),
      SmallWin.deleteMany({ userId }),
      Baseline.deleteMany({ userId }),
      PrivacySettings.deleteMany({ userId }),
      User.findByIdAndDelete(userId),
    ]);

    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });

    return res.status(200).json({
      success: true,
      message: 'Account and all associated personal data permanently deleted.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDataMetrics,
  exportUserData,
  deleteCategoryData,
  deleteAccountData,
};
