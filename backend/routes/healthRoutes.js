const express = require('express');
const router = express.Router();

// @desc    Health check route
// @route   GET /api/health
// @access  Public
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MindEase API is running',
  });
});

module.exports = router;
