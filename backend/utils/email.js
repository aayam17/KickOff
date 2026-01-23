const nodemailer = require("nodemailer");

const EMAIL_SENDER_NAME = "KickOff Security";
const OTP_EXPIRY_MINUTES = 5;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"${EMAIL_SENDER_NAME}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your KickOff OTP Code",
    text: `Your OTP code is ${otp}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`
  });
};
