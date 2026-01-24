const express = require("express");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const controller = require("../controllers/order.controller");
const { csrfProtection } = require("../middleware/csrf.middleware");

const router = express.Router();

// Shared middleware
const authMiddleware = [auth];

// Create order
router.post("/", csrfProtection, authMiddleware, controller.createOrder);

// Get logged-in user's orders
router.get("/my", authMiddleware, controller.getMyOrders);

// Get order by ID
router.get("/:id", authMiddleware, controller.getOrderById); 

// Get all orders (admin only)
router.get("/", auth, role("admin"), controller.getAllOrders);

module.exports = router;
