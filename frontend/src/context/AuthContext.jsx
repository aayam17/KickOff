import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("auth"));
    if (saved) {
      setToken(saved.token);
      setRole(saved.role);
    }
    setLoading(false); // Finished checking localStorage
  }, []);

  const loginUser = (jwt, userRole) => {
    setToken(jwt);
    setRole(userRole);
    localStorage.setItem(
      "auth",
      JSON.stringify({ token: jwt, role: userRole })
    );
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ token, role, loading, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};