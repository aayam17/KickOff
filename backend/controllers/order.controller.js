const Order = require("../models/Order.model");

/* USER: Create order */
exports.createOrder = async (req, res) => {
  try {
    const { products, totalAmount } = req.body;

    const order = await Order.create({
      user: req.user.id,
      products,
      totalAmount
    });

    res.status(201).json(order);
  } catch {
    res.status(400).json({ message: "Order creation failed" });
  }
};

/* USER: Get own orders */
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate(
      "products.productId"
    );
    res.json(orders);
  } catch {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/* ADMIN: Get all orders */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user");
    res.json(orders);
  } catch {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
