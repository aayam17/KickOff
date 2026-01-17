import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { createOrder } from "../api/order.api";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const checkout = async () => {
    await createOrder(
      {
        products: cart.map(p => ({
          productId: p._id,
          quantity: p.quantity
        })),
        totalAmount: total
      },
      token
    );
    clearCart();
    alert("Order placed successfully");
  };

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.map(item => (
        <div key={item._id}>
          {item.name} × {item.quantity}
          <button onClick={() => removeFromCart(item._id)}>Remove</button>
        </div>
      ))}
      <h3>Total: ${total}</h3>
      <button onClick={checkout}>Place Order</button>
    </div>
  );
}
