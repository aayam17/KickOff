const stripe = require("../utils/stripe");
const Order = require("../models/Order.model");

const NOT_FOUND = 404;
const SERVER_ERROR = 500;

/* Create Stripe Payment Intent */
exports.createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;

    // 1. Find the order created by the Cart handleCheckout
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(NOT_FOUND).json({ message: "Order not found" });
    }

    // 2. Check if payment intent already exists for this order
    if (order.paymentIntentId) {
      try {
        const existingIntent = await stripe.paymentIntents.retrieve(
          order.paymentIntentId
        );

        if (existingIntent && existingIntent.status !== "succeeded") {
          return res.json({
            clientSecret: existingIntent.client_secret
          });
        }
      } catch (stripeError) {
        console.log(
          "Existing payment intent not found, creating new one"
        );
      }
    }

    // 3. Create the intent with Stripe (amount in cents)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100),
      currency: "usd",
      metadata: {
        orderId: order._id.toString(),
        userId: req.user.id
      },
      automatic_payment_methods: { enabled: true }
    });

    // 4. Link the Stripe ID to our database order
    order.paymentIntentId = paymentIntent.id;
    await order.save();

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (err) {
    console.error("Stripe Error:", err);
    res.status(SERVER_ERROR).json({
      message: "Payment initialization failed"
    });
  }
};

/* Confirm Payment Status */
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const order = await Order.findOne({ paymentIntentId });
    if (!order) {
      return res.status(NOT_FOUND).json({ message: "Order not found" });
    }

    // Prevent duplicate updates
    if (order.paymentStatus !== "paid") {
      order.paymentStatus = "paid";
      await order.save();
    }

    res.json({ message: "Payment confirmed successfully" });
  } catch (err) {
    res.status(SERVER_ERROR).json({
      message: "Error confirming payment"
    });
  }
};
