import { useEffect, useContext, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function ManageProducts() {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api
      .get("/admin/products", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setProducts(res.data));
  }, []);

  return (
    <div>
      <h3>Products</h3>
      {products.map(p => (
        <div key={p._id}>{p.name}</div>
      ))}
    </div>
  );
}
