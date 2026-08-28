const Journal = require('../models/Journal');

// @desc    Create journal entry
// @route   POST /api/journal
// @access  Private
const createJournal = async (req, res, next) => {
  try {
    const { title, content, date } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required for journal entries',
      });
    }

    const journal = await Journal.create({
      userId: req.user._id,
      title: String(title).trim(),
      content: String(content).trim(),
      date: date ? new Date(date) : new Date(),
    });

    return res.status(201).json({
      success: true,
      message: 'Journal entry saved securely',
      journal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's journal entries (with search option)
// @route   GET /api/journal
// @access  Private
const getJournals = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = { userId: req.user._id };

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: regex }, { content: regex }];
    }

    const journals = await Journal.find(query).sort({ date: -1 });

    return res.status(200).json({
      success: true,
      count: journals.length,
      journals,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update journal entry
// @route   PUT /api/journal/:id
// @access  Private
const updateJournal = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const journal = await Journal.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found or unauthorized',
      });
    }

    if (title !== undefined) journal.title = String(title).trim();
    if (content !== undefined) journal.content = String(content).trim();

    const updatedJournal = await journal.save();

    return res.status(200).json({
      success: true,
      message: 'Journal entry updated successfully',
      journal: updatedJournal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete journal entry
// @route   DELETE /api/journal/:id
// @access  Private
const deleteJournal = async (req, res, next) => {
  try {
    const journal = await Journal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found or unauthorized',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Journal entry deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJournal,
  getJournals,
  updateJournal,
  deleteJournal,
};
