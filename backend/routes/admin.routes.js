const express = require("express");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const productController = require("../controllers/product.controller");

const router = express.Router();

// ADMIN: Create product 
router.post("/", auth, role("admin"), productController.createProduct);

// ADMIN: Get all products 
router.get("/", auth, role("admin"), productController.getAllProducts);

// ADMIN: Update product
router.put("/:id", auth, role("admin"), productController.updateProduct);

// ADMIN: Delete product 
router.delete("/:id", auth, role("admin"), productController.deleteProduct);

module.exports = router;
