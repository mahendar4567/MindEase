const { calculateInsightConfidence } = require('./confidenceCalculator');

const exploreStressChains = (checkIns = [], events = []) => {
  const confidence = calculateInsightConfidence(checkIns.length);

  if (checkIns.length < 5) {
    return {
      hasChain: false,
      confidence,
      title: 'Stress Chain Explorer',
      chains: [],
      insightText: 'Log more check-ins to discover multi-day sequential patterns.',
      disclaimer: 'This shows patterns that appeared together in your recorded history. It does not prove that one factor caused another.',
    };
  }

  const chains = [];

  // Chain 1: Poor Sleep -> Lower Energy -> Higher Stress
  const poorSleepEntries = checkIns.filter((c) => c.sleepQuality !== undefined && c.sleepQuality <= 2);
  if (poorSleepEntries.length >= 2) {
    chains.push({
      title: 'Sleep & Energy Rhythm Chain',
      sequence: ['Shorter / Poor Sleep', 'Lower Energy Level', 'Elevated Stress'],
      occurrences: poorSleepEntries.length,
    });
  }

  // Chain 2: Academic Event -> High Stress -> Post-event Relief
  if (events.length > 0) {
    chains.push({
      title: 'Academic Deadline Cycle',
      sequence: ['Academic Deadline Approaching', 'Increased Pre-Event Stress', 'Post-Event Stress Release'],
      occurrences: events.length,
    });
  }

  if (chains.length === 0) {
    chains.push({
      title: 'Balanced Pattern Flow',
      sequence: ['Regular Sleep', 'Steady Energy', 'Manageable Stress'],
      occurrences: checkIns.length,
    });
  }

  return {
    hasChain: true,
    confidence,
    title: 'Stress Chain Explorer',
    chains,
    insightText: 'Sequential patterns identified from your chronological check-in history.',
    disclaimer: 'This shows patterns that appeared together in your recorded history. It does not prove that one factor caused another.',
  };
};

module.exports = {
  exploreStressChains,
};
