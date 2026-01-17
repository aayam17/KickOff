import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  /* Restore auth on refresh */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("auth"));
    if (saved) {
      setToken(saved.token);
      setRole(saved.role);
    }
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
    <AuthContext.Provider value={{ token, role, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
