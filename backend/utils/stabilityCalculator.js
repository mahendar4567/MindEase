const { calculateInsightConfidence } = require('./confidenceCalculator');

const calculatePersonalStability = (checkIns = []) => {
  const confidence = calculateInsightConfidence(checkIns.length);

  if (!confidence.hasEnoughData || checkIns.length < 5) {
    return {
      status: 'Stable',
      confidence,
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
      explanation: 'Log at least 5 check-ins to monitor your personal stability trajectory.',
      disclaimer: 'Personal pattern indicator based on recorded check-in variance. Does not imply medical abnormality.',
    };
  }

  const recent = checkIns.slice(0, 14);
  const moods = recent.map((c) => c.moodScore);
  const stresses = recent.map((c) => c.stressScore);

  const getVariance = (arr) => {
    const mean = arr.reduce((s, v) => s + v, 0) / arr.length;
    return arr.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / arr.length;
  };

  const moodVar = getVariance(moods);
  const stressVar = getVariance(stresses);
  const avgVar = (moodVar + stressVar) / 2;

  let status = 'Stable';
  let badgeColor = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
  let explanation = 'Your recorded mood and stress scores show steady consistency over your recent check-ins.';

  if (avgVar > 4.5) {
    status = 'Highly Variable';
    badgeColor = 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300';
    explanation = 'Your recorded mood and stress scores have shown higher day-to-day variation recently.';
  } else if (avgVar > 2.2) {
    status = 'Moderately Variable';
    badgeColor = 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
    explanation = 'Your recorded mood and stress scores have changed moderately compared with your baseline pattern.';
  }

  return {
    status,
    confidence,
    badgeColor,
    explanation,
    disclaimer: 'Personal pattern indicator based on recorded check-in variance. Does not imply medical abnormality.',
  };
};

module.exports = {
  calculatePersonalStability,
};
