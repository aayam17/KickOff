import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { role } = useContext(AuthContext);
  return role === "admin" ? children : <Navigate to="/" />;
}
