const express = require("express");
const auth = require("../middleware/auth.middleware");
const controller = require("../controllers/payment.controller");

const router = express.Router();

// Shared middleware
const authMiddleware = [auth];

// Create payment intent
router.post("/create-intent", authMiddleware, controller.createPaymentIntent);

// Confirm payment
router.post("/confirm", authMiddleware, controller.confirmPayment);

module.exports = router;
