const mongoose = require("mongoose");

const PAYMENT_STATUSES = ["pending", "paid"];

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        }
      }
    ],

    totalAmount: {
      type: Number,
      required: true
    },

    // Stripe reference
    paymentIntentId: {
      type: String
    },

    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
