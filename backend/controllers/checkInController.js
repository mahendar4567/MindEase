const CheckIn = require('../models/CheckIn');

// Helper: Calculate Check-in Streak
const calculateStreak = (checkIns) => {
  if (!checkIns || checkIns.length === 0) return 0;

  const dateStrings = Array.from(
    new Set(checkIns.map((c) => new Date(c.date).toISOString().split('T')[0]))
  ).sort().reverse();

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

  if (!dateStrings.includes(todayStr) && !dateStrings.includes(yesterdayStr)) {
    return 0;
  }

  let streak = 0;
  let currentDate = dateStrings.includes(todayStr) ? new Date() : yesterdayDate;

  while (true) {
    const checkStr = currentDate.toISOString().split('T')[0];
    if (dateStrings.includes(checkStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

// Helper: Check-in Gap Detection (Mindful Return)
const detectCheckInGap = (checkIns) => {
  if (!checkIns || checkIns.length < 2) return { isGap: false, daysGap: 0 };

  const sortedDates = Array.from(
    new Set(checkIns.map((c) => new Date(c.date).toISOString().split('T')[0]))
  ).sort().reverse();

  const latestStr = sortedDates[0];
  const previousStr = sortedDates[1];

  const latestTime = new Date(latestStr).getTime();
  const previousTime = new Date(previousStr).getTime();

  const diffDays = Math.round((latestTime - previousTime) / (1000 * 3600 * 24));

  if (diffDays >= 3) {
    return {
      isGap: true,
      daysGap: diffDays,
      message: 'Welcome back. No need to catch up—just start from today.',
    };
  }

  return { isGap: false, daysGap: 0 };
};

// @desc    Create daily check-in
// @route   POST /api/checkins
// @access  Private
const createCheckIn = async (req, res, next) => {
  try {
    const {
      moodScore,
      stressScore,
      energyLevel,
      triggers,
      helpfulActions,
      sleepDuration,
      sleepQuality,
      note,
      date,
    } = req.body;

    if (moodScore === undefined || stressScore === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Mood score and stress score are required',
      });
    }

    const checkInDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(checkInDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(checkInDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingCheckIn = await CheckIn.findOne({
      userId: req.user._id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingCheckIn) {
      existingCheckIn.moodScore = Number(moodScore);
      existingCheckIn.stressScore = Number(stressScore);
      existingCheckIn.energyLevel = energyLevel !== undefined ? Number(energyLevel) : existingCheckIn.energyLevel;
      existingCheckIn.triggers = Array.isArray(triggers) ? triggers : existingCheckIn.triggers;
      existingCheckIn.helpfulActions = Array.isArray(helpfulActions) ? helpfulActions : existingCheckIn.helpfulActions;
      existingCheckIn.sleepDuration = sleepDuration !== undefined && sleepDuration !== '' ? Number(sleepDuration) : existingCheckIn.sleepDuration;
      existingCheckIn.sleepQuality = sleepQuality !== undefined && sleepQuality !== '' ? Number(sleepQuality) : existingCheckIn.sleepQuality;
      existingCheckIn.note = note !== undefined ? String(note).trim() : existingCheckIn.note;

      const updatedCheckIn = await existingCheckIn.save();
      return res.status(200).json({
        success: true,
        message: "Today's check-in updated successfully",
        checkIn: updatedCheckIn,
      });
    }

    const checkIn = await CheckIn.create({
      userId: req.user._id,
      moodScore: Number(moodScore),
      stressScore: Number(stressScore),
      energyLevel: energyLevel !== undefined ? Number(energyLevel) : 5,
      triggers: Array.isArray(triggers) ? triggers : [],
      helpfulActions: Array.isArray(helpfulActions) ? helpfulActions : [],
      sleepDuration: sleepDuration !== undefined && sleepDuration !== '' ? Number(sleepDuration) : undefined,
      sleepQuality: sleepQuality !== undefined && sleepQuality !== '' ? Number(sleepQuality) : undefined,
      note: note ? String(note).trim() : '',
      date: checkInDate,
    });

    return res.status(201).json({
      success: true,
      message: 'Daily check-in saved successfully',
      checkIn,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get today's check-in
// @route   GET /api/checkins/today
// @access  Private
const getTodayCheckIn = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const checkIn = await CheckIn.findOne({
      userId: req.user._id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    return res.status(200).json({
      success: true,
      checkIn: checkIn || null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user check-ins with streak count & Mindful Return gap detection
// @route   GET /api/checkins
// @access  Private
const getCheckIns = async (req, res, next) => {
  try {
    const { days } = req.query;
    let query = { userId: req.user._id };

    if (days && !isNaN(Number(days))) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - Number(days));
      query.date = { $gte: startDate };
    }

    const checkIns = await CheckIn.find(query).sort({ date: -1 });
    const allCheckIns = await CheckIn.find({ userId: req.user._id }).sort({ date: -1 });

    const streak = calculateStreak(allCheckIns);
    const gapInfo = detectCheckInGap(allCheckIns);

    return res.status(200).json({
      success: true,
      count: checkIns.length,
      streak,
      mindfulReturnGap: gapInfo,
      checkIns,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update specific check-in
// @route   PUT /api/checkins/:id
// @access  Private
const updateCheckIn = async (req, res, next) => {
  try {
    const { moodScore, stressScore, energyLevel, triggers, helpfulActions, sleepDuration, sleepQuality, note } = req.body;

    const checkIn = await CheckIn.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!checkIn) {
      return res.status(404).json({
        success: false,
        message: 'Check-in not found or unauthorized',
      });
    }

    if (moodScore !== undefined) checkIn.moodScore = Number(moodScore);
    if (stressScore !== undefined) checkIn.stressScore = Number(stressScore);
    if (energyLevel !== undefined) checkIn.energyLevel = Number(energyLevel);
    if (Array.isArray(triggers)) checkIn.triggers = triggers;
    if (Array.isArray(helpfulActions)) checkIn.helpfulActions = helpfulActions;
    if (sleepDuration !== undefined) checkIn.sleepDuration = Number(sleepDuration);
    if (sleepQuality !== undefined) checkIn.sleepQuality = Number(sleepQuality);
    if (note !== undefined) checkIn.note = String(note).trim();

    const updatedCheckIn = await checkIn.save();

    return res.status(200).json({
      success: true,
      message: 'Check-in updated successfully',
      checkIn: updatedCheckIn,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete check-in
// @route   DELETE /api/checkins/:id
// @access  Private
const deleteCheckIn = async (req, res, next) => {
  try {
    const checkIn = await CheckIn.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!checkIn) {
      return res.status(404).json({
        success: false,
        message: 'Check-in not found or unauthorized',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Check-in removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCheckIn,
  getTodayCheckIn,
  getCheckIns,
  updateCheckIn,
  deleteCheckIn,
};
