'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';

const MenuHeader = () => {
  const { totalItems } = useCart();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const getButtonClass = (href: string) => {
    const baseClass = "p-2 transition-all duration-300 drop-shadow opacity-80 text-xs w-full border border-white border-opacity-20 rounded-lg backdrop-blur-lg shadow-lg";
    return isActive(href) 
      ? `${baseClass} bg-gray-400` 
      : `${baseClass} bg-[#2C2C2C] bg-opacity-10 hover:bg-gray-400 hover:bg-opacity-100`;
  };

  return (
    <header className="hidden md:fixed top-0 left-0 right-0 z-10 md:flex items-center h-12 shrink-0 bg-transparent font-neue-display px-4">
      <div className="flex w-full justify-between items-center text-sm h-full gap-2">
        <Link href="/" className="w-full">
          <button className={getButtonClass('/')}>
            Home
          </button>
        </Link>
        <Link href="/shop" className="w-full">
          <button className={getButtonClass('/shop')}>
            Tienda
          </button>
        </Link>
        <Link href="/blog" className="w-full">
          <button className={getButtonClass('/blog')}>
            Blog
          </button>
        </Link>
        <Link href="/contact" className="w-full">
          <button className={getButtonClass('/contact')}>
            Contacto
          </button>
        </Link>
        
        {/* Carrito con badge */}
        <Link href="/cart" className="flex-shrink-0 relative group">
          <button className={`p-2 transition-all duration-300 drop-shadow opacity-80 text-xs border border-white border-opacity-20 rounded-lg backdrop-blur-lg shadow-lg aspect-square flex items-center justify-center ${isActive('/cart') ? 'bg-gray-400' : 'bg-[#2C2C2C] bg-opacity-10 hover:bg-gray-400 hover:bg-opacity-100'}`}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="group-hover:scale-110 transition-transform"
            >
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </button>
          
          {/* Badge con animación */}
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-white text-black text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-bounce-in">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default MenuHeader;
