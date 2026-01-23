const express = require("express");
const controller = require("../controllers/product.controller");

const router = express.Router();

// Public: fetch all products (no authentication required)
router.get("/", controller.getAllProducts);

module.exports = router;
