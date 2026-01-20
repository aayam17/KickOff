const express = require("express");
const cors = require("cors");

const app = express();

// FIX: Allow both 5173 and 5174. 
// Added common methods and headers to prevent pre-flight request blocks.
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// API Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/user", require("./routes/user.routes"));
app.use("/api/admin/products", require("./routes/admin.routes"));
app.use("/api/products", require("./routes/product.routes")); // This points to /api/products
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/payments", require("./routes/payment.routes"));

app.get("/", (req, res) => {
  res.json({ message: "Secure backend is running" });
});

module.exports = app;