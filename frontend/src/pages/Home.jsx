import { useEffect, useState } from "react";
import { fetchProducts } from "../api/product.api";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(res => setProducts(res.data));
  }, []);

  return (
    <div>
      <h2>Football Jerseys</h2>
      {products.map(p => (
        <div key={p._id}>
          <h4>{p.name}</h4>
          <p>{p.team}</p>
          <p>${p.price}</p>
        </div>
      ))}
    </div>
  );
}
