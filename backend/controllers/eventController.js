const Event = require('../models/Event');

// @desc    Create important event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res, next) => {
  try {
    const { title, eventType, eventDate, notes } = req.body;

    if (!title || !eventDate) {
      return res.status(400).json({
        success: false,
        message: 'Event title and date are required',
      });
    }

    const event = await Event.create({
      userId: req.user._id,
      title: String(title).trim(),
      eventType: eventType || 'Other',
      eventDate: new Date(eventDate),
      notes: notes ? String(notes).trim() : '',
    });

    return res.status(201).json({
      success: true,
      message: 'Event added successfully',
      event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user events
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ userId: req.user._id }).sort({ eventDate: 1 });

    return res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update important event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = async (req, res, next) => {
  try {
    const { title, eventType, eventDate, notes } = req.body;

    const event = await Event.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found or unauthorized',
      });
    }

    if (title !== undefined) event.title = String(title).trim();
    if (eventType !== undefined) event.eventType = eventType;
    if (eventDate !== undefined) event.eventDate = new Date(eventDate);
    if (notes !== undefined) event.notes = String(notes).trim();

    const updatedEvent = await event.save();

    return res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit Before / After Reflection for Event
// @route   PUT /api/events/:id/reflection
// @access  Private
const submitEventReflection = async (req, res, next) => {
  try {
    const { type, moodScore, stressScore, note } = req.body;

    if (!['before', 'after'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Reflection type must be "before" or "after"',
      });
    }

    const event = await Event.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found or unauthorized',
      });
    }

    const reflectionObj = {
      moodScore: Number(moodScore),
      stressScore: Number(stressScore),
      note: note ? String(note).trim() : '',
      date: new Date(),
    };

    if (type === 'before') {
      event.beforeReflection = reflectionObj;
    } else {
      event.afterReflection = reflectionObj;
    }

    const updatedEvent = await event.save();

    return res.status(200).json({
      success: true,
      message: `${type === 'before' ? 'Before' : 'After'} event reflection saved successfully`,
      event: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found or unauthorized',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Event removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getEvents,
  updateEvent,
  submitEventReflection,
  deleteEvent,
};
