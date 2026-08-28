const express = require('express');
const router = express.Router();
const { getIntelligenceSummary } = require('../controllers/intelligenceController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Require auth for pattern intelligence endpoints

router.get('/summary', getIntelligenceSummary);

module.exports = router;
