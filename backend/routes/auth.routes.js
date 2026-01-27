const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");

const router = express.Router();

// Register 
router.post(
  "/register",
  [
    body("name")
      .notEmpty()
      .withMessage("Name is required"),
    body("email")
      .isEmail()
      .withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 12 })
      .withMessage("Password must be at least 12 characters long")
      .matches(/[A-Z]/)
      .withMessage("Password must contain an uppercase letter")
      .matches(/[a-z]/)
      .withMessage("Password must contain a lowercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain a number")
      .matches(/[^A-Za-z0-9]/)
      .withMessage("Password must contain a special character")
  ],
  authController.register
);

// Login 
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Valid email is required"),
    body("password")
      .exists()
      .withMessage("Password is required")
  ],
  authController.login
);

// Verify OTP (MFA) 
router.post("/verify-otp", authController.verifyOTP);

module.exports = router;
