import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function useRole(requiredRole) {
  const { role } = useContext(AuthContext);
  return role === requiredRole;
}
