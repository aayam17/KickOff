import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext"; 
import { useSnackbar } from "../components/Snackbar"; 
import "./Cart.css";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const { token } = useContext(AuthContext); 
  const { error } = useSnackbar();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // 1. Check if user is logged in before moving to checkout
    if (!token) {
      error("Please login to proceed to checkout");
      navigate("/login");
      return;
    }

    // 2. Navigate to checkout. 
    navigate("/checkout/cart");
  };

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1 className="cart-title">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Shopping Cart
          </h1>
          <p className="cart-subtitle">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <h2>Your cart is empty</h2>
            <p>Add some awesome jerseys to get started!</p>
            <button className="btn btn-primary" onClick={() => navigate("/")}>
              Browse Jerseys
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              <div className="cart-actions-top">
                <button className="btn btn-secondary" onClick={() => navigate("/")}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12"/>
                    <polyline points="12 19 5 12 12 5"/>
                  </svg>
                  Continue Shopping
                </button>
                <button className="btn-text-danger" onClick={clearCart}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                  Clear Cart
                </button>
              </div>

              {cart.map((item) => (
                <div key={`${item._id}-${item.selectedSize}`} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  
                  <div className="cart-item-details">
                    <div className="cart-item-header">
                      <div>
                        <div className="cart-item-team">{item.team}</div>
                        <h3 className="cart-item-name">{item.name}</h3>
                        {item.selectedSize && (
                          <div className="cart-item-size">
                            Size: <span>{item.selectedSize}</span>
                          </div>
                        )}
                      </div>
                      <button 
                        className="cart-item-remove"
                        onClick={() => removeFromCart(item._id, item.selectedSize)}
                        aria-label="Remove item"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          <line x1="10" y1="11" x2="10" y2="17"/>
                          <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                      </button>
                    </div>

                    <div className="cart-item-footer">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => updateQuantity(item._id, item.selectedSize, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12"/>
                          </svg>
                        </button>
                        <span className="quantity-display">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.selectedSize, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          aria-label="Increase quantity"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                          </svg>
                        </button>
                      </div>

                      <div className="cart-item-price">
                        <div className="item-unit-price">${item.price} each</div>
                        <div className="item-total-price">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-card">
                <h2 className="summary-title">Order Summary</h2>
                
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {shipping === 0 && (
                    <div className="free-shipping-badge">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      Free shipping applied!
                    </div>
                  )}
                  {subtotal > 0 && subtotal < 100 && (
                    <div className="shipping-notice">
                      Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                    </div>
                  )}
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

                <button className="btn btn-primary btn-checkout" onClick={handleCheckout}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14"/>
                    <path d="M12 5l7 7-7 7"/>
                  </svg>
                  Proceed to Checkout
                </button>

                <div className="security-badges">
                  <div className="security-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    <span>Secure Checkout</span>
                  </div>
                  <div className="security-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                    <span>Safe Payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}