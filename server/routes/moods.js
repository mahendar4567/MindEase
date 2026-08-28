const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Mood = require('../models/Mood');

// @route   GET api/moods
// @desc    Get all user moods
router.get('/', auth, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id }).sort({ date: -1 });
    res.json(moods);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/moods
// @desc    Add new mood
router.post('/', auth, async (req, res) => {
  const { level, note } = req.body;
  try {
    const newMood = new Mood({
      user: req.user.id,
      level,
      note
    });
    const mood = await newMood.save();
    res.json(mood);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
