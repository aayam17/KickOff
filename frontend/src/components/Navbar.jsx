import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { token, role, logout } = useContext(AuthContext);

  return (
    <nav style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
      <Link to="/">Home</Link>

      {token && <Link to="/cart">Cart</Link>}
      {token && <Link to="/orders">Orders</Link>}
      {role === "admin" && <Link to="/admin">Admin</Link>}

      {!token ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      ) : (
        <button onClick={logout}>Logout</button>
      )}
    </nav>
  );
}
