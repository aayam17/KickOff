import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { createOrder } from "../api/order.api";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const checkout = async () => {
    const res = await createOrder(
      {
        products: cart.map(p => ({
          productId: p._id,
          quantity: p.quantity
        })),
        totalAmount: total
      },
      token
    );

    navigate(`/checkout/${res.data._id}`);
  };

  return (
    <div>
      <h2>Your Cart</h2>

      {cart.length === 0 && <p>Your cart is empty</p>}

      {cart.map(item => (
        <div key={item._id}>
          {item.name} × {item.quantity}
          <button onClick={() => removeFromCart(item._id)}>Remove</button>
        </div>
      ))}

      <h3>Total: ${total}</h3>

      {cart.length > 0 && (
        <button onClick={checkout}>Proceed to Payment</button>
      )}
    </div>
  );
}
