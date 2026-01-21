import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">

            {/* Brand Section */}
            <div className="footer-section">
              <div className="footer-logo">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 2C12 2 8 6 8 12C8 18 12 22 12 22" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 2C12 2 16 6 16 12C16 18 12 22 12 22" stroke="currentColor" strokeWidth="2"/>
                  <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>KickOff</span>
              </div>

              <p className="footer-description">
                Your trusted destination for premium football jerseys from top clubs and national teams worldwide.
              </p>

              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  Facebook
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  Twitter
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  Instagram
                </a>
              </div>
            </div>

            {/* Shop Section */}
            <div className="footer-section">
              <h3 className="footer-title">Shop</h3>
              <ul className="footer-links">
                <li><Link to="/">All Jerseys</Link></li>
                <li><Link to="/">Club Teams</Link></li>
                <li><Link to="/">National Teams</Link></li>
              </ul>
            </div>

            {/* Support Section */}
            <div className="footer-section">
              <h3 className="footer-title">Support</h3>
              <ul className="footer-links">
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/shipping">Shipping Info</Link></li>
                <li><Link to="/size-guide">Size Guide</Link></li>
              </ul>
            </div>

            {/* Company Section */}
            <div className="footer-section">
              <h3 className="footer-title">Company</h3>
              <ul className="footer-links">
                <li><Link to="/about">About Us</Link></li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} KickOff. All rights reserved.
            </p>

            <div className="payment-methods">
              <span className="payment-label">We accept:</span>
              <div className="payment-icons">
                <span className="payment-icon">VISA</span>
                <span className="payment-icon">Mastercard</span>
                <span className="payment-icon">PayPal</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
