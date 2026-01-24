const AuditLog = require('../models/AuditLog.model');

/**
 * Create an audit log entry
 * @param {String} userId 
 * @param {String} username 
 * @param {String} action 
 * @param {Object} req 
 * @param {String} status 
 * @param {Object} details 
 */
const createAuditLog = async (userId, username, action, req, status = 'SUCCESS', details = {}) => {
  try {
    // Extract IP address (handle various proxy scenarios)
    const ipAddress = 
      req.ip || 
      req.headers['x-forwarded-for']?.split(',')[0] || 
      req.connection.remoteAddress || 
      req.socket.remoteAddress ||
      'unknown';

    const userAgent = req.headers['user-agent'] || 'unknown';

    await AuditLog.create({
      userId,
      username,
      action,
      ipAddress,
      userAgent,
      status,
      details
    });
  } catch (error) {
    // Log to console but don't throw - audit logging shouldn't break app flow
    console.error('Audit log creation failed:', error);
  }
};

module.exports = { createAuditLog };
