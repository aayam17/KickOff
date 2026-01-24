import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { SnackbarProvider } from "./components/Snackbar";
import { fetchCsrfToken } from "./utils/csrf";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/AdminDashboard";
import AuditLogs from "./pages/AuditLogs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import VerifyOTP from "./pages/VerifyOTP";
import Profile from "./pages/Profile";

// Info pages
import ContactUs from "./pages/info/ContactUs";
import ShippingInfo from "./pages/info/ShippingInfo";
import SizeGuide from "./pages/info/SizeGuide";
import AboutUs from "./pages/info/AboutUs";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  // Fetch CSRF token on app initialization
  useEffect(() => {
    fetchCsrfToken().catch(err => {
      console.error('Failed to initialize CSRF token:', err);
    });
  }, []);

  return (
    <SnackbarProvider>
      <BrowserRouter>

        {/* Global Navigation */}
        <Navbar />

        <Routes>

          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />

          {/* Info pages */}
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/shipping" element={<ShippingInfo />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/about" element={<AboutUs />} />

          {/* User protected routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout/:id"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          {/* Admin protected routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/logs"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <AuditLogs />
                </AdminRoute>
              </ProtectedRoute>
            }
          />

        </Routes>

        {/* Global Footer */}
        <Footer />

      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
