const FORBIDDEN = 403;

module.exports = (...roles) => {
  return (req, res, next) => {
    // Check if user role is authorized
    if (!roles.includes(req.user.role)) {
      return res.status(FORBIDDEN).json({ message: "Access denied" });
    }

    next();
  };
};
