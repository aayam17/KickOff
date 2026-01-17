import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useContext, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const pay = async () => {
    if (!stripe || !elements) return;

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      }
    );

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    await api.post(
      "/payments/confirm",
      { paymentIntentId: paymentIntent.id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Payment successful 🎉");
    setLoading(false);
  };

  return (
    <div>
      <h2>Secure Payment</h2>
      <CardElement />
      <button onClick={pay} disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}
