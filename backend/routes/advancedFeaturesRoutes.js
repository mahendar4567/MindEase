const express = require('express');
const router = express.Router();
const {
  getAdvancedFeaturesSummary,
  saveSemesterConfig,
} = require('../controllers/advancedFeaturesController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Require auth for feature endpoints

router.get('/summary', getAdvancedFeaturesSummary);
router.post('/semester', saveSemesterConfig);

module.exports = router;
