const csrf = require('csurf');

// Single CSRF protection configuration shared across the app
// This validates CSRF tokens for POST/PUT/DELETE/PATCH
const csrfProtection = csrf({
  cookie: {
    key: '_csrf',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 3600000
  },
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS'], // Don't validate safe methods
  value: (req) => {
    // Check for token in custom header first, then fall back to body/query
    return req.headers['csrf-token'] || req.body._csrf || req.query._csrf;
  }
});

// Error handler for CSRF token errors
const csrfErrorHandler = (err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    console.error('CSRF token validation failed:', {
      headers: req.headers['csrf-token'],
      method: req.method,
      url: req.url
    });
    return res.status(403).json({
      success: false,
      message: 'Invalid CSRF token. Please refresh the page and try again.',
      code: 'INVALID_CSRF_TOKEN'
    });
  }
  next(err);
};

module.exports = {
  csrfProtection,
  csrfErrorHandler
};
