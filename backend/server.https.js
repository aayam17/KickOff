require("dotenv").config();
const https = require("https");
const fs = require("fs");
const path = require("path");
const app = require("./app");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5001;

// SSL Certificate paths
const sslKeyPath = path.join(__dirname, "ssl", "localhost-key.pem");
const sslCertPath = path.join(__dirname, "ssl", "localhost.pem");

// Check if SSL certificates exist
const sslExists = fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath);

if (!sslExists) {
  console.error("❌ SSL certificates not found!");
  console.error("\nPlease run the SSL setup script first:");
  console.error("  cd ssl");
  console.error("  chmod +x setup-ssl.sh");
  console.error("  ./setup-ssl.sh\n");
  process.exit(1);
}

// SSL options
const httpsOptions = {
  key: fs.readFileSync(sslKeyPath),
  cert: fs.readFileSync(sslCertPath),
};

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    
    // Create HTTPS server
    https.createServer(httpsOptions, app).listen(PORT, () => {
      console.log(`🔒 HTTPS Backend server running on https://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API accessible at: https://localhost:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  });
