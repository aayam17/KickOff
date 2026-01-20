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
  } catch (error) {
    res.status(400).json({ message: "Order creation failed" });
  }
};

/* USER: Get single order by ID (NEW) */
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("products.productId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    // Security check: only the owner or an admin can see this
    if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

/* USER: Get own orders */
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("products.productId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/* ADMIN: Get all orders */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user").populate("products.productId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};