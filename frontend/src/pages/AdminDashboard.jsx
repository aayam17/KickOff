import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { fetchProducts } from "../api/product.api";
import { createProduct } from "../api/product.api";
import { useSnackbar } from "../components/Snackbar";
import api from "../api/axios";
import Loader from "../components/Loader";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const [view, setView] = useState("overview");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { success, error } = useSnackbar();
  const navigate = useNavigate();

  const [productForm, setProductForm] = useState({
    name: "",
    team: "",
    price: "",
    size: [],
    stock: "",
    image: ""
  });

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes] = await Promise.all([
        fetchProducts(),
        api.get("/orders", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setProducts(productsRes.data);
      setOrders(ordersRes.data);

      const totalRevenue = ordersRes.data.reduce((sum, order) => sum + order.totalAmount, 0);
      const pendingOrders = ordersRes.data.filter(o => o.paymentStatus === "pending").length;

      setStats({
        totalProducts: productsRes.data.length,
        totalOrders: ordersRes.data.length,
        totalRevenue,
        pendingOrders
      });
    } catch (err) {
      error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSizeToggle = (size) => {
    setProductForm(prev => ({
      ...prev,
      size: prev.size.includes(size)
        ? prev.size.filter(s => s !== size)
        : [...prev.size, size]
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await createProduct(productForm, token);
      success("Product added successfully!");
      setShowAddProduct(false);
      setProductForm({ name: "", team: "", price: "", size: [], stock: "", image: "" });
      loadData();
    } catch (err) {
      error(err.response?.data?.message || "Failed to add product");
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/products/${editingProduct._id}`, productForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      success("Product updated successfully!");
      setEditingProduct(null);
      setProductForm({ name: "", team: "", price: "", size: [], stock: "", image: "" });
      loadData();
    } catch (err) {
      error(err.response?.data?.message || "Failed to update product");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await api.delete(`/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      success("Product deleted successfully!");
      loadData();
    } catch (err) {
      error(err.response?.data?.message || "Failed to delete product");
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      team: product.team,
      price: product.price,
      size: product.size || [],
      stock: product.stock,
      image: product.image
    });
    setShowAddProduct(true);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setShowAddProduct(false);
    setProductForm({ name: "", team: "", price: "", size: [], stock: "", image: "" });
  };

  if (loading) {
    return <Loader fullscreen message="Loading dashboard..." />;
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
              Admin Dashboard
            </h1>
            <p className="dashboard-subtitle">Manage your store from one place</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Products</div>
              <div className="stat-value">{stats.totalProducts}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Orders</div>
              <div className="stat-value">{stats.totalOrders}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-warning">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Revenue</div>
              <div className="stat-value">${stats.totalRevenue.toFixed(2)}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-info">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">Pending Orders</div>
              <div className="stat-value">{stats.pendingOrders}</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${view === "overview" ? "active" : ""}`}
            onClick={() => setView("overview")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
            Overview
          </button>
          <button
            className={`tab-btn ${view === "products" ? "active" : ""}`}
            onClick={() => setView("products")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            </svg>
            Products ({products.length})
          </button>
          <button
            className={`tab-btn ${view === "orders" ? "active" : ""}`}
            onClick={() => setView("orders")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Orders ({orders.length})
          </button>
          <button
            className="tab-btn"
            onClick={() => navigate('/admin/logs')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            Audit Logs
          </button>
        </div>

        {/* Content Views */}
        {view === "overview" && (
          <div className="overview-section fade-in">
            <div className="quick-actions">
              <h2 className="section-title">Quick Actions</h2>
              <div className="actions-grid">
                <button
                  className="action-card"
                  onClick={() => {
                    setView("products");
                    setShowAddProduct(true);
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  <span>Add New Product</span>
                </button>
                <button className="action-card" onClick={() => setView("products")}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  </svg>
                  <span>View All Products</span>
                </button>
                <button className="action-card" onClick={() => setView("orders")}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  <span>Manage Orders</span>
                </button>
                <button className="action-card" onClick={() => navigate('/admin/logs')}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                  <span>View Audit Logs</span>
                </button>
              </div>
            </div>

            <div className="recent-orders">
              <h2 className="section-title">Recent Orders</h2>
              {orders.length === 0 ? (
                <div className="empty-state">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  <p>No orders yet</p>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.slice(0, 5).map(order => (
                    <div key={order._id} className="order-item">
                      <div className="order-info">
                        <div className="order-id">Order #{order._id.slice(-6)}</div>
                        <div className="order-date">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="order-amount">${order.totalAmount.toFixed(2)}</div>
                      <span className={`badge badge-${order.paymentStatus === "paid" ? "success" : "warning"}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {view === "products" && (
          <div className="products-section fade-in">
            <div className="section-header">
              <h2 className="section-title">Products Management</h2>
              <button
                className="btn btn-primary"
                onClick={() => setShowAddProduct(true)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Product
              </button>
            </div>

            {showAddProduct && (
              <div className="product-form-modal">
                <div className="modal-overlay" onClick={cancelEdit}></div>
                <div className="modal-content">
                  <div className="modal-header">
                    <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                    <button className="modal-close" onClick={cancelEdit}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                  <form onSubmit={editingProduct ? handleEditProduct : handleAddProduct} className="product-form">
                    <div className="form-group">
                      <label>Product Name</label>
                      <input
                        type="text"
                        name="name"
                        value={productForm.name}
                        onChange={handleProductFormChange}
                        placeholder="e.g., Messi Argentina Jersey"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Team</label>
                      <input
                        type="text"
                        name="team"
                        value={productForm.team}
                        onChange={handleProductFormChange}
                        placeholder="e.g., Argentina"
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Price ($)</label>
                        <input
                          type="number"
                          name="price"
                          value={productForm.price}
                          onChange={handleProductFormChange}
                          placeholder="89.99"
                          step="0.01"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Stock</label>
                        <input
                          type="number"
                          name="stock"
                          value={productForm.stock}
                          onChange={handleProductFormChange}
                          placeholder="100"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Sizes</label>
                      <div className="size-selector">
                        {sizeOptions.map(size => (
                          <button
                            key={size}
                            type="button"
                            className={`size-option ${productForm.size.includes(size) ? "selected" : ""}`}
                            onClick={() => handleSizeToggle(size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Image URL</label>
                      <input
                        type="url"
                        name="image"
                        value={productForm.image}
                        onChange={handleProductFormChange}
                        placeholder="https://example.com/image.jpg"
                        required
                      />
                    </div>
                    <div className="form-actions">
                      <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        {editingProduct ? "Update Product" : "Add Product"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="products-grid">
              {products.map(product => (
                <div key={product._id} className="admin-product-card">
                  <div className="admin-product-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="admin-product-content">
                    <div className="admin-product-team">{product.team}</div>
                    <h3 className="admin-product-name">{product.name}</h3>
                    <div className="admin-product-details">
                      <div className="detail-item">
                        <span className="detail-label">Price:</span>
                        <span className="detail-value">${product.price}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Stock:</span>
                        <span className="detail-value">{product.stock}</span>
                      </div>
                      {product.size && product.size.length > 0 && (
                        <div className="detail-item">
                          <span className="detail-label">Sizes:</span>
                          <span className="detail-value">{product.size.join(", ")}</span>
                        </div>
                      )}
                    </div>
                    <div className="admin-product-actions">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => startEdit(product)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "orders" && (
          <div className="orders-section fade-in">
            <h2 className="section-title">All Orders</h2>
            {orders.length === 0 ? (
              <div className="empty-state">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                <p>No orders found</p>
              </div>
            ) : (
              <div className="orders-table">
                <div className="table-header">
                  <div>Order ID</div>
                  <div>Date</div>
                  <div>Items</div>
                  <div>Amount</div>
                  <div>Status</div>
                </div>
                {orders.map(order => (
                  <div key={order._id} className="table-row">
                    <div className="order-id-cell">#{order._id.slice(-8)}</div>
                    <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                    <div>{order.products.length} items</div>
                    <div className="amount-cell">${order.totalAmount.toFixed(2)}</div>
                    <div>
                      <span className={`badge badge-${order.paymentStatus === "paid" ? "success" : "warning"}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
