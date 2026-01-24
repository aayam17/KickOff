const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { csrfErrorHandler } = require("./middleware/csrf.middleware");

const app = express();

// Environment check
const isProduction = process.env.NODE_ENV === "production";

// CORS configuration - Enhanced for production
const corsOptions = {
  origin: isProduction 
    ? process.env.FRONTEND_URL || ["https://yourdomain.com"] // Set your production domain
    : ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "CSRF-Token", "csrf-token"],
  exposedHeaders: ["Set-Cookie"]
};

app.use(cors(corsOptions));

// Cookie parser - required for CSRF tokens
app.use(cookieParser());

// Security: Disable X-Powered-By header to hide Express
app.disable("x-powered-by");

// Body parser with size limits to prevent DOS attacks
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Security headers middleware
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");
  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");
  // Enable XSS protection
  res.setHeader("X-XSS-Protection", "1; mode=block");
  // Enforce HTTPS in production
  if (isProduction) {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
});

// API Routes
app.use("/api/security", require("./routes/csrf.routes")); // CSRF token endpoint
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/user", require("./routes/user.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/products", require("./routes/product.routes")); 
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/payments", require("./routes/payment.routes"));

app.get("/", (req, res) => {
  res.json({ 
    message: "Secure backend is running",
    environment: isProduction ? "production" : "development"
  });
});

// CSRF error handler - must be before general error handler
app.use(csrfErrorHandler);

// Error handling middleware - Don't leak stack traces in production
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: isProduction ? "Internal server error" : err.message,
    ...(isProduction ? {} : { stack: err.stack })
  });
});

module.exports = app;
