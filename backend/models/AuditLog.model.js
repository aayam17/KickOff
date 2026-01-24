const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'LOGIN',
      'LOGOUT',
      'REGISTER',
      'PASSWORD_CHANGE',
      'PASSWORD_RESET',
      'PROFILE_UPDATE',
      'EMAIL_VERIFIED',
      'FAILED_LOGIN',
      'ACCOUNT_LOCKED',
      'ACCOUNT_UNLOCKED',
      'DATA_ACCESS',
      'DATA_MODIFICATION',
      'DATA_DELETION',
      'PERMISSION_CHANGE',
      'ROLE_CHANGE',
      'ORDER_CREATED',
      'ORDER_UPDATED',
      'PAYMENT_PROCESSED',
      'PRODUCT_CREATED',
      'PRODUCT_UPDATED',
      'PRODUCT_DELETED'
    ]
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: String,
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILURE', 'WARNING'],
    default: 'SUCCESS'
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now,
    immutable: true
  }
}, {
  timestamps: false
});

// Indexes for efficient querying
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ status: 1, timestamp: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
