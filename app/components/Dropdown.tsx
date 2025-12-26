'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '../context/CartContext'

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const menuItems = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Tienda' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contacto' },
  ];

  return (
    <div className="relative md:hidden w-full font-neue-display z-[1000]">
      {/* Botón del menú */}
      <button
        className="flex justify-between items-center w-full px-3 py-3 text-xs bg-[#1a1a1a]/80 border border-white/20 rounded-lg backdrop-blur-md"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-label="Menú de navegación"
      >
        <span>Menu</span>
        <svg
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          width="12"
          height="10"
          viewBox="0 0 16 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 14L0.205772 0.5L15.7942 0.5L8 14Z" fill="#D9D9D9" />
        </svg>
      </button>

      {/* Overlay para cerrar */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[-1]" 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Menú desplegable */}
      <div
        className={`absolute left-0 w-full mt-2 transition-all duration-300 ease-out ${
          isOpen 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        style={{ top: '100%' }}
      >
        {/* Contenedor con blur único */}
        <div className="bg-[#1a1a1a]/90 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden">
          {menuItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block w-full text-left px-4 py-3 text-xs text-white hover:bg-white/10 transition-all duration-200 ${
                index !== menuItems.length - 1 ? 'border-b border-white/10' : ''
              } ${isOpen ? 'animate-menu-item' : 'opacity-0 translate-x-[-10px]'}`}
              style={{ 
                animationDelay: isOpen ? `${index * 50}ms` : '0ms',
                animationFillMode: 'both'
              }}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          
          {/* Carrito con badge */}
          <Link
            href="/cart"
            className={`flex items-center justify-between w-full px-4 py-3 text-xs text-white hover:bg-white/10 transition-all duration-200 border-t border-white/10 ${
              isOpen ? 'animate-menu-item' : 'opacity-0 translate-x-[-10px]'
            }`}
            style={{ 
              animationDelay: isOpen ? `${menuItems.length * 50}ms` : '0ms',
              animationFillMode: 'both'
            }}
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <span>Carrito</span>
            </div>
            {totalItems > 0 && (
              <span className="bg-white text-black rounded-full min-w-[20px] h-5 flex items-center justify-center text-[10px] font-bold px-1.5">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
