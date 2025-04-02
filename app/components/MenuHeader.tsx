import React from 'react';
import Link from 'next/link';
import CartIconWrapper from './CartIconWrapper';

const MenuHeader = () => {
  return (
    <header className="hidden md:fixed top-0 left-0 right-0 z-10 md:flex items-center h-10 shrink-0 bg-transparent font-neue-display">
      <div className="flex w-full justify-between items-center text-sm h-full gap-1">
        <Link href="/" className="w-full">
          <button className="p-2 bg-[#2C2C2C] hover:bg-gray-400 transition-all duration-700 drop-shadow opacity-80 text-xs w-full bg-opacity-10 border border-white border-opacity-20 rounded-lg backdrop-blur-lg shadow-lg">
            Index
          </button>
        </Link>
        {/* <Link href="/blog" className="w-full">
          <button className="p-2 bg-[#121212] hover:text-[#121212] hover:bg-gray-400 transition-all duration-700 drop-shadow opacity-80 text-xs rounded-md w-full">
            Blog
          </button>
        </Link> */}
        <Link href="/shop" className="w-full">
          <button className="p-2 bg-[#2C2C2C] hover:bg-gray-400 transition-all duration-700 drop-shadow opacity-80 text-xs w-full bg-opacity-10 border border-white border-opacity-20 rounded-lg backdrop-blur-lg shadow-lg">
            Tienda
          </button>
        </Link>
        <Link href="/events" className="w-full">
          <button className="p-2 bg-[#2C2C2C] hover:bg-gray-400 transition-all duration-700 drop-shadow opacity-80 text-xs w-full bg-opacity-10 border border-white border-opacity-20 rounded-lg backdrop-blur-lg shadow-lg">
            Eventos
          </button>
        </Link>
        <Link href="/authors" className="w-full">
          <button className="p-2 bg-[#2C2C2C] hover:bg-gray-400 transition-all duration-700 drop-shadow opacity-80 text-xs w-full bg-opacity-10 border border-white border-opacity-20 rounded-lg backdrop-blur-lg shadow-lg">
            Autorxs
          </button>
        </Link>
        <Link href="/contact" className="w-full">
          <button className="p-2 bg-[#2C2C2C] hover:bg-gray-400 transition-all duration-700 drop-shadow opacity-80 text-xs w-full bg-opacity-10 border border-white border-opacity-20 rounded-lg backdrop-blur-lg shadow-lg">
            Contacto
          </button>
        </Link>
        <Link href="/cart" className="w-full">
          <button className="p-2 bg-[#2C2C2C] hover:bg-gray-400 transition-all duration-700 drop-shadow opacity-80 text-xs w-full bg-opacity-10 border border-white border-opacity-20 rounded-lg backdrop-blur-lg shadow-lg">
            Carrito
          </button>
        </Link>
      </div>
    </header>
  );
};

export default MenuHeader;
