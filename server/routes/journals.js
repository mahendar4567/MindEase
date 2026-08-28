const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Journal = require('../models/Journal');

// @route   GET api/journals
// @desc    Get all user journals
router.get('/', auth, async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user.id }).sort({ date: -1 });
    res.json(journals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/journals
// @desc    Add new journal
router.post('/', auth, async (req, res) => {
  const { title, content, aiSuggestion } = req.body;
  try {
    const newJournal = new Journal({
      user: req.user.id,
      title,
      content,
      aiSuggestion
    });
    const journal = await newJournal.save();
    res.json(journal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/journals/:id
// @desc    Delete journal
router.delete('/:id', auth, async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal) return res.status(404).json({ msg: 'Journal not found' });
    
    // Make sure user owns journal
    if (journal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await journal.deleteOne();
    res.json({ msg: 'Journal removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/journals/:id
// @desc    Update journal
router.put('/:id', auth, async (req, res) => {
  const { title, content, aiSuggestion } = req.body;
  
  // Build journal object
  const journalFields = {};
  if (title) journalFields.title = title;
  if (content) journalFields.content = content;
  if (aiSuggestion) journalFields.aiSuggestion = aiSuggestion;

  try {
    let journal = await Journal.findById(req.params.id);
    if (!journal) return res.status(404).json({ msg: 'Journal not found' });

    // Make sure user owns journal
    if (journal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    journal = await Journal.findByIdAndUpdate(
      req.params.id,
      { $set: journalFields },
      { new: true }
    );
    res.json(journal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
