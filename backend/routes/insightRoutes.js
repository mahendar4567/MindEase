const express = require('express');
const router = express.Router();
const {
  getOverviewInsights,
  getTriggerInsights,
  getSleepInsights,
  getTrendInsights,
} = require('../controllers/insightController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All insight endpoints require authentication

router.get('/overview', getOverviewInsights);
router.get('/triggers', getTriggerInsights);
router.get('/sleep', getSleepInsights);
router.get('/trends', getTrendInsights);

module.exports = router;
