// Reusable Burnout / Wellness Risk Calculation & Explanation Engine
const calculateWellnessRisk = (checkIns) => {
  if (!checkIns || checkIns.length === 0) {
    return {
      level: 'Low',
      factors: ['Baseline initialized for new account. Check back after logging check-ins.'],
      disclaimer: 'Personal wellness risk is a self-reflection metric and not a clinical diagnosis.',
    };
  }

  const factors = [];
  let riskPoints = 0;

  // Rule 1: High stress streak (3+ days stress >= 7 -> Moderate; 5+ days stress >= 8 -> High)
  let highStreak = 0;
  for (let i = 0; i < checkIns.length; i++) {
    if (checkIns[i].stressScore >= 7) {
      highStreak++;
    } else {
      break;
    }
  }

  if (highStreak >= 5 && checkIns[0]?.stressScore >= 8) {
    riskPoints += 3;
    factors.push(`Stress score was 8 or higher for ${highStreak} consecutive recent check-ins.`);
  } else if (highStreak >= 3) {
    riskPoints += 2;
    factors.push(`Stress score was 7 or higher for ${highStreak} consecutive days.`);
  }

  // Rule 2: Weekly average stress > 6
  const recent7 = checkIns.slice(0, 7);
  const avgStress7 = recent7.length > 0
    ? recent7.reduce((sum, c) => sum + c.stressScore, 0) / recent7.length
    : 0;

  if (avgStress7 > 6.0) {
    riskPoints += 1;
    factors.push(`Average weekly stress (${avgStress7.toFixed(1)}/10) exceeded recommended threshold.`);
  }

  // Rule 3: Low mood multiple times during the week (< 4)
  const lowMoodCount = recent7.filter((c) => c.moodScore < 4).length;
  if (lowMoodCount >= 2) {
    riskPoints += 1;
    factors.push(`Mood was rated below 4 on ${lowMoodCount} separate days this past week.`);
  }

  let level = 'Low';
  if (riskPoints >= 3) {
    level = 'High';
  } else if (riskPoints >= 1) {
    level = 'Moderate';
  } else {
    factors.push('Your recorded stress, energy, and mood levels remain within balanced parameters.');
  }

  return {
    level,
    factors,
    disclaimer: 'Personal wellness risk is a self-reflection metric and not a clinical diagnosis.',
  };
};

module.exports = {
  calculateWellnessRisk,
};
