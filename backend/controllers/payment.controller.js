const stripe = require("../utils/stripe");
const Order = require("../models/Order.model");

/* Create Stripe Payment Intent */
exports.createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order)
      return res.status(404).json({ message: "Order not found" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // cents
      currency: "usd",
      metadata: { orderId: order._id.toString() }
    });

    order.paymentIntentId = paymentIntent.id;
    await order.save();

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (err) {
    res.status(500).json({ message: "Payment initialization failed" });
  }
};

exports.confirmPayment = async (req, res) => {
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ paymentIntentId });
  if (!order)
    return res.status(404).json({ message: "Order not found" });

  order.paymentStatus = "paid";
  await order.save();

  res.json({ message: "Payment confirmed" });
};
