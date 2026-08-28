const { calculateInsightConfidence } = require('./confidenceCalculator');

const analyzeHelpfulActions = (checkIns = []) => {
  const confidence = calculateInsightConfidence(checkIns.length);

  const actionCounts = {};
  const actionHighEnergyCounts = {};
  const actionLowStressCounts = {};

  checkIns.forEach((c) => {
    if (Array.isArray(c.helpfulActions)) {
      c.helpfulActions.forEach((act) => {
        actionCounts[act] = (actionCounts[act] || 0) + 1;
        if ((c.energyLevel || 5) >= 7) {
          actionHighEnergyCounts[act] = (actionHighEnergyCounts[act] || 0) + 1;
        }
        if (c.stressScore <= 4) {
          actionLowStressCounts[act] = (actionLowStressCounts[act] || 0) + 1;
        }
      });
    }
  });

  const sortedActions = Object.entries(actionCounts)
    .map(([name, count]) => ({
      name,
      count,
      highEnergyAssociation: Math.round(((actionHighEnergyCounts[name] || 0) / count) * 100),
      lowStressAssociation: Math.round(((actionLowStressCounts[name] || 0) / count) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  const insights = [];
  if (sortedActions.length > 0) {
    const topAction = sortedActions[0];
    if (topAction.name === 'Good sleep') {
      insights.push('Based on your own records, better sleep frequently appears before your higher-energy days.');
    } else if (topAction.name === 'Completing a task') {
      insights.push('Completing pending tasks appears often on days when your stress decreases.');
    } else {
      insights.push(`Based on your own records, "${topAction.name}" appears associated with your more balanced days.`);
    }
  } else {
    insights.push('Log helpful actions during check-ins to discover which reflections support your wellness rhythm.');
  }

  return {
    confidence,
    topActions: sortedActions,
    insights,
    disclaimer: 'Based on your own recorded check-in reflections. Does not claim medical causation.',
  };
};

module.exports = {
  analyzeHelpfulActions,
};
