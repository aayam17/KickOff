const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");

const router = express.Router();

/* Register */
router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password")
      .isLength({ min: 12 })
      .matches(/[A-Z]/)
      .matches(/[a-z]/)
      .matches(/[0-9]/)
      .matches(/[^A-Za-z0-9]/)
  ],
  authController.register
);

/* Login */
router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password").exists()
  ],
  authController.login
);

module.exports = router;
