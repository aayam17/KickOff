const csrf = require('csurf');

// CSRF protection middleware
const csrfProtection = csrf({
  cookie: {
    key: '_csrf',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // Use 'lax' in development
    maxAge: 3600000 // 1 hour
  },
  value: (req) => {
    // Check for token in custom header first, then fall back to body/query
    return req.headers['csrf-token'] || req.body._csrf || req.query._csrf;
  }
});

// Error handler for CSRF token errors
const csrfErrorHandler = (err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
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
