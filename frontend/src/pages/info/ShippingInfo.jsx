import "./InfoPages.css";

export default function ShippingInfo() {
  return (
    <div className="info-page">
      <div className="container">
        <div className="info-header">
          <h1>Shipping Information</h1>
          <p>Fast and reliable delivery worldwide</p>
        </div>

        <div className="info-content">
          <div className="info-section">
            <h2>Shipping Methods</h2>
            <div className="shipping-methods">
              <div className="shipping-card">
                <div className="shipping-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13"/>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/>
                    <circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                </div>
                <h3>Standard Shipping</h3>
                <p className="price">$9.99</p>
                <p className="delivery-time">5-7 business days</p>
                <p className="text-secondary">Perfect for most orders</p>
              </div>

              <div className="shipping-card featured">
                <div className="badge">Most Popular</div>
                <div className="shipping-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <h3>Express Shipping</h3>
                <p className="price">$19.99</p>
                <p className="delivery-time">2-3 business days</p>
                <p className="text-secondary">Fast delivery guaranteed</p>
              </div>

              <div className="shipping-card">
                <div className="shipping-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3>Overnight</h3>
                <p className="price">$39.99</p>
                <p className="delivery-time">Next business day</p>
                <p className="text-secondary">For urgent orders</p>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h2>Free Shipping</h2>
            <div className="free-shipping-banner">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 7h-9a2 2 0 0 1-2-2V2"/>
                <path d="M10 2H5a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V7z"/>
                <line x1="9" y1="10" x2="15" y2="10"/>
                <line x1="9" y1="14" x2="15" y2="14"/>
                <line x1="9" y1="18" x2="12" y2="18"/>
              </svg>
              <div>
                <h3>Get Free Standard Shipping</h3>
                <p>On all orders over <strong>$100</strong></p>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h2>International Shipping</h2>
            <p>We ship to over 100 countries worldwide. International shipping times vary by location:</p>
            <ul className="shipping-list">
              <li><strong>Europe:</strong> 7-14 business days</li>
              <li><strong>Asia:</strong> 10-21 business days</li>
              <li><strong>Australia:</strong> 10-18 business days</li>
              <li><strong>South America:</strong> 14-28 business days</li>
            </ul>
            <p className="note">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              Note: International orders may be subject to customs fees and import duties
            </p>
          </div>

          <div className="info-section">
            <h2>Order Tracking</h2>
            <p>Once your order ships, you'll receive a tracking number via email. You can track your package at any time:</p>
            <ol className="tracking-steps">
              <li>Check your email for the tracking number</li>
              <li>Visit our <strong>Orders</strong> page</li>
              <li>Enter your tracking number</li>
              <li>Get real-time updates on your delivery</li>
            </ol>
          </div>

          <div className="info-section">
            <h2>Shipping Restrictions</h2>
            <p>Please note the following shipping restrictions:</p>
            <ul className="shipping-list">
              <li>We cannot ship to P.O. boxes</li>
              <li>Some remote areas may incur additional fees</li>
              <li>Delivery times are estimates and not guaranteed</li>
              <li>Orders placed on weekends ship the next business day</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
