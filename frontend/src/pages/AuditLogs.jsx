import { useState, useEffect } from 'react';
import api from '../api/axios';
import './AuditLogs.css';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 50,
    action: '',
    status: '',
    search: '',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalLogs: 0
  });

  const actionTypes = [
    'LOGIN', 'LOGOUT', 'REGISTER', 'PASSWORD_CHANGE', 'PASSWORD_RESET',
    'PROFILE_UPDATE', 'EMAIL_VERIFIED', 'FAILED_LOGIN', 'ACCOUNT_LOCKED',
    'ACCOUNT_UNLOCKED', 'DATA_ACCESS', 'DATA_MODIFICATION', 'DATA_DELETION',
    'PERMISSION_CHANGE', 'ROLE_CHANGE', 'ORDER_CREATED', 'ORDER_UPDATED',
    'PAYMENT_PROCESSED', 'PRODUCT_CREATED', 'PRODUCT_UPDATED', 'PRODUCT_DELETED'
  ];

  const statusTypes = ['SUCCESS', 'FAILURE', 'WARNING'];

  useEffect(() => {
    fetchLogs();
  }, [filters.page, filters.limit, filters.action, filters.status, filters.search, filters.startDate, filters.endDate]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await api.get(`/admin/logs?${queryParams}`);
      
      if (response.data.success) {
        setLogs(response.data.data.logs);
        setPagination(response.data.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch logs');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/logs/stats');
      
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setStats({
        totalLogs: 0,
        statusStats: [],
        actionStats: [],
        recentActivity: []
      });
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleExport = async () => {
    try {
      const queryParams = new URLSearchParams();
      ['action', 'status', 'startDate', 'endDate'].forEach(key => {
        if (filters[key]) queryParams.append(key, filters[key]);
      });

      const response = await api.get(`/admin/logs/export?${queryParams}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audit_logs_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error exporting logs:', err);
      alert('Failed to export logs');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SUCCESS':
        return '✓';
      case 'FAILURE':
        return '✗';
      case 'WARNING':
        return '⚠';
      default:
        return '';
    }
  };

  const getActionBadgeClass = (action) => {
    if (action.includes('LOGIN') || action === 'REGISTER') return 'badge-blue';
    if (action.includes('FAILED') || action.includes('LOCKED')) return 'badge-red';
    if (action.includes('DELETE')) return 'badge-red';
    if (action.includes('CREATE') || action.includes('UPDATE')) return 'badge-orange';
    if (action.includes('PASSWORD')) return 'badge-purple';
    return 'badge-gray';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="audit-logs-container">
      <div className="audit-logs-header">
        <h1>Audit Log Viewer</h1>
        <p>Monitor and analyze user activity across the system</p>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #ef4444',
          color: '#991b1b',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Logs</div>
            <div className="stat-value">{stats.totalLogs.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Success Rate</div>
            <div className="stat-value success">
              {stats.statusStats.length > 0 
                ? Math.round((stats.statusStats.find(s => s._id === 'SUCCESS')?.count || 0) / stats.totalLogs * 100)
                : 0}%
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Failed Actions</div>
            <div className="stat-value error">
              {stats.statusStats.find(s => s._id === 'FAILURE')?.count || 0}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Most Common Action</div>
            <div className="stat-value small">
              {stats.actionStats[0]?._id || 'N/A'}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-container">
        <div className="filters-grid">
          {/* Search */}
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Username or IP..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          {/* Action Filter */}
          <div className="filter-group">
            <label>Action</label>
            <select
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
            >
              <option value="">All Actions</option>
              {actionTypes.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              {statusTypes.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div className="filter-group">
            <label>Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>

          {/* End Date */}
          <div className="filter-group">
            <label>End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="filter-actions">
          <button onClick={fetchLogs} className="btn-primary">
            <span>🔄</span> Refresh
          </button>
          <button onClick={handleExport} className="btn-success">
            <span>📥</span> Export CSV
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="logs-table-container">
        <table className="logs-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Status</th>
              <th>IP Address</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center">Loading logs...</td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  {error ? 'Failed to load logs' : 'No logs found'}
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id}>
                  <td className="timestamp">{formatDate(log.timestamp)}</td>
                  <td>
                    <div className="user-info">
                      <div className="user-name">{log.username}</div>
                      <div className="user-email">{log.userId?.email || 'N/A'}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`action-badge ${getActionBadgeClass(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td>
                    <span className={`status-indicator status-${log.status.toLowerCase()}`}>
                      {getStatusIcon(log.status)} {log.status}
                    </span>
                  </td>
                  <td className="ip-address">{log.ipAddress}</td>
                  <td className="details">
                    {Object.keys(log.details || {}).length > 0 
                      ? JSON.stringify(log.details) 
                      : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination">
            <div className="pagination-info">
              Showing page {pagination.currentPage} of {pagination.totalPages} 
              ({pagination.totalLogs} total logs)
            </div>
            <div className="pagination-buttons">
              <button
                onClick={() => handleFilterChange('page', Math.max(1, filters.page - 1))}
                disabled={filters.page === 1}
                className="btn-secondary"
              >
                Previous
              </button>
              <button
                onClick={() => handleFilterChange('page', Math.min(pagination.totalPages, filters.page + 1))}
                disabled={filters.page === pagination.totalPages}
                className="btn-secondary"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
