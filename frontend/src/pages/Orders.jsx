import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useSnackbar } from "../components/Snackbar";
import { fetchMyOrders } from "../api/order.api";
import Loader from "../components/Loader";
import "./Orders.css";

export default function Orders() {
  const { token, loading: authLoading } = useContext(AuthContext); // Added authLoading
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { error } = useSnackbar();

  useEffect(() => {
    // DO NOT run if auth is still loading or token is missing
    if (authLoading) return;
    if (!token) {
      setLoading(false);
      return;
    }

    loadOrders();
  }, [token, authLoading]); // Added dependencies

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await fetchMyOrders(); // Removed token argument
      setOrders(res.data);
    } catch (err) {
      error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <Loader fullscreen message="Loading your orders..." />;
  }

  return (
    <div className="orders-page">
      <div className="container">
        <div className="orders-header">
          <h1 className="orders-title">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            My Orders
          </h1>
          <p className="orders-subtitle">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} total
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <h2>No orders yet</h2>
            <p>When you place orders, they will appear here</p>
            <button className="btn btn-primary" onClick={() => window.location.href = "/"}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header" onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}>
                  <div className="order-main-info">
                    <div className="order-id-section">
                      <span className="order-label">Order ID</span>
                      <span className="order-id">#{order._id.slice(-8)}</span>
                    </div>
                    <div className="order-date-section">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <span>{new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                  </div>

                  <div className="order-summary-info">
                    <div className="order-items-count">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                      </svg>
                      {order.products.length} {order.products.length === 1 ? 'item' : 'items'}
                    </div>
                    <div className="order-total">${order.totalAmount.toFixed(2)}</div>
                    <span className={`badge badge-${order.paymentStatus === 'paid' ? 'success' : 'warning'}`}>
                      {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                    <button className="expand-btn" aria-label="Expand order">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={expandedOrder === order._id ? "rotated" : ""}
                      >
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {expandedOrder === order._id && (
                  <div className="order-details">
                    <div className="order-products">
                      <h3 className="products-title">Order Items</h3>
                      {order.products.map((item, index) => (
                        <div key={index} className="order-product-item">
                          <div className="product-info-compact">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="9" cy="21" r="1"/>
                              <circle cx="20" cy="21" r="1"/>
                              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                            </svg>
                            <span className="product-name-compact">Product ID: {item.productId}</span>
                          </div>
                          <div className="product-quantity">
                            Quantity: <span>{item.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="order-meta">
                      <div className="meta-row">
                        <span className="meta-label">Order Date:</span>
                        <span className="meta-value">
                          {new Date(order.createdAt).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {order.paymentIntentId && (
                        <div className="meta-row">
                          <span className="meta-label">Payment ID:</span>
                          <span className="meta-value payment-id">{order.paymentIntentId}</span>
                        </div>
                      )}
                      <div className="meta-row">
                        <span className="meta-label">Status:</span>
                        <span className={`meta-value status-${order.paymentStatus}`}>
                          {order.paymentStatus === 'paid' ? 'Payment Confirmed' : 'Payment Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
