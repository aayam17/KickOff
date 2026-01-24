const csrf = require('csurf');

// CSRF protection middleware
// Using cookie-based tokens for stateless operation
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict', // Prevents CSRF attacks
    maxAge: 3600000 // 1 hour
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
