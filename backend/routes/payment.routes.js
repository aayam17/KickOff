const express = require("express");
const auth = require("../middleware/auth.middleware");
const controller = require("../controllers/payment.controller");
const { csrfProtection } = require("../middleware/csrf.middleware");

const router = express.Router();

// Shared middleware
const authMiddleware = [auth];

// Create payment intent
router.post("/create-intent", csrfProtection, authMiddleware, controller.createPaymentIntent);

// Confirm payment
router.post("/confirm", csrfProtection, authMiddleware, controller.confirmPayment);

module.exports = router;
