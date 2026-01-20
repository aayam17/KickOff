import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage on init
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = product => {
    setCart(prev => {
      // Check if product with same ID and size exists
      const existing = prev.find(
        p => p._id === product._id && p.selectedSize === product.selectedSize
      );
      
      if (existing) {
        return prev.map(p =>
          p._id === product._id && p.selectedSize === product.selectedSize
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id, size) => {
    setCart(prev => prev.filter(p => !(p._id === id && p.selectedSize === size)));
  };

  const updateQuantity = (id, size, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prev =>
      prev.map(p =>
        p._id === id && p.selectedSize === size ? { ...p, quantity: newQuantity } : p
      )
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
