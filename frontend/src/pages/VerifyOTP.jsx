import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const userId = localStorage.getItem("mfaUserId");
      const res = await api.post("/auth/verify-otp", { userId, otp });

      loginUser(res.data.token, res.data.role);
      localStorage.removeItem("mfaUserId");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>
      <input placeholder="Enter OTP" onChange={e => setOtp(e.target.value)} />
      <button onClick={submit}>Verify</button>
    </div>
  );
}
