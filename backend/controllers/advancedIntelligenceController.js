const CheckIn = require('../models/CheckIn');
const Event = require('../models/Event');
const Baseline = require('../models/Baseline');

const { calculatePersonalBaseline } = require('../utils/baselineService');
const { detectPatternBreak } = require('../utils/patternBreakDetector');
const { detectSilentPattern } = require('../utils/silentPatternDetector');
const { analyzeExamStress } = require('../utils/examStressRadar');
const { calculateEmotionalLoad } = require('../utils/emotionalLoadEngine');
const { analyzeHelpfulActions } = require('../utils/helpfulActionAnalyzer');
const { calculateInsightConfidence } = require('../utils/confidenceCalculator');

// @desc    Get Advanced Personal Pattern Intelligence Summary
// @route   GET /api/advanced-intelligence/summary
// @access  Private
const getAdvancedIntelligenceSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch user check-ins and events
    const checkIns = await CheckIn.find({ userId }).sort({ date: -1 });
    const events = await Event.find({ userId }).sort({ eventDate: 1 });

    const confidence = calculateInsightConfidence(checkIns.length);

    // Calculate baseline and cache/update Baseline document
    const baselineResult = calculatePersonalBaseline(checkIns);

    if (baselineResult.hasBaseline && baselineResult.ranges) {
      await Baseline.findOneAndUpdate(
        { userId },
        {
          userId,
          moodRange: baselineResult.ranges.mood,
          stressRange: baselineResult.ranges.stress,
          energyRange: baselineResult.ranges.energy,
          sleepDurationRange: baselineResult.ranges.sleepDuration,
          sleepQualityRange: baselineResult.ranges.sleepQuality,
          totalCheckInsAnalyzed: checkIns.length,
          lastCalculatedDate: new Date(),
        },
        { upsert: true, new: true }
      );
    }

    const patternBreak = detectPatternBreak(checkIns);
    const silentPattern = detectSilentPattern(checkIns);
    const examStressRadar = analyzeExamStress(checkIns, events);
    const emotionalLoad = calculateEmotionalLoad(checkIns, events);
    const helpfulActionAnalysis = analyzeHelpfulActions(checkIns);

    return res.status(200).json({
      success: true,
      data: {
        confidence,
        baseline: baselineResult,
        patternBreak,
        silentPattern,
        examStressRadar,
        emotionalLoad,
        helpfulActionAnalysis,
        totalCheckIns: checkIns.length,
        totalEvents: events.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdvancedIntelligenceSummary,
};
