// app/context/CartContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  size: string;
  color?: string; // Optional color property
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: string) => void;
  updateItemSize: (id: string, oldSize: string, newSize: string) => void;
  updateItemColor: (id: string, size: string, oldColor: string, newColor: string) => void;
  clearCart: () => void;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("rzk_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("rzk_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
    alert(`${item.name} added to your bag!`);
  };

  const removeFromCart = (id: string, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
  };

  const updateItemSize = (id: string, oldSize: string, newSize: string) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id && item.size === oldSize) {
          return { ...item, size: newSize };
        }
        return item;
      })
    );
  };

  const updateItemColor = (id: string, size: string, oldColor: string, newColor: string) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id && item.size === size && (item.color === oldColor || !item.color)) {
          return { ...item, color: newColor };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => total + item.price, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateItemSize, updateItemColor, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}