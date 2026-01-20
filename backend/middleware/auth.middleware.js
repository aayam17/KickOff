const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      message: "No token provided, authorization denied",
      code: "NO_TOKEN"
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ 
      message: "Token is missing",
      code: "MISSING_TOKEN"
    });
  }

  try {
    // Verify token with JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    
    // Provide specific error messages
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        message: "Token has expired, please login again",
        code: "TOKEN_EXPIRED"
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        message: "Invalid token, please login again",
        code: "INVALID_TOKEN"
      });
    } else {
      return res.status(401).json({ 
        message: "Token verification failed",
        code: "VERIFICATION_FAILED"
      });
    }
  }
};
