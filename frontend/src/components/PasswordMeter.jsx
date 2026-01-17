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

  return (
    <div style={{ marginTop: "8px" }}>
      <div
        style={{
          height: "6px",
          width: `${(strength / 5) * 100}%`,
          background:
            strength <= 2
              ? "red"
              : strength === 3
              ? "orange"
              : strength === 4
              ? "yellowgreen"
              : "green",
          transition: "width 0.3s"
        }}
      />
      <small>Password strength: {labels[strength]}</small>
    </div>
  );
}
