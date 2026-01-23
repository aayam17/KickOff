const jwt = require("jsonwebtoken");

const UNAUTHORIZED = 401;

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(UNAUTHORIZED).json({
      message: "No token provided, authorization denied",
      code: "NO_TOKEN"
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(UNAUTHORIZED).json({
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

    if (error.name === "TokenExpiredError") {
      return res.status(UNAUTHORIZED).json({
        message: "Token has expired, please login again",
        code: "TOKEN_EXPIRED"
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(UNAUTHORIZED).json({
        message: "Invalid token, please login again",
        code: "INVALID_TOKEN"
      });
    }

    return res.status(UNAUTHORIZED).json({
      message: "Token verification failed",
      code: "VERIFICATION_FAILED"
    });
  }
};
