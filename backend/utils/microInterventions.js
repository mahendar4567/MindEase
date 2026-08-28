// Reusable MindEase Moments Micro-Interventions Engine
const generateMindEaseMoment = (checkIns, events = []) => {
  if (!checkIns || checkIns.length === 0) {
    return {
      title: 'MindEase Moment',
      suggestion: 'Welcome! Take a moment today to reflect on your mood, stress, and energy.',
      type: 'general',
    };
  }

  const latest = checkIns[0];

  // Check if an academic event is upcoming within 3 days
  const now = new Date();
  const upcomingExam = events.find((e) => {
    const evDate = new Date(e.eventDate);
    const diffDays = (evDate.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return diffDays >= 0 && diffDays <= 3 && (e.eventType === 'Exam' || e.eventType === 'Assignment Deadline');
  });

  if (upcomingExam && latest.stressScore >= 6) {
    return {
      title: 'MindEase Moment • Academic Preparation',
      suggestion: `Your recorded stress often increases near academic deadlines like "${upcomingExam.title}". Try preparing a simple plan for your next study block.`,
      type: 'academic',
    };
  }

  if (latest.stressScore >= 7) {
    return {
      title: 'MindEase Moment • Calm Breathing',
      suggestion: 'Take 60 seconds. Try slow breathing before continuing with your study session.',
      type: 'stress',
    };
  }

  if (latest.energyLevel && latest.energyLevel <= 4) {
    return {
      title: 'MindEase Moment • Rest & Hydration',
      suggestion: 'Your energy has been lower recently. Consider taking a short 10-minute break or stretching before your next task.',
      type: 'energy',
    };
  }

  return {
    title: 'MindEase Moment • Daily Reflection',
    suggestion: 'Your recorded check-ins show steady self-awareness. Paying attention to your daily rhythm helps foster balanced student wellness.',
    type: 'positive',
  };
};

module.exports = {
  generateMindEaseMoment,
};
