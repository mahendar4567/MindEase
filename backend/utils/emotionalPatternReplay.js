const generatePatternReplay = (checkIns = [], events = [], daysCount = 7) => {
  const sortedCheckIns = [...checkIns].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const selected = sortedCheckIns.slice(-daysCount);

  const replaySteps = selected.map((c, i) => {
    const dStr = new Date(c.date).toISOString().split('T')[0];
    const eventOnDay = events.find(
      (e) => new Date(e.eventDate).toISOString().split('T')[0] === dStr
    );

    let summary = 'Mood stable';
    if (c.stressScore >= 8) summary = 'Highest recorded stress';
    else if (c.stressScore >= 6) summary = 'Stress increased';
    else if (c.sleepQuality && c.sleepQuality <= 2) summary = 'Sleep quality decreased';
    else if (eventOnDay) summary = `Academic event: ${eventOnDay.title}`;

    return {
      stepIndex: i + 1,
      date: c.date,
      dateLabel: new Date(c.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      mood: c.moodScore,
      stress: c.stressScore,
      energy: c.energyLevel || 5,
      sleepDuration: c.sleepDuration,
      summary,
      event: eventOnDay ? { title: eventOnDay.title, type: eventOnDay.eventType } : null,
    };
  });

  return {
    totalSteps: replaySteps.length,
    replaySteps,
  };
};

module.exports = {
  generatePatternReplay,
};
