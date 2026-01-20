import "./PasswordMeter.css";

export default function PasswordMeter({ password }) {
  const getStrength = () => {
    let score = 0;

    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  };

  const strength = getStrength();

  const labels = [
    "Very Weak",
    "Weak",
    "Fair",
    "Good",
    "Strong",
    "Very Strong"
  ];

  const colors = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#84cc16",
    "#22c55e",
    "#10b981"
  ];

  return (
    <div className="password-meter">
      <div className="password-meter-bar">
        <div
          className="password-meter-fill"
          style={{
            width: `${(strength / 5) * 100}%`,
            background: colors[strength]
          }}
        />
      </div>
      <div className="password-meter-label">
        <span style={{ color: colors[strength] }}>
          {labels[strength]}
        </span>
        {password && (
          <small className="password-requirements">
            {password.length < 12 && "• 12+ characters "}
            {!/[A-Z]/.test(password) && "• Uppercase "}
            {!/[a-z]/.test(password) && "• Lowercase "}
            {!/[0-9]/.test(password) && "• Number "}
            {!/[^A-Za-z0-9]/.test(password) && "• Special char"}
          </small>
        )}
      </div>
    </div>
  );
}
