import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AUTH_STORAGE_KEY = "auth";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load auth state from localStorage on app start
    const saved = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
    if (saved) {
      setToken(saved.token);
      setRole(saved.role);
    }
    setLoading(false);
  }, []);

  const loginUser = (jwt, userRole) => {
    setToken(jwt);
    setRole(userRole);
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ token: jwt, role: userRole })
    );
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ token, role, loading, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
