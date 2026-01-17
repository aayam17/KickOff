import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "/Users/aayambhattarai/KickOff/frontend/src/context/AuthContext.jsx";

export default function AdminRoute({ children }) {
  const { role } = useContext(AuthContext);
  return role === "admin" ? children : <Navigate to="/" />;
}
