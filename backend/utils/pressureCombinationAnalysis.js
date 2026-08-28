const { calculateInsightConfidence } = require('./confidenceCalculator');

const analyzePressureCombinations = (checkIns = []) => {
  const confidence = calculateInsightConfidence(checkIns.length);

  if (checkIns.length < 5) {
    return {
      hasData: false,
      confidence,
      combinations: [],
      insightText: 'Log check-ins with multiple stress triggers to discover combination pressures.',
      disclaimer: 'Based on your recorded check-ins. Does not claim medical causation.',
    };
  }

  const comboMap = {};

  checkIns.forEach((c) => {
    if (Array.isArray(c.triggers) && c.triggers.length >= 2) {
      const sorted = [...c.triggers].sort();
      for (let i = 0; i < sorted.length; i++) {
        for (let j = i + 1; j < sorted.length; j++) {
          const key = `${sorted[i]} + ${sorted[j]}`;
          if (!comboMap[key]) {
            comboMap[key] = { pair: key, count: 0, totalStress: 0, totalMood: 0, totalEnergy: 0 };
          }
          comboMap[key].count += 1;
          comboMap[key].totalStress += c.stressScore;
          comboMap[key].totalMood += c.moodScore;
          comboMap[key].totalEnergy += (c.energyLevel || 5);
        }
      }
    }
  });

  const combinations = Object.values(comboMap)
    .map((item) => ({
      pair: item.pair,
      count: item.count,
      avgStress: Number((item.totalStress / item.count).toFixed(1)),
      avgMood: Number((item.totalMood / item.count).toFixed(1)),
      avgEnergy: Number((item.totalEnergy / item.count).toFixed(1)),
    }))
    .sort((a, b) => b.avgStress - a.avgStress || b.count - a.count);

  let insightText = 'Log multiple stress triggers during check-ins to unlock trigger combination analysis.';
  if (combinations.length > 0) {
    const topCombo = combinations[0];
    insightText = `Based on your recorded check-ins, stress appears highest (${topCombo.avgStress}/10) when ${topCombo.pair.toLowerCase()} pressures occur together.`;
  }

  return {
    hasData: combinations.length > 0,
    confidence,
    combinations,
    insightText,
    disclaimer: 'Based on your recorded check-ins. Does not claim medical causation.',
  };
};

module.exports = {
  analyzePressureCombinations,
};
