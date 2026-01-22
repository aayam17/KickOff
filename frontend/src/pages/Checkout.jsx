import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import CheckoutForm from "../components/CheckoutForm";
import { useSnackbar } from "../components/Snackbar";
import Loader from "../components/Loader";
import api from "../api/axios";
import "./Checkout.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_51QdUkCRxgxYourPublishableKeyHere");

export default function Checkout() {
  const { id } = useParams();
  const { token, loading: authLoading } = useContext(AuthContext);
  const { cart, clearCart } = useContext(CartContext);
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const { error } = useSnackbar();
  const navigate = useNavigate();
  
  // Prevent duplicate order creation with useRef
  const orderCreatedRef = useRef(false);

  useEffect(() => {

    if (authLoading) return;

    if (!token) {
      error("Please login to continue");
      navigate("/login");
      return;
    }

    if (id === "cart" && cart.length === 0) {
      error("Your cart is empty");
      navigate("/cart");
      return;
    }

    if (!orderCreatedRef.current) {
      orderCreatedRef.current = true;
      fetchOrderAndIntent();
    }
  }, [id, token, authLoading]); 

  const fetchOrderAndIntent = async () => {
    try {
      setLoading(true);


      if (!token) {
        throw new Error("No authentication token found");
      }

      let currentOrder;

      // If we are coming from /checkout/cart, create the order first
      if (id === "cart") {
        const products = cart.map(item => ({
          productId: item._id,
          quantity: item.quantity,
          size: item.selectedSize
        }));

        const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = totalAmount > 100 ? 0 : 15;
        const tax = totalAmount * 0.1;
        const total = totalAmount + shipping + tax;

        const orderRes = await api.post("/orders", { 
            products, 
            totalAmount: total 
        }, {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        });
        currentOrder = orderRes.data;
        
        // This prevents the component from re-creating the order on re-render
        navigate(`/checkout/${currentOrder._id}`, { replace: true });
      } else {
        // If we have an ID in the URL, just fetch that order
        const orderRes = await api.get(`/orders/${id}`, {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        });
        currentOrder = orderRes.data;
      }

      setOrderDetails(currentOrder);

      // Create payment intent using the order ID (only if not already created)
      if (!currentOrder.paymentIntentId) {
        const paymentRes = await api.post("/payments/create-intent", { 
          orderId: currentOrder._id 
        }, {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        });

        setClientSecret(paymentRes.data.clientSecret);
      } else {
        // This handles browser back/forward or page refresh scenarios
        const stripe = await stripePromise;
        const { paymentIntent } = await stripe.retrievePaymentIntent(currentOrder.paymentIntentId);
        setClientSecret(paymentIntent.client_secret);
      }
    } catch (err) {
      console.error("Checkout Error:", err);
      error(err.response?.data?.message || "Failed to initialize checkout");
      navigate("/cart");
    } finally {
      setLoading(false);
    }
  };

  if (loading || authLoading) {
    return <Loader fullscreen message="Preparing checkout..." />;
  }

  if (!clientSecret) {
    return (
      <div className="checkout-error">
        <h2>Unable to process checkout</h2>
        <button className="btn btn-primary" onClick={() => navigate("/cart")}>
          Return to Cart
        </button>
      </div>
    );
  }

  // Use orderDetails for totals if available, otherwise fallback to cart
  const subtotal = orderDetails ? (orderDetails.totalAmount / 1.1) - (orderDetails.totalAmount > 100 ? 0 : 15) : cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = orderDetails ? orderDetails.totalAmount : 0;
  const shipping = total > 100 ? 0 : 15;
  const tax = total - (total / 1.1);

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1 className="checkout-title">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            Secure Checkout
          </h1>
          <p className="checkout-subtitle">Complete your purchase</p>
        </div>

        <div className="checkout-content">
          <div className="checkout-main">
            <div className="checkout-section">
              <h2 className="section-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                Payment Information
              </h2>
              
              <div className="payment-wrapper">
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm 
                    clientSecret={clientSecret} 
                    orderDetails={orderDetails}
                    onSuccess={() => {
                      clearCart();
                      navigate("/orders");
                    }}
                  />
                </Elements>
              </div>
            </div>
          </div>

          <div className="checkout-sidebar">
            <div className="order-summary-card">
              <h2 className="summary-title">Order Summary</h2>
              
              <div className="summary-items">
                {(orderDetails?.products || cart).map((item) => {
                  // Handle populated or raw cart items
                  const product = item.productId || item;
                  return (
                    <div key={`${product._id}-${item.size || item.selectedSize}`} className="summary-item">
                      <div className="summary-item-image">
                        <img src={product.image} alt={product.name} />
                      </div>
                      <div className="summary-item-details">
                        <div className="summary-item-name">{product.name}</div>
                        <div className="summary-item-meta">
                          <span className="summary-item-team">{product.team}</span>
                          {(item.size || item.selectedSize) && (
                            <span className="summary-item-size">Size: {item.size || item.selectedSize}</span>
                          )}
                        </div>
                        <div className="summary-item-quantity">Qty: {item.quantity}</div>
                      </div>
                      <div className="summary-item-price">
                        ${(product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${(total - tax - shipping).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-row summary-total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
