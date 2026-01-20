import { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOTP } from "../api/auth.api";
import { AuthContext } from "../context/AuthContext";
import { useSnackbar } from "../components/Snackbar";
import "./VerifyOTP.css";

export default function VerifyOTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { success, error } = useSnackbar();

  const email = location.state?.email;
  const userId = location.state?.userId;

  useEffect(() => {
    if (!email || !userId) {
      error("Invalid access. Please login again.");
      navigate("/login");
    }
  }, [email, userId, navigate]);

  const handleChange = (index, value) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      document.getElementById("otp-5")?.focus();
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      error("Please enter all 6 digits");
      return;
    }

    setLoading(true);

    try {
      const res = await verifyOTP({ userId, otp: otpString });

      loginUser(res.data.token, res.data.role);
      success("Login successful!");
      navigate(res.data.role === "admin" ? "/admin" : "/");
    } catch (err) {
      error(err.response?.data?.message || "OTP verification failed");
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0")?.focus();
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    // Implement resend logic if backend supports it
    success("OTP resent to your email");
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-pattern"></div>
      </div>
      
      <div className="auth-container" style={{ gridTemplateColumns: "1fr" }}>
        <div className="auth-card fade-in" style={{ maxWidth: "500px", margin: "0 auto" }}>
          <div className="auth-header">
            <div className="auth-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <h2 className="auth-title">Verify Your Account</h2>
            <p className="auth-subtitle">
              Enter the 6-digit code sent to<br />
              <strong>{email}</strong>
            </p>
          </div>

          <form onSubmit={submit} className="auth-form">
            <div className="otp-inputs" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  className="otp-input"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <button type="submit" className="btn btn-primary btn-auth" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Verify & Continue
                </>
              )}
            </button>

            <div className="otp-footer">
              <p>Didn't receive the code?</p>
              <button type="button" className="btn-text" onClick={resendOTP}>
                Resend Code
              </button>
            </div>
          </form>

          <div className="auth-footer">
            <button className="btn-text" onClick={() => navigate("/login")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
