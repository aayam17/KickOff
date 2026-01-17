const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: String,
    team: String,
    price: Number,
    size: [String],
    stock: Number,
    image: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
