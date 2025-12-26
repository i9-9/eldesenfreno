'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] font-neue-display px-4">
        <div className="w-20 h-20 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
        <p className="text-gray-400 mb-8 text-center">Explorá nuestra tienda y encontrá tu próxima lectura</p>
        <Link href="/shop">
          <button className="px-8 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-all duration-300">
            Ver catálogo
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 font-neue-display">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Carrito</h1>
          <p className="text-sm text-gray-400">{totalItems} {totalItems === 1 ? 'libro' : 'libros'}</p>
        </div>
        <Link href="/shop" className="text-sm text-gray-400 hover:text-white transition-colors">
          Seguir comprando →
        </Link>
      </div>
      
      {/* Items */}
      <div className="space-y-4 mb-8">
        {cart.map((item) => (
          <div 
            key={item.id} 
            className="flex gap-4 p-4 bg-[#111] rounded-xl border border-white/5 hover:border-white/10 transition-colors"
          >
            {/* Imagen */}
            <Link href={`/product/${item.id}`} className="flex-shrink-0">
              {item.image && (
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  width={80} 
                  height={120}
                  className="rounded-lg object-cover shadow-lg"
                />
              )}
            </Link>
            
            {/* Info */}
            <div className="flex-grow min-w-0">
              <Link href={`/product/${item.id}`}>
                <h3 className="font-semibold text-lg hover:text-gray-300 transition-colors truncate">
                  {item.title}
                </h3>
              </Link>
              <p className="text-gray-400 text-sm mb-3">{formatPrice(item.price)}</p>
              
              {/* Controles de cantidad */}
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-[#1a1a1a] rounded-lg overflow-hidden">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <svg width="12" height="2" viewBox="0 0 12 2" fill="currentColor">
                      <rect width="12" height="2" rx="1"/>
                    </svg>
                  </button>
                  <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                      <rect y="5" width="12" height="2" rx="1"/>
                      <rect x="5" width="2" height="12" rx="1"/>
                    </svg>
                  </button>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
            
            {/* Precio subtotal */}
            <div className="flex-shrink-0 text-right">
              <p className="font-semibold">{formatPrice(parseFloat(item.price) * item.quantity)}</p>
              {item.quantity > 1 && (
                <p className="text-xs text-gray-500">c/u {formatPrice(parseFloat(item.price))}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Resumen y checkout */}
      <div className="sticky bottom-4">
        <div className="bg-[#111] rounded-xl border border-white/10 p-6">
          {/* Desglose */}
          <div className="space-y-2 mb-4 pb-4 border-b border-white/10">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Subtotal ({totalItems} {totalItems === 1 ? 'libro' : 'libros'})</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Envío</span>
              <span className="text-green-400">A calcular</span>
            </div>
          </div>
          
          {/* Total */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold">{formatPrice(totalPrice)}</span>
          </div>
          
          {/* Botón checkout */}
          <Link href="/checkout" className="block">
            <button className="w-full py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2">
              <span>Finalizar compra</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </Link>
          
          {/* Métodos de pago */}
          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            <span>Pagá con MercadoPago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
