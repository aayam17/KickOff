import { useState, useContext } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { AuthContext } from "../context/AuthContext";
import { useSnackbar } from "./Snackbar";
import api from "../api/axios";
import "./CheckoutForm.css";

export default function CheckoutForm({ clientSecret, orderDetails, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const { token } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const { success, error } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (stripeError) {
        error(stripeError.message);
        setProcessing(false);
        return;
      }

      // Confirm payment with backend
      await api.post(
        "/payments/confirm",
        { paymentIntentId: paymentIntent.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSucceeded(true);
      success("Payment successful! Redirecting to your orders...");
      
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      error(err.response?.data?.message || "Payment failed");
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#e2e8f0",
        "::placeholder": {
          color: "#64748b",
        },
        backgroundColor: "transparent",
      },
      invalid: {
        color: "#ef4444",
        iconColor: "#ef4444",
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="form-section">
        <label className="form-label">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          Card Information
        </label>
        <div className="card-element-wrapper">
          <CardElement options={cardElementOptions} />
        </div>
        <div className="payment-info">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <span>Your payment information is secure and encrypted</span>
        </div>
      </div>

      <div className="test-card-info">
        <div className="test-card-header">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <strong>Test Mode - Use Test Card:</strong>
        </div>
        <div className="test-card-details">
          <div>Card Number: 4242 4242 4242 4242</div>
          <div>Expiry: Any future date (e.g., 12/34)</div>
          <div>CVC: Any 3 digits (e.g., 123)</div>
          <div>ZIP: Any 5 digits (e.g., 12345)</div>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-pay"
        disabled={!stripe || processing || succeeded}
      >
        {processing ? (
          <>
            <div className="spinner"></div>
            Processing Payment...
          </>
        ) : succeeded ? (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Payment Successful!
          </>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            Pay Now
          </>
        )}
      </button>

      <div className="payment-security">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <span>Secured by Stripe • PCI DSS Compliant</span>
      </div>
    </form>
  );
}
