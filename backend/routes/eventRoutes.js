const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEvents,
  updateEvent,
  submitEventReflection,
  deleteEvent,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Require auth for all event endpoints

router.post('/', createEvent);
router.get('/', getEvents);
router.put('/:id', updateEvent);
router.put('/:id/reflection', submitEventReflection);
router.delete('/:id', deleteEvent);

module.exports = router;
