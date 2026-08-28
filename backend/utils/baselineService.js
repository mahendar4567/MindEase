const { calculateInsightConfidence } = require('./confidenceCalculator');

// Helper: Mean & StdDev
const getStats = (values) => {
  if (!values || values.length === 0) return { mean: 0, stdDev: 0, min: 0, max: 0 };
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  const min = Math.min(...values);
  const max = Math.max(...values);
  return {
    mean: Number(mean.toFixed(1)),
    stdDev: Number(stdDev.toFixed(1)),
    min: Number(min.toFixed(1)),
    max: Number(max.toFixed(1)),
    rangeLow: Number(Math.max(1, mean - stdDev).toFixed(1)),
    rangeHigh: Number(mean + stdDev).toFixed(1),
  };
};

const calculatePersonalBaseline = (checkIns = []) => {
  const confidence = calculateInsightConfidence(checkIns.length);

  if (!confidence.hasEnoughData) {
    return {
      hasBaseline: false,
      confidence,
      insights: ['Log at least 7 check-ins to establish your personal baseline ranges.'],
      ranges: null,
    };
  }

  // Use historical records (at least 7, up to 60)
  const history = checkIns.slice(0, 60);

  const moodStats = getStats(history.map((c) => c.moodScore));
  const stressStats = getStats(history.map((c) => c.stressScore));
  const energyStats = getStats(history.map((c) => (c.energyLevel !== undefined ? c.energyLevel : 5)));

  const sleepDurations = history
    .filter((c) => c.sleepDuration !== undefined && c.sleepDuration !== null)
    .map((c) => c.sleepDuration);
  const sleepStats = getStats(sleepDurations);

  const sleepQualities = history
    .filter((c) => c.sleepQuality !== undefined && c.sleepQuality !== null)
    .map((c) => c.sleepQuality);
  const sleepQualityStats = getStats(sleepQualities);

  // Compare recent 3 check-ins against user's historical baseline
  const recent3 = checkIns.slice(0, 3);
  const recentMood = recent3.reduce((s, c) => s + c.moodScore, 0) / recent3.length;
  const recentStress = recent3.reduce((s, c) => s + c.stressScore, 0) / recent3.length;

  const insights = [];

  if (recentStress > stressStats.rangeHigh) {
    insights.push(`Your recent stress (${recentStress.toFixed(1)}/10) is higher than your usual recorded range (${stressStats.rangeLow}–${stressStats.rangeHigh}).`);
  } else if (recentStress < stressStats.rangeLow) {
    insights.push(`Your recent stress (${recentStress.toFixed(1)}/10) is lower than your typical baseline pattern.`);
  }

  if (recentMood < moodStats.rangeLow) {
    insights.push(`Your recent mood (${recentMood.toFixed(1)}/10) is lower than your typical recorded range (${moodStats.rangeLow}–${moodStats.rangeHigh}).`);
  }

  if (insights.length === 0) {
    insights.push('Your recent check-in values align smoothly within your personal baseline range.');
  }

  return {
    hasBaseline: true,
    confidence,
    ranges: {
      mood: moodStats,
      stress: stressStats,
      energy: energyStats,
      sleepDuration: sleepStats,
      sleepQuality: sleepQualityStats,
    },
    insights,
  };
};

module.exports = {
  calculatePersonalBaseline,
};
