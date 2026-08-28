// Reusable Personal Insight Confidence Calculator
const calculateInsightConfidence = (checkInCount = 0) => {
  if (checkInCount < 7) {
    return {
      level: 'Insufficient Data',
      badgeColor: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
      description: `Log at least 7 check-ins to unlock pattern confidence (Current: ${checkInCount} check-ins).`,
      checkInCount,
      percentage: 20,
      hasEnoughData: false,
    };
  }

  if (checkInCount <= 13) {
    return {
      level: 'Early Pattern',
      badgeColor: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
      description: `This insight is based on ${checkInCount} of your recorded check-ins.`,
      checkInCount,
      percentage: 45,
      hasEnoughData: true,
    };
  }

  if (checkInCount <= 29) {
    return {
      level: 'Emerging Pattern',
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
      description: `This insight is based on ${checkInCount} of your recorded check-ins.`,
      checkInCount,
      percentage: 75,
      hasEnoughData: true,
    };
  }

  return {
    level: 'Established Pattern',
    badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    description: `This insight is based on ${checkInCount} of your recorded check-ins.`,
    checkInCount,
    percentage: 100,
    hasEnoughData: true,
  };
};

module.exports = {
  calculateInsightConfidence,
};
