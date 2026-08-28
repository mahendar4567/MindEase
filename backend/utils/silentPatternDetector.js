const { calculateInsightConfidence } = require('./confidenceCalculator');

const detectSilentPattern = (checkIns = []) => {
  const confidence = calculateInsightConfidence(checkIns.length);

  if (!confidence.hasEnoughData || checkIns.length < 3) {
    return {
      hasSilentPattern: false,
      confidence,
      title: 'Silent Pattern Detector',
      message: 'Log consistent daily check-ins to monitor self-reported signal alignment.',
      factors: [],
    };
  }

  const recent3 = checkIns.slice(0, 3);
  const avgMood = recent3.reduce((s, c) => s + c.moodScore, 0) / recent3.length;
  const avgStress = recent3.reduce((s, c) => s + c.stressScore, 0) / recent3.length;
  const avgEnergy = recent3.reduce((s, c) => s + (c.energyLevel || 5), 0) / recent3.length;

  const poorSleepCount = recent3.filter((c) => c.sleepQuality !== undefined && c.sleepQuality <= 2).length;

  const factors = [];
  let hasSilentPattern = false;

  if (avgMood >= 6.0 && avgStress >= 6.5) {
    hasSilentPattern = true;
    factors.push(`Recorded mood scores remained stable (${avgMood.toFixed(1)}/10).`);
    factors.push(`Recorded stress intensity remained elevated (${avgStress.toFixed(1)}/10).`);
  }

  if (avgMood >= 6.0 && avgEnergy <= 4.5) {
    hasSilentPattern = true;
    factors.push(`Energy level showed a decrease (${avgEnergy.toFixed(1)}/10) despite higher self-reported mood.`);
  }

  if (poorSleepCount >= 2 && avgMood >= 6.0) {
    hasSilentPattern = true;
    factors.push(`Sleep quality was rated 2 or lower on ${poorSleepCount} recent check-ins.`);
  }

  let message = 'Your self-reported mood, stress, and energy data show consistent alignment.';
  if (hasSilentPattern) {
    message = 'Your recorded mood scores have remained relatively stable, while your stress and energy patterns show underlying pressure.';
  }

  return {
    hasSilentPattern,
    confidence,
    title: 'Silent Pattern Detector',
    message,
    factors: Array.from(new Set(factors)),
    disclaimer: 'This indicator identifies signal mismatches in your recorded data. It is not a clinical assessment.',
  };
};

module.exports = {
  detectSilentPattern,
};
