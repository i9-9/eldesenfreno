'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Disable body scroll when the dropdown is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  return (
    <div className="relative md:hidden w-full font-neue-display z-[1000]">
      <div
        className="flex w-full px-2 justify-around items-center border-white border-[0.5px] border-x-0"
        id="dropdownDefaultButton"
        onClick={toggleDropdown}
      >
        <p className="text-white w-full text-base py-1">Menu</p>
        <svg
          className={`${
            isOpen ? 'transform rotate-180 transition-all duration-700' : 'transition-all duration-700'
          }`}
          width="16"
          height="14"
          viewBox="0 0 16 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 14L0.205772 0.5L15.7942 0.5L8 14Z" fill="#D9D9D9" />
        </svg>
      </div>

      {/* Dropdown menu */}
      <div
        className={`absolute left-0 w-full bg-[#0a0a0a] overflow-hidden transition-all duration-700 ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ top: '100%' }}
      >
        <Link
          href="/"
          className="block w-full text-left py-4 text-8xl text-white hover:bg-hover-gray"
          onClick={() => setIsOpen(false)}
        >
          Index
        </Link>
        <Link
          href="/shop"
          className="block w-full text-left py-4 text-8xl text-white hover:bg-hover-gray"
          onClick={() => setIsOpen(false)}
        >
          Tienda
        </Link>
        <Link
          href="/events"
          className="block w-full text-left py-4 text-8xl text-white hover:bg-hover-gray"
          onClick={() => setIsOpen(false)}
        >
          Eventos
        </Link>
        <Link
          href="/authors"
          className="block w-full text-left py-4 text-8xl text-white hover:bg-hover-gray"
          onClick={() => setIsOpen(false)}
        >
          Autorxs
        </Link>
        <Link
          href="/contact"
          className="block w-full text-left py-4 text-8xl text-white hover:bg-hover-gray"
          onClick={() => setIsOpen(false)}
        >
          Contacto
        </Link>
      </div>
    </div>
  );
};

export default Dropdown;
