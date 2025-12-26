'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

type CartItem = {
  id: string;
  title: string;
  price: string;
  image: string | null;
  quantity: number;
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Calculate totals with useMemo to avoid unnecessary recalculations
  const totalItems = useMemo(() =>
    cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const totalPrice = useMemo(() =>
    cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0),
    [cart]
  );

  // Debounced localStorage save - only save after 300ms of inactivity
  useEffect(() => {
    if (isInitialized) {
      const timeoutId = setTimeout(() => {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            localStorage.setItem('cart', JSON.stringify(cart));
          });
        } else {
          localStorage.setItem('cart', JSON.stringify(cart));
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [cart, isInitialized]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return prevCart.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      totalItems,
      totalPrice
    }}>
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