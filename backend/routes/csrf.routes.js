const express = require('express');
const router = express.Router();
const { csrfProtection } = require('../middleware/csrf.middleware');

// Get CSRF token
router.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({
    success: true,
    csrfToken: req.csrfToken()
  });
});

module.exports = router;
