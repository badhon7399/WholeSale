'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  product: {
    _id: string;
    title: string;
    images: string[];
    moq: number;
    priceTiers: { minQuantity: number; pricePerUnit: number }[];
    supplier: {
      _id: string;
      name: string;
      companyName: string;
    };
  };
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getTierPrice: (item: CartItem) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        try {
          setCart(JSON.parse(storedCart));
        } catch (e) {
          console.error('Failed to parse cart storage', e);
        }
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
  };

  const getTierPrice = (item: CartItem): number => {
    const { priceTiers } = item.product;
    if (!priceTiers || priceTiers.length === 0) return 0;
    
    // Sort tiers descending by minQuantity
    const sortedTiers = [...priceTiers].sort((a, b) => b.minQuantity - a.minQuantity);
    for (const tier of sortedTiers) {
      if (item.quantity >= tier.minQuantity) {
        return tier.pricePerUnit;
      }
    }
    return priceTiers[0].pricePerUnit;
  };

  const addToCart = (product: any, quantity: number) => {
    const existingIndex = cart.findIndex((item) => item.product._id === product._id);
    const finalQuantity = Math.max(quantity, product.moq);

    let newCart = [...cart];
    if (existingIndex > -1) {
      newCart[existingIndex].quantity = finalQuantity;
    } else {
      newCart.push({ product, quantity: finalQuantity });
    }
    saveCart(newCart);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const item = cart.find((i) => i.product._id === productId);
    if (!item) return;

    // Enforce MOQ
    const finalQuantity = Math.max(quantity, item.product.moq);
    const newCart = cart.map((i) =>
      i.product._id === productId ? { ...i, quantity: finalQuantity } : i
    );
    saveCart(newCart);
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter((item) => item.product._id !== productId);
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = getTierPrice(item);
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getTierPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
