import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "/Users/aayambhattarai/KickOff/frontend/src/context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
}
