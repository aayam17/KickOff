const Product = require("../models/Product.model");

const CREATED = 201;
const BAD_REQUEST = 400;
const SERVER_ERROR = 500;

/* PUBLIC: Get all products */
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch {
    res.status(SERVER_ERROR).json({ message: "Failed to fetch products" });
  }
};

/* ADMIN: Create product */
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(CREATED).json(product);
  } catch {
    res.status(BAD_REQUEST).json({ message: "Failed to create product" });
  }
};

/* ADMIN: Update product */
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch {
    res.status(BAD_REQUEST).json({ message: "Failed to update product" });
  }
};

/* ADMIN: Delete product */
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch {
    res.status(BAD_REQUEST).json({ message: "Failed to delete product" });
  }
};
