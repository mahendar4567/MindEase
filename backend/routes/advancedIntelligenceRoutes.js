const express = require('express');
const router = express.Router();
const { getAdvancedIntelligenceSummary } = require('../controllers/advancedIntelligenceController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All pattern intelligence endpoints require authentication

router.get('/summary', getAdvancedIntelligenceSummary);

module.exports = router;
