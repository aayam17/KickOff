import { useEffect, useState, useContext } from "react";
import { fetchProducts } from "../api/product.api";
import { CartContext } from "../context/CartContext";
import { useSnackbar } from "../components/Snackbar";
import Loader from "../components/Loader";
import "./Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSize, setSelectedSize] = useState({});
  const { addToCart } = useContext(CartContext);
  const { success, error } = useSnackbar();

  useEffect(() => {
    fetchProducts()
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => {
        error("Failed to load products");
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product) => {
    const size = selectedSize[product._id];
    if (!size) {
      error("Please select a size");
      return;
    }
    addToCart({ ...product, selectedSize: size });
    success(`${product.name} (Size ${size}) added to cart!`);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loader fullscreen message="Loading jerseys..." />;
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-text fade-in">
            <h1 className="hero-title">
              Premium Football <span className="text-gradient">Jerseys</span>
            </h1>
            <p className="hero-subtitle">
              Represent your team with authentic, high-quality jerseys from the world's top clubs
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">{products.length}+</div>
                <div className="stat-label">Jerseys</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">Authentic</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="search-section">
        <div className="container">
          <div className="search-wrapper">
            <div className="search-box">
              <svg className="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search by team or player name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="search-clear"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>
            <div className="search-results-count">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Jersey' : 'Jerseys'} Found
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-section">
        <div className="container">
          {filteredProducts.length === 0 ? (
            <div className="no-results">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <h3>No jerseys found</h3>
              <p>Try adjusting your search terms</p>
              <button className="btn btn-primary" onClick={() => setSearchTerm("")}>
                Clear Search
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-image-container">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="product-image"
                    />
                    <div className="product-badge">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      Official
                    </div>
                    {product.stock < 10 && product.stock > 0 && (
                      <div className="product-low-stock">
                        Only {product.stock} left!
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div className="product-out-of-stock">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  <div className="product-content">
                    <div className="product-team">{product.team}</div>
                    <h3 className="product-name">{product.name}</h3>
                    
                    <div className="product-price-row">
                      <div className="product-price">
                        <span className="currency">$</span>
                        {product.price}
                      </div>
                      <div className="product-stock-info">
                        {product.stock > 0 ? (
                          <span className="in-stock">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            In Stock
                          </span>
                        ) : (
                          <span className="out-of-stock-text">Out of Stock</span>
                        )}
                      </div>
                    </div>

                    {product.size && product.size.length > 0 && (
                      <div className="product-sizes">
                        <label className="size-label">Select Size:</label>
                        <div className="size-options">
                          {product.size.map(size => (
                            <button
                              key={size}
                              className={`size-btn ${selectedSize[product._id] === size ? 'active' : ''}`}
                              onClick={() => setSelectedSize(prev => ({
                                ...prev,
                                [product._id]: size
                              }))}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      className="btn btn-primary btn-add-to-cart"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                      </svg>
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title text-center">Why Choose KickOff?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3>100% Authentic</h3>
              <p>All jerseys are officially licensed and authentic merchandise</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h3>Fast Shipping</h3>
              <p>Free express delivery on all orders over $100</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h3>24/7 Support</h3>
              <p>Our team is always ready to help with any questions</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
