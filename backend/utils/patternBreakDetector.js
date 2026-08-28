const { calculatePersonalBaseline } = require('./baselineService');
const { calculateInsightConfidence } = require('./confidenceCalculator');

const detectPatternBreak = (checkIns = []) => {
  const confidence = calculateInsightConfidence(checkIns.length);

  if (!confidence.hasEnoughData || checkIns.length < 5) {
    return {
      hasPatternBreak: false,
      confidence,
      title: 'Pattern Break Detector',
      message: 'Keep logging daily check-ins to enable routine shift detection.',
      factors: [],
    };
  }

  const baselineRes = calculatePersonalBaseline(checkIns);
  if (!baselineRes.hasBaseline) {
    return {
      hasPatternBreak: false,
      confidence,
      title: 'Pattern Break Detector',
      message: 'Log more check-ins to establish baseline routine bounds.',
      factors: [],
    };
  }

  const { ranges } = baselineRes;
  const recent3 = checkIns.slice(0, 3);
  const factors = [];

  const recentAvgStress = recent3.reduce((s, c) => s + c.stressScore, 0) / recent3.length;
  const recentAvgMood = recent3.reduce((s, c) => s + c.moodScore, 0) / recent3.length;
  const recentAvgEnergy = recent3.reduce((s, c) => s + (c.energyLevel || 5), 0) / recent3.length;

  // Signal 1: Stress significantly above normal
  if (recentAvgStress > ranges.stress.rangeHigh + 0.5) {
    factors.push(`Stress increased above your normal recorded range (${recentAvgStress.toFixed(1)} vs usual ~${ranges.stress.mean}).`);
  }

  // Signal 2: Mood significantly below normal
  if (recentAvgMood < ranges.mood.rangeLow - 0.5) {
    factors.push(`Mood decreased below your typical range (${recentAvgMood.toFixed(1)} vs usual ~${ranges.mood.mean}).`);
  }

  // Signal 3: Energy level lower for 3 check-ins
  if (recentAvgEnergy < ranges.energy.mean - 1.5) {
    factors.push(`Energy level has been lower for your recent 3 check-ins (${recentAvgEnergy.toFixed(1)}/10).`);
  }

  // Signal 4: Sleep duration change
  const sleepEntries = recent3.filter((c) => c.sleepDuration !== undefined && c.sleepDuration !== null);
  if (sleepEntries.length > 0 && ranges.sleepDuration.mean > 0) {
    const recentSleep = sleepEntries.reduce((s, c) => s + c.sleepDuration, 0) / sleepEntries.length;
    if (recentSleep < ranges.sleepDuration.mean - 1.5) {
      factors.push(`Sleep duration decreased compared with your recent average (~${recentSleep.toFixed(1)}h vs usual ~${ranges.sleepDuration.mean}h).`);
    }
  }

  const hasPatternBreak = factors.length > 0;

  return {
    hasPatternBreak,
    confidence,
    title: 'Pattern Break Detector',
    message: hasPatternBreak
      ? 'Your recent pattern looks different from your usual recorded routine.'
      : 'Your recent check-in routine matches your usual pattern.',
    factors,
    disclaimer: 'Personal pattern indicator based on your recorded information.',
  };
};

module.exports = {
  detectPatternBreak,
};
