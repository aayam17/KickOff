const crypto = require("crypto");

const OTP_LENGTH = 6;

exports.generateOTP = () => {
  // Generate numeric OTP
  const otp = Math.floor(
    Math.pow(10, OTP_LENGTH - 1) + Math.random() * Math.pow(10, OTP_LENGTH - 1)
  ).toString();

  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  return { otp, hashedOtp };
};
