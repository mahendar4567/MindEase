const CheckIn = require('../models/CheckIn');
const Event = require('../models/Event');

// Helper: Calculate Wellness Battery Score (0-100) & factors
const calculateWellnessBattery = (checkIns) => {
  if (!checkIns || checkIns.length === 0) {
    return {
      score: 70, // Default baseline for new users
      category: 'Moderate',
      factors: ['Baseline initialized for new user.'],
      disclaimer: 'This score is a personal wellness indicator and is not a medical assessment.',
    };
  }

  const recent = checkIns.slice(0, 14); // Last 14 entries max
  const avgMood = recent.reduce((sum, c) => sum + c.moodScore, 0) / recent.length;
  const avgStress = recent.reduce((sum, c) => sum + c.stressScore, 0) / recent.length;

  const sleepEntries = recent.filter((c) => c.sleepDuration !== undefined && c.sleepDuration !== null);
  const avgSleepDuration = sleepEntries.length > 0
    ? sleepEntries.reduce((sum, c) => sum + c.sleepDuration, 0) / sleepEntries.length
    : 7.0;

  // Transparent calculation rule:
  // Base 100 - (Stress * 6) + (Mood * 4) + Sleep Adjustment
  let rawScore = 100 - (avgStress * 6) + (avgMood * 4);

  const factors = [];

  if (avgMood >= 7) {
    factors.push(`Stable, positive mood average (${avgMood.toFixed(1)}/10).`);
  } else if (avgMood <= 4) {
    rawScore -= 10;
    factors.push(`Lower average mood recorded (${avgMood.toFixed(1)}/10).`);
  } else {
    factors.push(`Moderate mood average (${avgMood.toFixed(1)}/10).`);
  }

  if (avgStress >= 7) {
    rawScore -= 10;
    factors.push(`Elevated stress levels (${avgStress.toFixed(1)}/10).`);
  } else if (avgStress <= 4) {
    rawScore += 5;
    factors.push(`Manageable stress average (${avgStress.toFixed(1)}/10).`);
  } else {
    factors.push(`Moderate stress levels (${avgStress.toFixed(1)}/10).`);
  }

  if (sleepEntries.length > 0) {
    if (avgSleepDuration >= 7.5) {
      rawScore += 5;
      factors.push(`Healthy sleep duration (~${avgSleepDuration.toFixed(1)}h/night).`);
    } else if (avgSleepDuration < 6.0) {
      rawScore -= 10;
      factors.push(`Shorter sleep duration (~${avgSleepDuration.toFixed(1)}h/night).`);
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
    disclaimer: 'This score is a personal wellness indicator and is not a medical assessment.',
  };
};

// Helper: Calculate Explainable Burnout Risk & Factors
const calculateBurnoutRisk = (checkIns) => {
  if (!checkIns || checkIns.length === 0) {
    return {
      level: 'Low',
      factors: ['Insufficient check-in data to calculate risk.'],
      disclaimer: 'Burnout risk is a self-reflection metric and not a clinical diagnosis.',
    };
  }

  const factors = [];
  let riskPoints = 0;

  // Factor 1: 3 consecutive days of stress >= 7
  let streak = 0;
  for (let i = 0; i < checkIns.length; i++) {
    if (checkIns[i].stressScore >= 7) {
      streak++;
    } else {
      break;
    }
  }
  if (streak >= 3) {
    riskPoints += 2;
    factors.push(`Stress was 7 or higher for ${streak} consecutive days.`);
  }

  // Factor 2: Compare past 7 days vs previous 7 days
  const recent7 = checkIns.slice(0, 7);
  const prev7 = checkIns.slice(7, 14);

  if (recent7.length > 0 && prev7.length > 0) {
    const recentStressAvg = recent7.reduce((s, c) => s + c.stressScore, 0) / recent7.length;
    const prevStressAvg = prev7.reduce((s, c) => s + c.stressScore, 0) / prev7.length;

    const recentMoodAvg = recent7.reduce((s, c) => s + c.moodScore, 0) / recent7.length;
    const prevMoodAvg = prev7.reduce((s, c) => s + c.moodScore, 0) / prev7.length;

    if (recentStressAvg > prevStressAvg + 1.0) {
      riskPoints += 1;
      factors.push(`Weekly stress average increased (${prevStressAvg.toFixed(1)} → ${recentStressAvg.toFixed(1)}).`);
    }

    if (recentMoodAvg < prevMoodAvg - 1.0) {
      riskPoints += 1;
      factors.push(`Weekly mood average decreased (${prevMoodAvg.toFixed(1)} → ${recentMoodAvg.toFixed(1)}).`);
    }
  }

  const avgRecentStress = recent7.reduce((s, c) => s + c.stressScore, 0) / (recent7.length || 1);
  if (avgRecentStress >= 8.0) {
    riskPoints += 1;
    factors.push(`Very high average stress (${avgRecentStress.toFixed(1)}/10) over recent days.`);
  }

  let level = 'Low';
  if (riskPoints >= 3) {
    level = 'High';
  } else if (riskPoints >= 1) {
    level = 'Moderate';
  } else {
    factors.push('Stress and mood levels have remained within balanced parameters.');
  }

  return {
    level,
    factors,
    disclaimer: 'Burnout risk is a self-reflection metric and not a clinical diagnosis.',
  };
};

// Helper: Calculate Recovery Trend
const calculateRecoveryTrend = (checkIns) => {
  if (!checkIns || checkIns.length < 3) {
    return {
      status: 'Stable',
      description: 'Your recent pattern appears stable.',
      disclaimer: 'Recovery trend is a personal pattern indicator.',
    };
  }

  const recent = checkIns.slice(0, 5);
  const previous = checkIns.slice(5, 10);

  const recentStress = recent.reduce((s, c) => s + c.stressScore, 0) / recent.length;
  const prevStress = previous.length > 0 ? previous.reduce((s, c) => s + c.stressScore, 0) / previous.length : recentStress;

  const recentMood = recent.reduce((s, c) => s + c.moodScore, 0) / recent.length;
  const prevMood = previous.length > 0 ? previous.reduce((s, c) => s + c.moodScore, 0) / previous.length : recentMood;

  let status = 'Stable';
  let description = 'Your recent pattern appears stable based on recorded data.';

  if (recentStress < prevStress - 0.8 || recentMood > prevMood + 0.8) {
    status = 'Improving';
    description = 'Your stress has decreased and mood has improved compared with previous days.';
  } else if (recentStress > prevStress + 0.8 || recentMood < prevMood - 0.8) {
    status = 'Declining';
    description = 'Your recorded stress has increased slightly compared with previous days.';
  }

  return {
    status,
    description,
    disclaimer: 'Recovery trend is a personal pattern indicator.',
  };
};

// Helper: Calculate Sleep & Mood Correlation
const calculateSleepCorrelation = (checkIns) => {
  const sleepEntries = checkIns.filter((c) => c.sleepDuration !== undefined && c.sleepDuration !== null);

  if (sleepEntries.length < 3) {
    return {
      hasData: false,
      insights: ['Log a few more check-ins with sleep duration to unlock correlations.'],
      chartData: [],
    };
  }

  const goodSleep = sleepEntries.filter((c) => c.sleepDuration >= 7);
  const shortSleep = sleepEntries.filter((c) => c.sleepDuration < 7);

  const avgMoodGood = goodSleep.length > 0 ? (goodSleep.reduce((s, c) => s + c.moodScore, 0) / goodSleep.length).toFixed(1) : 'N/A';
  const avgMoodShort = shortSleep.length > 0 ? (shortSleep.reduce((s, c) => s + c.moodScore, 0) / shortSleep.length).toFixed(1) : 'N/A';

  const avgStressGood = goodSleep.length > 0 ? (goodSleep.reduce((s, c) => s + c.stressScore, 0) / goodSleep.length).toFixed(1) : 'N/A';
  const avgStressShort = shortSleep.length > 0 ? (shortSleep.reduce((s, c) => s + c.stressScore, 0) / shortSleep.length).toFixed(1) : 'N/A';

  const insights = [];

  if (goodSleep.length > 0 && shortSleep.length > 0) {
    if (Number(avgMoodGood) > Number(avgMoodShort)) {
      insights.push('Your average mood appears higher on days following better sleep.');
    }
    if (Number(avgStressShort) > Number(avgStressGood)) {
      insights.push('Your stress tends to increase after shorter sleep.');
    }
  }

  if (insights.length === 0) {
    insights.push('Based on your recorded patterns, sleep and mood show a consistent relationship.');
  }

  return {
    hasData: true,
    insights,
    comparison: {
      goodSleep: { count: goodSleep.length, avgMood: avgMoodGood, avgStress: avgStressGood },
      shortSleep: { count: shortSleep.length, avgMood: avgMoodShort, avgStress: avgStressShort },
    },
  };
};

// Helper: Calculate Personal Trigger Intelligence Ranking
const calculateTriggerIntelligence = (checkIns) => {
  const triggerMap = {};

  checkIns.forEach((c) => {
    if (Array.isArray(c.triggers)) {
      c.triggers.forEach((t) => {
        if (!triggerMap[t]) {
          triggerMap[t] = { name: t, count: 0, totalStress: 0, totalMood: 0 };
        }
        triggerMap[t].count += 1;
        triggerMap[t].totalStress += c.stressScore;
        triggerMap[t].totalMood += c.moodScore;
      });
    }
  });

  const rankings = Object.values(triggerMap)
    .map((t) => ({
      name: t.name,
      count: t.count,
      avgStress: Number((t.totalStress / t.count).toFixed(1)),
      avgMood: Number((t.totalMood / t.count).toFixed(1)),
    }))
    .sort((a, b) => b.count - a.count || b.avgStress - a.avgStress);

  const highestStressTrigger = rankings.length > 0 ? rankings[0] : null;

  return {
    rankings,
    highestStressTrigger,
    summary: highestStressTrigger
      ? `"${highestStressTrigger.name}" is currently your most frequently recorded high-stress trigger.`
      : 'No primary triggers recorded yet.',
  };
};

// @desc    Get complete Personal Pattern Intelligence summary
// @route   GET /api/intelligence/summary
// @access  Private
const getIntelligenceSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch user check-ins sorted newest first
    const checkIns = await CheckIn.find({ userId }).sort({ date: -1 });

    // Fetch user events sorted by date
    const events = await Event.find({ userId }).sort({ eventDate: 1 });

    const battery = calculateWellnessBattery(checkIns);
    const burnout = calculateBurnoutRisk(checkIns);
    const recovery = calculateRecoveryTrend(checkIns);
    const sleepCorrelation = calculateSleepCorrelation(checkIns);
    const triggerIntelligence = calculateTriggerIntelligence(checkIns);

    // Calculate weekly report stats
    const recent7 = checkIns.slice(0, 7);
    const avgMood7 = recent7.length > 0 ? (recent7.reduce((s, c) => s + c.moodScore, 0) / recent7.length).toFixed(1) : 'N/A';
    const avgStress7 = recent7.length > 0 ? (recent7.reduce((s, c) => s + c.stressScore, 0) / recent7.length).toFixed(1) : 'N/A';

    // Best Day & Difficult Day
    let bestDay = 'N/A';
    let difficultDay = 'N/A';
    if (recent7.length > 0) {
      const sortedByMood = [...recent7].sort((a, b) => b.moodScore - a.moodScore);
      const sortedByStress = [...recent7].sort((a, b) => b.stressScore - a.stressScore);

      bestDay = new Date(sortedByMood[0].date).toLocaleDateString('en-US', { weekday: 'long' });
      difficultDay = new Date(sortedByStress[0].date).toLocaleDateString('en-US', { weekday: 'long' });
    }

    return res.status(200).json({
      success: true,
      summary: {
        wellnessBattery: battery,
        burnoutRisk: burnout,
        recoveryTrend: recovery,
        sleepCorrelation,
        triggerIntelligence,
        weeklyReport: {
          avgMood: avgMood7,
          avgStress: avgStress7,
          wellnessBattery: battery.score,
          mostFrequentTrigger: triggerIntelligence.highestStressTrigger?.name || 'None',
          bestDay,
          difficultDay,
          recoveryTrend: recovery.status,
          burnoutRiskLevel: burnout.level,
          narrativeSummary: `This week, your mood recorded an average of ${avgMood7}/10 with a stress average of ${avgStress7}/10. ${
            triggerIntelligence.highestStressTrigger
              ? `${triggerIntelligence.highestStressTrigger.name} was your most frequent trigger.`
              : 'Your check-ins show steady reflection.'
          }`,
        },
        eventsCount: events.length,
        checkInsCount: checkIns.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getIntelligenceSummary,
};
