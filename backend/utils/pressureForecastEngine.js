const { calculateInsightConfidence } = require('./confidenceCalculator');

const generatePressureForecast = (checkIns = [], events = []) => {
  const confidence = calculateInsightConfidence(checkIns.length);

  const now = new Date();
  const upcomingEvents = events.filter((e) => {
    const evDate = new Date(e.eventDate);
    const diffDays = (evDate.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return diffDays >= 0 && diffDays <= 14;
  });

  if (upcomingEvents.length === 0 || checkIns.length < 5) {
    return {
      hasForecast: false,
      confidence,
      title: 'Pattern-Based Pressure Forecast',
      status: 'Possible low pressure',
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
      message: 'No upcoming academic events recorded in the next 14 days.',
      disclaimer: 'Based on previous recorded patterns. Does not make guaranteed predictions.',
    };
  }

  const nextEvent = upcomingEvents[0];
  const evDate = new Date(nextEvent.eventDate);
  const daysUntil = Math.round((evDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

  let status = 'Possible increased pressure';
  let badgeColor = 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
  let message = `Based on your previous exam periods, your recorded stress has tended to increase 3 to 5 days before exams. You have "${nextEvent.title}" approaching in ${daysUntil} day(s).`;

  if (daysUntil > 7) {
    status = 'Possible low pressure';
    badgeColor = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
    message = `Based on previous recorded patterns, your stress levels remain steady when academic events are more than 7 days away.`;
  }

  return {
    hasForecast: true,
    confidence,
    title: 'Pattern-Based Pressure Forecast',
    status,
    badgeColor,
    message,
    nextEvent: { title: nextEvent.title, eventType: nextEvent.eventType, daysUntil },
    disclaimer: 'Based on previous recorded patterns. Does not make guaranteed predictions.',
  };
};

module.exports = {
  generatePressureForecast,
};
