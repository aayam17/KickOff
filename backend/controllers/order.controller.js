const Order = require("../models/Order.model");

const CREATED = 201;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 403;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

/* USER: Create order */
exports.createOrder = async (req, res) => {
  try {
    const { products, totalAmount } = req.body;

    const order = await Order.create({
      user: req.user.id,
      products,
      totalAmount
    });

    res.status(CREATED).json(order);
  } catch (error) {
    res.status(BAD_REQUEST).json({ message: "Order creation failed" });
  }
};

/* USER: Get single order by ID */
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("products.productId");

    if (!order) {
      return res.status(NOT_FOUND).json({ message: "Order not found" });
    }

    // Only the owner or an admin can view the order
    if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(UNAUTHORIZED).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    res.status(SERVER_ERROR).json({ message: "Failed to fetch order" });
  }
};

/* USER: Get own orders */
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("products.productId");

    res.json(orders);
  } catch (error) {
    res.status(SERVER_ERROR).json({ message: "Failed to fetch orders" });
  }
};

/* ADMIN: Get all orders */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("products.productId");

    res.json(orders);
  } catch (error) {
    res.status(SERVER_ERROR).json({ message: "Failed to fetch orders" });
  }
};
