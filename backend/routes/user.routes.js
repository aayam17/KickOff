const express = require("express");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/profile", auth, (req, res) => {
  res.json({
    message: "Protected profile access",
    user: req.user
  });
});

module.exports = router;
