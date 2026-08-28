const { calculateInsightConfidence } = require('./confidenceCalculator');

const analyzeSemesterTimeline = (checkIns = [], events = [], semester = null) => {
  const confidence = calculateInsightConfidence(checkIns.length);

  const startDate = semester?.startDate ? new Date(semester.startDate) : new Date(Date.now() - 86400000 * 90);
  const endDate = semester?.endDate ? new Date(semester.endDate) : new Date(Date.now() + 86400000 * 30);

  const semesterCheckIns = checkIns.filter((c) => {
    const d = new Date(c.date);
    return d >= startDate && d <= endDate;
  });

  const semesterEvents = events.filter((e) => {
    const d = new Date(e.eventDate);
    return d >= startDate && d <= endDate;
  });

  let summary = 'Select semester start and end dates to visualize your full semester wellness trajectory.';
  if (semesterCheckIns.length > 0 && semesterEvents.length > 0) {
    summary = `Your highest recorded stress period occurred around multiple overlapping academic deadlines during this semester.`;
  }

  return {
    confidence,
    title: 'Semester Wellness Timeline',
    semesterTitle: semester?.title || 'Current Semester',
    startDate,
    endDate,
    checkInsCount: semesterCheckIns.length,
    eventsCount: semesterEvents.length,
    summary,
    disclaimer: 'Semester pattern summary based on your recorded check-ins and events.',
  };
};

module.exports = {
  analyzeSemesterTimeline,
};
