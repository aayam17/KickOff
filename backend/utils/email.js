const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"KickOff Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your KickOff OTP Code",
    text: `Your OTP code is ${otp}. It expires in 5 minutes.`
  });
};
