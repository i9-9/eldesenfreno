'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] font-neue-display">
        <h2 className="text-2xl mb-4">Tu carrito está vacío</h2>
        <p className="mb-6">Añade algunos libros para comenzar</p>
        <Link href="/shop">
          <button className="p-3 bg-[#121212] text-white hover:bg-gray-400 transition-all 
          duration-700 drop-shadow opacity-80 rounded-md">
            Explorar libros
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 font-neue-display">
      <h1 className="text-2xl font-bold mb-6">Tu carrito</h1>
      
      <div className="bg-[#0B0B0B] rounded-lg p-4 mb-6">
        {cart.map((item) => (
          <div key={item.id} className="flex flex-col md:flex-row items-start border-b border-gray-700 py-4">
            <div className="w-full md:w-1/4 mb-4 md:mb-0">
              {item.image && (
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  width={150} 
                  height={200}
                  className="rounded-md object-contain"
                />
              )}
            </div>
            
            <div className="w-full md:w-2/4 px-4">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-lg mt-2">{formatPrice(item.price)}</p>
            </div>
            
            <div className="w-full md:w-1/4 flex flex-col items-start md:items-end">
              <div className="flex items-center mb-4">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-2 py-1 bg-[#333333] text-white rounded-l-md"
                >
                  -
                </button>
                <span className="px-4 py-1 bg-[#222222]">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-2 py-1 bg-[#333333] text-white rounded-r-md"
                >
                  +
                </button>
              </div>
              
              <button 
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 text-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#0B0B0B] rounded-lg p-4">
        <div>
          <p className="text-xl font-semibold">Total: {formatPrice(totalPrice)}</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link href="/checkout">
            <button className="p-3 bg-[#121212] text-white hover:bg-gray-400 transition-all 
            duration-700 drop-shadow opacity-80 rounded-md">
              Proceder al pago
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 