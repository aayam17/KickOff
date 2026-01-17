import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { token } = useContext(AuthContext);

  const pay = async () => {
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      }
    );

    if (!error) {
      await api.post(
        "/payments/confirm",
        { paymentIntentId: paymentIntent.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Payment successful");
    }
  };

  return (
    <div>
      <CardElement />
      <button onClick={pay}>Pay Now</button>
    </div>
  );
}
