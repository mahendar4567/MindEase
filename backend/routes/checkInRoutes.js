const express = require('express');
const router = express.Router();
const {
  createCheckIn,
  getTodayCheckIn,
  getCheckIns,
  updateCheckIn,
  deleteCheckIn,
} = require('../controllers/checkInController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Require auth for all check-in endpoints

router.post('/', createCheckIn);
router.get('/', getCheckIns);
router.get('/today', getTodayCheckIn);
router.put('/:id', updateCheckIn);
router.delete('/:id', deleteCheckIn);

module.exports = router;
