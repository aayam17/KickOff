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
  const [sortBy, setSortBy] = useState("default");
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
      error("Please select a size first");
      const sizeSection = document.querySelector(`[data-product-id="${product._id}"] .size-options`);
      if (sizeSection) {
        sizeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    addToCart({ ...product, selectedSize: size });
    success(`✓ ${product.name} (${size}) added to cart!`);
    // Clear size selection after adding to cart
    setSelectedSize(prev => {
      const updated = { ...prev };
      delete updated[product._id];
      return updated;
    });
  };

  // Filter products
  let filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort products
  if (sortBy === "price-low") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === "name") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
  }

  if (loading) {
    return <Loader fullscreen message="Loading jerseys..." />;
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-pattern"></div>
          <div className="hero-gradient"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Premium Football <span className="text-gradient">Jerseys</span>
            </h1>
            <p className="hero-subtitle">
              Authentic jerseys from the world's top clubs. Fast shipping, guaranteed quality.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number" aria-label={`${products.length} jerseys available`}>
                  {products.length}+
                </span>
                <span className="stat-label">Jerseys</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Authentic</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="search-section" role="search">
        <div className="container">
          <div className="search-filter-wrapper">
            <div className="search-box">
              <svg 
                className="search-icon" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="search"
                placeholder="Search by team or player name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                aria-label="Search jerseys"
                autoComplete="off"
              />
              {searchTerm && (
                <button 
                  className="search-clear"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                  type="button"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>
            
            <div className="filter-controls">
              <label htmlFor="sort-select" className="filter-label">Sort by:</label>
              <select 
                id="sort-select"
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products"
              >
                <option value="default">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
          
          <div className="search-results-info">
            <span className="results-count" role="status" aria-live="polite">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Jersey' : 'Jerseys'}
            </span>
            {searchTerm && (
              <span className="search-term">
                matching "<strong>{searchTerm}</strong>"
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section" aria-label="Product catalog">
        <div className="container">
          {filteredProducts.length === 0 ? (
            <div className="no-results" role="status">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <h3>No jerseys found</h3>
              <p>We couldn't find any jerseys matching "{searchTerm}". Try different keywords or browse all jerseys.</p>
              <button 
                className="btn btn-primary" 
                onClick={() => setSearchTerm("")}
                type="button"
              >
                View All Jerseys
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <article 
                  key={product._id} 
                  className="product-card"
                  data-product-id={product._id}
                  aria-label={`${product.name} jersey`}
                >
                  <div className="product-image-container">
                    <img 
                      src={product.image} 
                      alt={`${product.name} ${product.team} jersey`}
                      className="product-image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x400?text=Jersey+Image';
                      }}
                    />
                    <div className="product-overlay">
                      <span className="quick-view">Quick View</span>
                    </div>
                    <span className="product-badge" aria-label="Official product">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      Official
                    </span>
                    {product.stock < 10 && product.stock > 0 && (
                      <span className="product-low-stock" role="status">
                        Only {product.stock} left!
                      </span>
                    )}
                    {product.stock === 0 && (
                      <span className="product-out-of-stock" role="status">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <div className="product-content">
                    <div className="product-team">{product.team}</div>
                    <h3 className="product-name">{product.name}</h3>
                    
                    <div className="product-price-row">
                      <div className="product-price" aria-label={`Price: $${product.price}`}>
                        <span className="currency" aria-hidden="true">$</span>
                        {product.price}
                      </div>
                      <div className="product-stock-info">
                        {product.stock > 0 ? (
                          <span className="in-stock" role="status">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            In Stock
                          </span>
                        ) : (
                          <span className="out-of-stock-text" role="status">Out of Stock</span>
                        )}
                      </div>
                    </div>

                    {product.size && product.size.length > 0 && (
                      <div className="product-sizes">
                        <label className="size-label" id={`size-label-${product._id}`}>
                          Select Size:
                        </label>
                        <div 
                          className="size-options" 
                          role="group" 
                          aria-labelledby={`size-label-${product._id}`}
                        >
                          {product.size.map(size => (
                            <button
                              key={size}
                              className={`size-btn ${selectedSize[product._id] === size ? 'active' : ''}`}
                              onClick={() => setSelectedSize(prev => ({
                                ...prev,
                                [product._id]: size
                              }))}
                              aria-pressed={selectedSize[product._id] === size}
                              aria-label={`Size ${size}`}
                              type="button"
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
                      aria-label={product.stock === 0 ? 'Out of stock' : `Add ${product.name} to cart`}
                      type="button"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                      </svg>
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" aria-label="Why choose us">
        <div className="container">
          <h2 className="section-title">Why Choose KickOff?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3>100% Authentic</h3>
              <p>All jerseys are officially licensed and authentic merchandise from authorized suppliers</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h3>Fast Shipping</h3>
              <p>Free express delivery on all orders over $100 with tracking information</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h3>24/7 Support</h3>
              <p>Our customer service team is always ready to help with your questions and concerns</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
