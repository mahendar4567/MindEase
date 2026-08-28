const CheckIn = require('../models/CheckIn');
const Event = require('../models/Event');
const Semester = require('../models/Semester');

const { calculatePersonalStability } = require('../utils/stabilityCalculator');
const { analyzePressureCombinations } = require('../utils/pressureCombinationAnalysis');
const { calculatePressureRecoveryTime } = require('../utils/recoveryTimeCalculator');
const { exploreStressChains } = require('../utils/stressChainExplorer');
const { detectEmotionBehaviorMismatch } = require('../utils/emotionBehaviorMismatch');
const { analyzeSemesterTimeline } = require('../utils/semesterTimelineEngine');
const { generatePatternReplay } = require('../utils/emotionalPatternReplay');
const { generatePressureForecast } = require('../utils/pressureForecastEngine');

// @desc    Get Advanced Features Summary (Phases 1-5)
// @route   GET /api/advanced-features/summary
// @access  Private
const getAdvancedFeaturesSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [checkIns, events, semester] = await Promise.all([
      CheckIn.find({ userId }).sort({ date: -1 }),
      Event.find({ userId }).sort({ eventDate: 1 }),
      Semester.findOne({ userId }),
    ]);

    const stability = calculatePersonalStability(checkIns);
    const pressureCombinations = analyzePressureCombinations(checkIns);
    const recoveryTime = calculatePressureRecoveryTime(checkIns, events);
    const stressChains = exploreStressChains(checkIns, events);
    const emotionMismatch = detectEmotionBehaviorMismatch(checkIns);
    const semesterTimeline = analyzeSemesterTimeline(checkIns, events, semester);
    const patternReplay = generatePatternReplay(checkIns, events, 7);
    const pressureForecast = generatePressureForecast(checkIns, events);

    return res.status(200).json({
      success: true,
      features: {
        stability,
        pressureCombinations,
        recoveryTime,
        stressChains,
        emotionMismatch,
        semesterTimeline,
        patternReplay,
        pressureForecast,
        semesterConfig: semester || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Semester Timeline Config
// @route   POST /api/advanced-features/semester
// @access  Private
const saveSemesterConfig = async (req, res, next) => {
  try {
    const { title, startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Semester start date and end date are required',
      });
    }

    const semester = await Semester.findOneAndUpdate(
      { userId: req.user._id },
      {
        userId: req.user._id,
        title: title ? String(title).trim() : 'Current Semester',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Semester configuration saved successfully',
      semester,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdvancedFeaturesSummary,
  saveSemesterConfig,
};
