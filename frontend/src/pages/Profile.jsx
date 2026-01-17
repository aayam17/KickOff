import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    api
      .get("/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data.user));
  }, []);

  if (!user) return <p>Loading profile...</p>;

  return (
    <div>
      <h2>My Profile</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
