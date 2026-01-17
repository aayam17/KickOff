import { useState } from "react";
import api from "../api/axios";
import PasswordMeter from "../components/PasswordMeter";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const submit = async () => {
    try {
      await api.post("/auth/register", form);
      alert("Registration successful. Please login.");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password"
        onChange={e => setForm({ ...form, password: e.target.value })} />
      <PasswordMeter password={form.password} />
      <button onClick={submit}>Register</button>
    </div>
  );
}
