const { calculateInsightConfidence } = require('./confidenceCalculator');

const detectEmotionBehaviorMismatch = (checkIns = []) => {
  const confidence = calculateInsightConfidence(checkIns.length);

  if (checkIns.length < 3) {
    return {
      hasMismatch: false,
      confidence,
      title: 'Emotion-Behavior Mismatch Detector',
      message: 'Log check-ins to monitor self-reported signal alignment.',
      factors: [],
    };
  }

  const recent = checkIns.slice(0, 3);
  const avgMood = recent.reduce((s, c) => s + c.moodScore, 0) / recent.length;
  const avgStress = recent.reduce((s, c) => s + c.stressScore, 0) / recent.length;
  const avgEnergy = recent.reduce((s, c) => s + (c.energyLevel || 5), 0) / recent.length;

  const poorSleepCount = recent.filter((c) => c.sleepQuality !== undefined && c.sleepQuality <= 2).length;

  const factors = [];
  let hasMismatch = false;

  if (avgMood >= 7.0 && (avgStress >= 6.5 || avgEnergy <= 4.0 || poorSleepCount >= 1)) {
    hasMismatch = true;
    factors.push(`Self-reported mood is positive (${avgMood.toFixed(1)}/10).`);
    if (avgStress >= 6.5) factors.push(`Recorded stress intensity remains high (${avgStress.toFixed(1)}/10).`);
    if (avgEnergy <= 4.0) factors.push(`Recorded energy level is low (${avgEnergy.toFixed(1)}/10).`);
    if (poorSleepCount >= 1) factors.push(`Sleep quality was rated 2 or lower.`);
  }

  const message = hasMismatch
    ? 'Your mood score is positive, while some other recorded patterns suggest increased pressure.'
    : 'Your recorded mood, stress, energy, and sleep patterns show consistent alignment.';

  return {
    hasMismatch,
    confidence,
    title: 'Emotion-Behavior Mismatch Detector',
    message,
    factors,
    disclaimer: 'Personal pattern indicator based on self-reported data. Does not diagnose medical conditions.',
  };
};

module.exports = {
  detectEmotionBehaviorMismatch,
};
