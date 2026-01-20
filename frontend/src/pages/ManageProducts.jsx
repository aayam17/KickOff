import { useEffect, useContext, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import "./ManageProducts.css";

export default function ManageProducts() {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/products", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return <Loader message="Loading products..." />;
  }

  return (
    <div className="manage-products">
      <div className="section-card">
        <div className="card-header">
          <h3>All Products</h3>
          <p>{products.length} products in inventory</p>
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <h4>No products yet</h4>
            <p>Add your first product above</p>
          </div>
        ) : (
          <div className="products-table">
            <div className="table-header">
              <div>Product</div>
              <div>Team</div>
              <div>Price</div>
              <div>Actions</div>
            </div>
            {products.map(product => (
              <div key={product._id} className="table-row">
                <div className="product-cell">
                  <div className="product-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                    </svg>
                  </div>
                  <span>{product.name}</span>
                </div>
                <div>{product.team}</div>
                <div className="price-cell">${product.price}</div>
                <div className="actions-cell">
                  <button className="btn btn-outline btn-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
