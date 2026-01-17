const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const { generateOTP } = require("../utils/otp");
const { sendOTP } = require("../utils/email");

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

/* REGISTER */
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "Email already registered" });

    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: "User registered securely",
      userId: user._id
    });
  } catch {
    res.status(500).json({ message: "Registration failed" });
  }
};

/* LOGIN WITH MFA */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    /* Check lock */
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(423).json({
        message: "Account locked. Try again later."
      });
    }

    const isMatch = await user.comparePassword(password);

    /* ❗ UPDATED LOCKOUT LOGIC */
    if (!isMatch) {
      user.failedLoginAttempts += 1;

      if (user.failedLoginAttempts >= MAX_ATTEMPTS) {
        user.lockUntil = Date.now() + LOCK_TIME;
      }

      await user.save();
      return res.status(401).json({ message: "Invalid credentials" });
    }

    /* Reset failed attempts on success */
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;

    /* Generate OTP */
    const { otp, hashedOtp } = generateOTP();

    user.mfaCode = hashedOtp;
    user.mfaCodeExpiry = Date.now() + 5 * 60 * 1000;
    user.mfaEnabled = true;

    await user.save();
    await sendOTP(user.email, otp);

    res.json({
      message: "OTP sent to email",
      userId: user._id
    });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
};

/* VERIFY OTP */
exports.verifyOTP = async (req, res) => {
  const { userId, otp } = req.body;

  const user = await User.findById(userId);
  if (!user || !user.mfaCodeExpiry)
    return res.status(400).json({ message: "Invalid request" });

  if (user.mfaCodeExpiry < Date.now())
    return res.status(400).json({ message: "OTP expired" });

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  if (hashedOtp !== user.mfaCode)
    return res.status(401).json({ message: "Invalid OTP" });

  user.mfaCode = undefined;
  user.mfaCodeExpiry = undefined;
  await user.save();

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  res.json({
    message: "MFA verified",
    token,
    role: user.role
  });
};
