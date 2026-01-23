const express = require("express");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const productController = require("../controllers/product.controller");

const router = express.Router();

// Shared middleware for admin-only routes
const adminMiddleware = [auth, role("admin")];

// Create product 
router.post("/", adminMiddleware, productController.createProduct);

// Get all products 
router.get("/", adminMiddleware, productController.getAllProducts);

// Update product
router.put("/:id", adminMiddleware, productController.updateProduct);

// Delete product 
router.delete("/:id", adminMiddleware, productController.deleteProduct);

module.exports = router;
