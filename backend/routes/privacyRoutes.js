const express = require('express');
const router = express.Router();
const {
  setupPin,
  verifyPin,
  togglePrivacyMode,
} = require('../controllers/privacyController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All privacy endpoints require authentication

router.post('/pin', setupPin);
router.post('/verify-pin', verifyPin);
router.put('/mode', togglePrivacyMode);

module.exports = router;
