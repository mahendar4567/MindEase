const express = require('express');
const router = express.Router();
const {
  getDataMetrics,
  exportUserData,
  deleteCategoryData,
  deleteAccountData,
} = require('../controllers/transparencyController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Require auth for all transparency endpoints

router.get('/metrics', getDataMetrics);
router.get('/export', exportUserData);
router.delete('/category/:category', deleteCategoryData);
router.delete('/account', deleteAccountData);

module.exports = router;
