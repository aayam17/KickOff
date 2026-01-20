const stripe = require("../utils/stripe");
const Order = require("../models/Order.model");

/* Create Stripe Payment Intent */
exports.createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;

    // 1. Find the order created by the Cart handleCheckout
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 2. CRITICAL FIX: Check if payment intent already exists for this order
    if (order.paymentIntentId) {
      // Retrieve existing payment intent from Stripe
      try {
        const existingIntent = await stripe.paymentIntents.retrieve(order.paymentIntentId);
        
        // If intent exists and is still valid, return it
        if (existingIntent && existingIntent.status !== 'succeeded') {
          return res.json({
            clientSecret: existingIntent.client_secret
          });
        }
      } catch (stripeError) {
        console.log("Existing payment intent not found, creating new one");
        // If stripe can't find it, we'll create a new one below
      }
    }

    // 3. Create the intent with Stripe (Amount in cents)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), 
      currency: "usd",
      metadata: { 
        orderId: order._id.toString(),
        userId: req.user.id // Good for tracking in Stripe Dashboard
      },
      automatic_payment_methods: { enabled: true },
    });

    // 4. Link the Stripe ID to our database order
    order.paymentIntentId = paymentIntent.id;
    await order.save();

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (err) {
    console.error("Stripe Error:", err);
    res.status(500).json({ message: "Payment initialization failed" });
  }
};

/* Confirm Payment Status */
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const order = await Order.findOne({ paymentIntentId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only update if not already paid (prevent duplicate updates)
    if (order.paymentStatus !== "paid") {
      order.paymentStatus = "paid";
      await order.save();
    }

    res.json({ message: "Payment confirmed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error confirming payment" });
  }
};
