// Reusable Wellness Battery Calculation Engine (0-100)
const calculateWellnessBattery = (checkIns) => {
  if (!checkIns || checkIns.length === 0) {
    return {
      score: 75,
      category: 'Good',
      factors: ['Baseline score initialized based on user creation.'],
      disclaimer: 'This is a personal wellness indicator and not a medical assessment.',
    };
  }

  const recent = checkIns.slice(0, 14);
  const avgMood = recent.reduce((s, c) => s + c.moodScore, 0) / recent.length;
  const avgStress = recent.reduce((s, c) => s + c.stressScore, 0) / recent.length;
  const avgEnergy = recent.reduce((s, c) => s + (c.energyLevel || 5), 0) / recent.length;

  const sleepEntries = recent.filter((c) => c.sleepDuration !== undefined && c.sleepDuration !== null);
  const avgSleep = sleepEntries.length > 0
    ? sleepEntries.reduce((s, c) => s + c.sleepDuration, 0) / sleepEntries.length
    : 7.0;

  // Rule: Base 100 - (Stress * 5) + (Mood * 3) + (Energy * 2) + Sleep Bonus
  let rawScore = 100 - (avgStress * 5) + (avgMood * 3) + (avgEnergy * 2) - 10;

  const factors = [];

  if (avgMood >= 7) {
    factors.push(`Stable, positive mood average (${avgMood.toFixed(1)}/10).`);
  } else if (avgMood <= 4) {
    factors.push(`Lower average mood recorded (${avgMood.toFixed(1)}/10).`);
  }

  if (avgStress >= 7) {
    factors.push(`Recent stress average elevated (${avgStress.toFixed(1)}/10).`);
  } else {
    factors.push(`Manageable stress average (${avgStress.toFixed(1)}/10).`);
  }

  if (avgEnergy >= 7) {
    factors.push(`Sustained high energy levels (${avgEnergy.toFixed(1)}/10).`);
  } else if (avgEnergy <= 4) {
    factors.push(`Energy level recorded lower (${avgEnergy.toFixed(1)}/10).`);
  }

  if (sleepEntries.length > 0) {
    if (avgSleep >= 7.5) {
      rawScore += 5;
      factors.push(`Healthy sleep duration (~${avgSleep.toFixed(1)}h).`);
    } else if (avgSleep < 6.0) {
      rawScore -= 5;
      factors.push(`Shorter sleep duration (~${avgSleep.toFixed(1)}h).`);
    }
  }

  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  let category = 'Moderate';
  if (score <= 30) category = 'Low';
  else if (score <= 50) category = 'Drained';
  else if (score <= 70) category = 'Moderate';
  else if (score <= 85) category = 'Good';
  else category = 'Strong';

  return {
    score,
    category,
    factors,
    disclaimer: 'This is a personal wellness indicator and not a medical assessment.',
  };
};

module.exports = {
  calculateWellnessBattery,
};
