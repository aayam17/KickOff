import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useSnackbar } from "../components/Snackbar";
import api from "../api/axios";
import Loader from "../components/Loader";
import "./Profile.css";

export default function Profile() {
  const { token, role, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { error } = useSnackbar();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get("/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(res.data.user);
    } catch (err) {
      error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader fullscreen message="Loading profile..." />;
  }

  if (!userData) {
    return (
      <div className="profile-error">
        <h2>Unable to load profile</h2>
        <button className="btn btn-primary" onClick={() => window.location.href = "/"}>
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-avatar">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div className="profile-header-content">
              <h1 className="profile-name">{userData.name}</h1>
              <p className="profile-email">{userData.email}</p>
              <span className={`role-badge ${role === 'admin' ? 'admin' : 'user'}`}>
                {role === 'admin' ? '👑 Admin' : '👤 User'}
              </span>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-item-profile">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <div>
                <div className="stat-label-profile">Member Since</div>
                <div className="stat-value-profile">
                  {new Date(userData.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
            <div className="stat-item-profile">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <div>
                <div className="stat-label-profile">Security</div>
                <div className="stat-value-profile">
                  {userData.mfaEnabled ? 'MFA Enabled' : 'Standard'}
                </div>
              </div>
            </div>
          </div>

          <div className="profile-card">
            <div className="card-header-profile">
              <h2>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Personal Information
              </h2>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Full Name
                </div>
                <div className="info-value">{userData.name}</div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Email Address
                </div>
                <div className="info-value">{userData.email}</div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Account Role
                </div>
                <div className="info-value">{role === 'admin' ? 'Administrator' : 'Customer'}</div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Joined
                </div>
                <div className="info-value">
                  {new Date(userData.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="profile-card security-card">
            <div className="card-header-profile">
              <h2>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Security Settings
              </h2>
            </div>
            <div className="security-info">
              <div className="security-item">
                <div className="security-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <div>
                  <div className="security-label">Password</div>
                  <div className="security-value">••••••••••••</div>
                </div>
              </div>
              <div className="security-item">
                <div className="security-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div>
                  <div className="security-label">Two-Factor Authentication</div>
                  <div className="security-value">
                    {userData.mfaEnabled ? (
                      <span className="badge badge-success">Enabled</span>
                    ) : (
                      <span className="badge badge-warning">Disabled</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn btn-secondary" onClick={() => window.location.href = "/orders"}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
              </svg>
              View My Orders
            </button>
            <button className="btn btn-outline" onClick={() => { logout(); window.location.href = "/login"; }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
