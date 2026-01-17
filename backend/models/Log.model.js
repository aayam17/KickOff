const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    action: String,
    ip: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", logSchema);
