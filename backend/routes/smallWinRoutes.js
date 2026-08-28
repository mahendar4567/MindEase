const express = require('express');
const router = express.Router();
const {
  createSmallWin,
  getSmallWins,
  deleteSmallWin,
} = require('../controllers/smallWinController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All routes require authentication

router.post('/', createSmallWin);
router.get('/', getSmallWins);
router.delete('/:id', deleteSmallWin);

module.exports = router;
