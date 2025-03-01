import React, { createContext, useState, useContext, ReactNode } from 'react';

// Tipo para los productos
interface Product {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

// Tipo para el contexto
interface CartContextType {
  productos: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Componente proveedor del contexto
export const CarritoProvider = ({ children }: { children: ReactNode }) => {
  const [productos, setProductos] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setProductos(prev => {
      const existingProduct = prev.find(p => p.id === product.id);
      if (existingProduct) {
        return prev.map(p =>
          p.id === product.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      }
      return [...prev, { ...product, cantidad: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setProductos(prev => prev.filter(product => product.id !== id));
  };

  const clearCart = () => {
    setProductos([]);
  };

  return (
    <CartContext.Provider value={{ productos, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook para acceder al contexto
export const useCarrito = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCarrito debe ser usado dentro de CarritoProvider');
  }
  return context;
};
