const express = require("express");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const productController = require("../controllers/product.controller");
const auditLogController = require("../controllers/auditLog.controller");
const { csrfProtection } = require("../middleware/csrf.middleware");

const router = express.Router();

// Shared middleware for admin-only routes
const adminMiddleware = [auth, role("admin")];

// ============================================
// PRODUCT ROUTES
// ============================================

// Create product 
router.post("/products", csrfProtection, adminMiddleware, productController.createProduct);

// Get all products 
router.get("/products", adminMiddleware, productController.getAllProducts);

// Update product
router.put("/products/:id", csrfProtection, adminMiddleware, productController.updateProduct);

// Delete product 
router.delete("/products/:id", csrfProtection, adminMiddleware, productController.deleteProduct);

// ============================================
// AUDIT LOG ROUTES
// ============================================

// Get all audit logs with filtering and pagination
router.get("/logs", adminMiddleware, auditLogController.getAllLogs);

// Get logs for specific user
router.get("/logs/user/:userId", adminMiddleware, auditLogController.getUserLogs);

// Get log statistics
router.get("/logs/stats", adminMiddleware, auditLogController.getLogStats);

// Export logs (CSV format)
router.get("/logs/export", adminMiddleware, auditLogController.exportLogs);

module.exports = router;
