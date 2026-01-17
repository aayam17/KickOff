const express = require("express");
const auth = require("../middleware/auth.middleware");
const controller = require("../controllers/payment.controller");

const router = express.Router();

router.post("/create-intent", auth, controller.createPaymentIntent);
router.post("/confirm", auth, controller.confirmPayment);

module.exports = router;
