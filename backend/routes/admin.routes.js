const express = require("express");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const productController = require("../controllers/product.controller");

const router = express.Router();

// Create product 
router.post("/", auth, role("admin"), productController.createProduct);

// Get all products 
router.get("/", auth, role("admin"), productController.getAllProducts);

// Update product
router.put("/:id", auth, role("admin"), productController.updateProduct);

// Delete product 
router.delete("/:id", auth, role("admin"), productController.deleteProduct);

module.exports = router;
