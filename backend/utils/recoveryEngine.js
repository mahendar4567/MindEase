// Reusable Recovery Trend Engine
const calculateRecoveryTrend = (checkIns) => {
  if (!checkIns || checkIns.length < 3) {
    return {
      status: 'Stable',
      description: 'Your recent pattern appears stable.',
      disclaimer: 'Personal pattern recovery trend indication.',
    };
  }

  const recent = checkIns.slice(0, 5);
  const previous = checkIns.slice(5, 10);

  const recentStress = recent.reduce((s, c) => s + c.stressScore, 0) / recent.length;
  const prevStress = previous.length > 0 ? previous.reduce((s, c) => s + c.stressScore, 0) / previous.length : recentStress;

  const recentMood = recent.reduce((s, c) => s + c.moodScore, 0) / recent.length;
  const prevMood = previous.length > 0 ? previous.reduce((s, c) => s + c.moodScore, 0) / previous.length : recentMood;

  let status = 'Stable';
  let description = 'Your recent recorded pattern appears to be stable.';

  if (recentStress < prevStress - 0.7 || recentMood > prevMood + 0.7) {
    status = 'Improving';
    description = 'Your recent recorded pattern appears to be improving. Your average stress is lower than last week.';
  } else if (recentStress > prevStress + 0.7 || recentMood < prevMood - 0.7) {
    status = 'Declining';
    description = 'Your recorded stress levels show a slight increase compared with previous check-ins.';
  }

  return {
    status,
    description,
    disclaimer: 'Personal pattern recovery trend indication.',
  };
};

module.exports = {
  calculateRecoveryTrend,
};
