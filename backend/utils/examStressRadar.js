const { calculateInsightConfidence } = require('./confidenceCalculator');

const analyzeExamStress = (checkIns = [], events = []) => {
  const confidence = calculateInsightConfidence(checkIns.length);

  const academicEvents = events.filter((e) =>
    ['Exam', 'Assignment Deadline', 'Project Submission', 'Placement Interview'].includes(e.eventType)
  );

  if (academicEvents.length === 0 || checkIns.length < 5) {
    return {
      hasData: false,
      confidence,
      title: 'Exam Stress Radar',
      insightText: 'Add academic events (exams, assignments, interviews) and check-ins to unlock pre-event stress trajectory analysis.',
      timelinePoints: [
        { phase: '7 Days Before', avgStress: 4.5 },
        { phase: '3 Days Before', avgStress: 6.0 },
        { phase: 'Event Day', avgStress: 7.5 },
        { phase: 'After Event', avgStress: 4.0 },
      ],
    };
  }

  // Calculate stress trajectory across academic events
  let sum7Days = 0, count7Days = 0;
  let sum3Days = 0, count3Days = 0;
  let sumEventDay = 0, countEventDay = 0;
  let sumAfter = 0, countAfter = 0;

  academicEvents.forEach((ev) => {
    const evTime = new Date(ev.eventDate).getTime();

    checkIns.forEach((c) => {
      const cTime = new Date(c.date).getTime();
      const diffDays = Math.round((evTime - cTime) / (1000 * 3600 * 24));

      if (diffDays >= 4 && diffDays <= 7) {
        sum7Days += c.stressScore;
        count7Days++;
      } else if (diffDays >= 1 && diffDays <= 3) {
        sum3Days += c.stressScore;
        count3Days++;
      } else if (diffDays === 0) {
        sumEventDay += c.stressScore;
        countEventDay++;
      } else if (diffDays >= -3 && diffDays <= -1) {
        sumAfter += c.stressScore;
        countAfter++;
      }
    });
  });

  const avg7 = count7Days > 0 ? Number((sum7Days / count7Days).toFixed(1)) : 4.5;
  const avg3 = count3Days > 0 ? Number((sum3Days / count3Days).toFixed(1)) : 6.2;
  const avgEvent = countEventDay > 0 ? Number((sumEventDay / countEventDay).toFixed(1)) : 7.5;
  const avgAfter = countAfter > 0 ? Number((sumAfter / countAfter).toFixed(1)) : 4.2;

  const timelinePoints = [
    { phase: '7 Days Before', avgStress: avg7 },
    { phase: '3 Days Before', avgStress: avg3 },
    { phase: 'Event Day', avgStress: avgEvent },
    { phase: 'After Event', avgStress: avgAfter },
  ];

  let insightText = 'Based on similar events you recorded, your stress tends to increase in the days leading up to academic deadlines.';
  if (avg3 > avg7 + 1.0) {
    insightText = 'Your recorded stress shows a noticeable rise between 7 days and 3 days before academic events.';
  } else if (avgAfter < avgEvent - 1.5) {
    insightText = 'Your recorded patterns suggest a swift stress reduction following the completion of major events.';
  }

  return {
    hasData: true,
    confidence,
    title: 'Exam Stress Radar',
    insightText,
    timelinePoints,
    disclaimer: 'Personal historical pattern indicator. Does not make guaranteed predictions.',
  };
};

module.exports = {
  analyzeExamStress,
};
