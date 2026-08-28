const { calculateInsightConfidence } = require('./confidenceCalculator');

const calculateEmotionalLoad = (checkIns = [], events = []) => {
  const confidence = calculateInsightConfidence(checkIns.length);

  if (!checkIns || checkIns.length === 0) {
    return {
      score: 35,
      category: 'Moderate Load',
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
      explanation: 'Initial baseline load estimated based on account creation.',
      confidence,
      factors: ['Baseline initialized for new account.'],
      disclaimer: 'This is a personal pattern and planning indicator based on your recorded information.',
    };
  }

  const recent = checkIns.slice(0, 7);
  const avgStress = recent.reduce((s, c) => s + c.stressScore, 0) / recent.length;
  const avgEnergy = recent.reduce((s, c) => s + (c.energyLevel || 5), 0) / recent.length;

  const sleepEntries = recent.filter((c) => c.sleepQuality !== undefined && c.sleepQuality !== null);
  const avgSleepQuality = sleepEntries.length > 0
    ? sleepEntries.reduce((s, c) => s + c.sleepQuality, 0) / sleepEntries.length
    : 3.5;

  // Upcoming academic events within next 7 days
  const now = new Date();
  const upcomingEvents7d = events.filter((e) => {
    const evDate = new Date(e.eventDate);
    const diffDays = (evDate.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return diffDays >= 0 && diffDays <= 7;
  });

  let loadPoints = (avgStress * 6) - (avgEnergy * 2.5) + ((5 - avgSleepQuality) * 4) + (upcomingEvents7d.length * 8) + 15;
  const score = Math.max(0, Math.min(100, Math.round(loadPoints)));

  const factors = [];

  if (avgStress >= 6.5) {
    factors.push(`Recent stress level is elevated (${avgStress.toFixed(1)}/10).`);
  } else {
    factors.push(`Recent stress intensity remains manageable (${avgStress.toFixed(1)}/10).`);
  }

  if (avgEnergy <= 4.5) {
    factors.push(`Energy level recorded lower than usual (${avgEnergy.toFixed(1)}/10).`);
  }

  if (upcomingEvents7d.length > 0) {
    factors.push(`You have ${upcomingEvents7d.length} upcoming academic event(s) in the next 7 days.`);
  }

  let category = 'Moderate Load';
  let badgeColor = 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';

  if (score <= 30) {
    category = 'Light Load';
    badgeColor = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
  } else if (score <= 50) {
    category = 'Moderate Load';
    badgeColor = 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
  } else if (score <= 70) {
    category = 'High Load';
    badgeColor = 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300';
  } else {
    category = 'Heavy Load';
    badgeColor = 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300';
  }

  const explanation = `Your current emotional load is rated ${category.toLowerCase()} (${score}/100) based on recent stress averages and upcoming events.`;

  return {
    score,
    category,
    badgeColor,
    explanation,
    confidence,
    factors,
    disclaimer: 'This is a personal pattern and planning indicator based on your recorded information.',
  };
};

module.exports = {
  calculateEmotionalLoad,
};
