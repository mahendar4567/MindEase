const { calculateInsightConfidence } = require('./confidenceCalculator');

const calculatePressureRecoveryTime = (checkIns = [], events = []) => {
  const confidence = calculateInsightConfidence(checkIns.length);

  const pastEvents = events.filter((e) => new Date(e.eventDate) < new Date());

  if (pastEvents.length === 0 || checkIns.length < 5) {
    return {
      hasData: false,
      confidence,
      title: 'Pressure Recovery Time',
      status: 'Moderate recovery',
      avgRecoveryDays: 3,
      message: 'Log academic events and post-event check-ins to measure stress recovery time.',
      disclaimer: 'Personal pattern indicator based on recorded check-in timing. Not a clinical measurement.',
    };
  }

  // Calculate baseline stress
  const avgBaselineStress = checkIns.reduce((s, c) => s + c.stressScore, 0) / checkIns.length;

  let totalRecoveryDays = 0;
  let eventCount = 0;

  pastEvents.forEach((ev) => {
    const evDateStr = new Date(ev.eventDate).toISOString().split('T')[0];
    const postCheckIns = checkIns
      .filter((c) => new Date(c.date).toISOString().split('T')[0] >= evDateStr)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    for (let i = 0; i < postCheckIns.length; i++) {
      if (postCheckIns[i].stressScore <= avgBaselineStress + 1.0) {
        const evTime = new Date(evDateStr).getTime();
        const returnTime = new Date(postCheckIns[i].date).getTime();
        const days = Math.max(1, Math.round((returnTime - evTime) / (1000 * 3600 * 24)));
        totalRecoveryDays += days;
        eventCount++;
        break;
      }
    }
  });

  const avgRecoveryDays = eventCount > 0 ? Math.round(totalRecoveryDays / eventCount) : 3;

  let status = 'Moderate recovery';
  if (avgRecoveryDays <= 2) status = 'Short recovery';
  else if (avgRecoveryDays >= 5) status = 'Extended recovery';

  const message = `Based on your recorded check-ins, your stress returned closer to your usual range approximately ${avgRecoveryDays} days after major events.`;

  return {
    hasData: true,
    confidence,
    title: 'Pressure Recovery Time',
    status,
    avgRecoveryDays,
    message,
    disclaimer: 'Personal pattern indicator based on recorded check-in timing. Not a clinical measurement.',
  };
};

module.exports = {
  calculatePressureRecoveryTime,
};
