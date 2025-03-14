'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <div className="relative md:hidden w-full font-neue-display z-[1000]">
      <div
        className="flex w-full justify-around items-center rounded-md bg-gray"
        id="dropdownDefaultButton"
        onClick={toggleDropdown}
      >
        <div className="flex justify-between items-center w-full px-2 py-3  hover:bg-gray-400 transition-all duration-700 drop-shadow opacity-80 text-xs bg-opacity-10 border border-white border-opacity-20 rounded-lg backdrop-blur-lg shadow-lg">
          <p>Menu</p>
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
      </div>

      <div
        className={`absolute left-0 w-full overflow-hidden transition-all duration-700 ${
          isOpen ? 'max-h-screen opacity-100 px-2' : 'max-h-0 opacity-0 px-2'
        }`}
        style={{ top: '100%' }}
      >
        <Link
          href="/"
          className="block w-full text-left px-2 py-3 mt-2 rounded-md transition-all duration-700 text-xs text-white hover:bg-gray-400 bg-[#2C2C2C] bg-opacity-10 border border-white border-opacity-20 backdrop-blur-lg shadow-lg"
          onClick={() => setIsOpen(false)}
        >
          Index
        </Link>
        <Link
          href="/shop"
          className="block w-full text-left px-2 py-3 mt-2 rounded-md transition-all duration-700 text-xs text-white hover:bg-gray-400 bg-[#2C2C2C] bg-opacity-10 border border-white border-opacity-20 backdrop-blur-lg shadow-lg"
          onClick={() => setIsOpen(false)}
        >
          Tienda
        </Link>
        <Link
          href="/events"
          className="block w-full text-left px-2 py-3 mt-2 rounded-md transition-all duration-700 text-xs text-white hover:bg-gray-400 bg-[#2C2C2C] bg-opacity-10 border border-white border-opacity-20 backdrop-blur-lg shadow-lg"
          onClick={() => setIsOpen(false)}
        >
          Eventos
        </Link>
        <Link
          href="/authors"
          className="block w-full text-left px-2 py-3 mt-2 rounded-md transition-all duration-700 text-xs text-white hover:bg-gray-400 bg-[#2C2C2C] bg-opacity-10 border border-white border-opacity-20 backdrop-blur-lg shadow-lg"
          onClick={() => setIsOpen(false)}
        >
          Autorxs
        </Link>
        <Link
          href="/contact"
          className="block w-full text-left px-2 py-3 mt-2 rounded-md transition-all duration-700 text-xs text-white hover:bg-gray-400 bg-[#2C2C2C] bg-opacity-10 border border-white border-opacity-20 backdrop-blur-lg shadow-lg"
          onClick={() => setIsOpen(false)}
        >
          Contacto
        </Link>
      </div>
    </div>
  );
};

export default Dropdown;
