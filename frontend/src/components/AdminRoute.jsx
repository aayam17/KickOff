import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { role, loading } = useContext(AuthContext);

  if (loading) return null; // Wait for localStorage check

  // Check if role is strictly 'admin'
  return role === "admin" ? children : <Navigate to="/" />;
}