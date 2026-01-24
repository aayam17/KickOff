const AuditLog = require('../models/AuditLog.model');
const User = require('../models/User.model');
const { createAuditLog } = require('../middleware/auditLogger.middleware');

// Get all audit logs with filtering and pagination
exports.getAllLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      userId,
      action,
      status,
      startDate,
      endDate,
      search
    } = req.query;

    // Build filter object
    const filter = {};

    if (userId) filter.userId = userId;
    if (action) filter.action = action;
    if (status) filter.status = status;

    // Date range filter
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    // Search filter (username or IP)
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { ipAddress: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .populate('userId', 'username email name')
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      AuditLog.countDocuments(filter)
    ]);

    // Log admin access
    await createAuditLog(
      req.user.id,
      req.user.email,
      'DATA_ACCESS',
      req,
      'SUCCESS',
      { resource: 'audit_logs', filters: filter }
    );

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalLogs: total,
          logsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching audit logs'
    });
  }
};

// Get logs for specific user
exports.getUserLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const user = await User.findById(userId).select('name email');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
      AuditLog.find({ userId })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      AuditLog.countDocuments({ userId })
    ]);

    // Log admin access
    await createAuditLog(
      req.user.id,
      req.user.email,
      'DATA_ACCESS',
      req,
      'SUCCESS',
      { resource: 'user_logs', targetUser: userId }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        logs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalLogs: total,
          logsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user logs'
    });
  }
};

// Get log statistics
exports.getLogStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.timestamp = {};
      if (startDate) dateFilter.timestamp.$gte = new Date(startDate);
      if (endDate) dateFilter.timestamp.$lte = new Date(endDate);
    }

    const [
      actionStats,
      statusStats,
      recentActivity,
      totalLogs
    ] = await Promise.all([
      AuditLog.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      AuditLog.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      AuditLog.find(dateFilter)
        .sort({ timestamp: -1 })
        .limit(10)
        .populate('userId', 'name email')
        .lean(),
      AuditLog.countDocuments(dateFilter)
    ]);

    // Log admin access
    await createAuditLog(
      req.user.id,
      req.user.email,
      'DATA_ACCESS',
      req,
      'SUCCESS',
      { resource: 'log_statistics' }
    );

    res.json({
      success: true,
      data: {
        actionStats,
        statusStats,
        recentActivity,
        totalLogs
      }
    });
  } catch (error) {
    console.error('Error fetching log stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching log statistics'
    });
  }
};

// Export logs (CSV format)
exports.exportLogs = async (req, res) => {
  try {
    const { startDate, endDate, action, status } = req.query;

    const filter = {};
    if (action) filter.action = action;
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const logs = await AuditLog.find(filter)
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .lean();

    // Create CSV content
    const csvHeader = 'Timestamp,Username,Email,Action,Status,IP Address,User Agent,Details\n';
    const csvRows = logs.map(log => {
      const details = JSON.stringify(log.details).replace(/"/g, '""');
      return `"${log.timestamp}","${log.username}","${log.userId?.email || 'N/A'}","${log.action}","${log.status}","${log.ipAddress}","${log.userAgent}","${details}"`;
    }).join('\n');

    const csv = csvHeader + csvRows;

    // Log export action
    await createAuditLog(
      req.user.id,
      req.user.email,
      'DATA_ACCESS',
      req,
      'SUCCESS',
      { resource: 'log_export', recordCount: logs.length }
    );

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="audit_logs_${Date.now()}.csv"`);
    res.send(csv);
  } catch (error) {
    console.error('Error exporting logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting logs'
    });
  }
};
