const express = require('express');
const router = express.Router();
const { csrfProtection } = require('../middleware/csrf.middleware');

// Get CSRF token - GET is ignored by csrfProtection so no validation occurs
router.get('/csrf-token', csrfProtection, (req, res) => {
  try {
    const token = req.csrfToken();
    res.json({
      success: true,
      csrfToken: token
    });
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate CSRF token'
    });
  }
});

module.exports = router;
