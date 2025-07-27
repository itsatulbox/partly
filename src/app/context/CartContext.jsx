// context/CartContext.tsx (or .js)
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // ✅ Load cart from localStorage on first render
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // ✅ Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addPart = (part) => {
  setCart((prev) => {
    // Check if part already exists in cart
    const existingIndex = prev.findIndex((item) => item.id === part.id);
    
    if (existingIndex >= 0) {
      // If exists, update the quantity
      const updatedCart = [...prev];
      updatedCart[existingIndex] = part;
      return updatedCart;
    } else {
      // If new, add to cart
      return [...prev, part];
    }
  });
};

  const removePart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addPart, removePart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
