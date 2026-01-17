import { useEffect, useContext, useState } from "react";
import { fetchMyOrders } from "../api/order.api";
import { AuthContext } from "../context/AuthContext";

export default function Orders() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchMyOrders(token).then(res => setOrders(res.data));
  }, []);

  return (
    <div>
      <h2>My Orders</h2>
      {orders.map(o => (
        <div key={o._id}>
          <p>Total: ${o.totalAmount}</p>
          <p>Status: {o.paymentStatus}</p>
        </div>
      ))}
    </div>
  );
}
