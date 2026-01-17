const express = require("express");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const controller = require("../controllers/order.controller");

const router = express.Router();

/* User routes */
router.post("/", auth, controller.createOrder);
router.get("/my", auth, controller.getMyOrders);

/* Admin route */
router.get("/", auth, role("admin"), controller.getAllOrders);

module.exports = router;
