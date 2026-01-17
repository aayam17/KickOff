const express = require("express");
const controller = require("../controllers/product.controller");

const router = express.Router();

/* Public */
router.get("/", controller.getAllProducts);

module.exports = router;
