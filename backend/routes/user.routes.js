const express = require("express");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/profile", auth, (req, res) => {
  res.status(200).json({
    message: "Protected profile route accessed successfully",
    user: req.user,
  });
});

module.exports = router;
