import "./InfoPages.css";

export default function AboutUs() {
  return (
    <div className="info-page">
      <div className="container">
        <div className="info-header">
          <h1>About KickOff</h1>
          <p>Your trusted source for authentic football jerseys</p>
        </div>

        <div className="info-content">
          <div className="info-section">
            <h2>Our Story</h2>
            <p>
              Founded in 2020, KickOff was born from a passion for football and a frustration with the lack of 
              reliable sources for authentic jerseys. We set out to create a platform where fans could confidently 
              purchase genuine merchandise from their favorite teams around the world.
            </p>
            <p>
              Today, we're proud to offer an extensive collection of official jerseys from top 
              clubs and national teams, all guaranteed to be 100% authentic.
            </p>
          </div>

          <div className="info-section">
            <h2>Our Mission</h2>
            <div className="mission-card">
              <p>
                To provide football fans worldwide with access to authentic, high-quality jerseys while delivering 
                exceptional customer service and creating a community of passionate supporters.
              </p>
            </div>
          </div>

          <div className="info-section">
            <h2>Why Choose Us</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3>100% Authentic</h3>
                <p>Every jersey is officially licensed and sourced directly from authorized manufacturers</p>
              </div>

              <div className="value-card">
                <div className="value-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <h3>Secure Shopping</h3>
                <p>Your data is protected with industry-standard encryption and secure payment processing</p>
              </div>

              <div className="value-card">
                <div className="value-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <h3>Fast Delivery</h3>
                <p>We ship worldwide with express options and free shipping on orders over $100</p>
              </div>

              <div className="value-card">
                <div className="value-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <h3>Expert Support</h3>
                <p>Our dedicated team is available 24/7 to assist with any questions or concerns</p>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h2>Our Commitment</h2>
            <div className="commitment-list">
              <div className="commitment-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <h3>Quality Guarantee</h3>
                  <p>Every product meets strict quality standards before shipping</p>
                </div>
              </div>
              <div className="commitment-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <h3>Fair Pricing</h3>
                  <p>Competitive prices without compromising on authenticity</p>
                </div>
              </div>
              <div className="commitment-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <h3>Customer First</h3>
                  <p>Your satisfaction is our top priority, always</p>
                </div>
              </div>
              <div className="commitment-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <h3>Sustainable Practices</h3>
                  <p>We partner with manufacturers committed to ethical production</p>
                </div>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h2>By the Numbers</h2>
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">500+</div>
                <div className="stat-label">Jersey Designs</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">100+</div>
                <div className="stat-label">Countries Served</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">4.9/5</div>
                <div className="stat-label">Customer Rating</div>
              </div>
            </div>
          </div>

          <div className="info-section">
            <div className="cta-box">
              <h2>Join the KickOff Community</h2>
              <p>Experience the difference of shopping with a company that truly understands football fans</p>
              <a href="/" className="btn btn-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
