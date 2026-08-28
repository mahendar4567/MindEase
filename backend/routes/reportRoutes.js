const express = require('express');
const router = express.Router();
const { getWeeklyReport } = require('../controllers/insightController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Require auth for report endpoints

router.get('/weekly', getWeeklyReport);

module.exports = router;
