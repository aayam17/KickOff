import { useContext, useState } from "react";
import { createProduct } from "../api/product.api";
import { AuthContext } from "../context/AuthContext";

export default function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    team: "",
    price: ""
  });

  const submit = async () => {
    await createProduct(form, token);
    alert("Product added");
  };

  return (
    <div>
      <h2>Admin – Add Product</h2>
      <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Team" onChange={e => setForm({ ...form, team: e.target.value })} />
      <input placeholder="Price" onChange={e => setForm({ ...form, price: e.target.value })} />
      <button onClick={submit}>Add</button>
    </div>
  );
}
