import React from 'react';
import Link from 'next/link';

const MenuHeader = () => {
  return (
    <header className="hidden md:fixed top-0 left-0 right-0 z-10 md:flex items-center h-10 shrink-0 bg-[#0a0a0a] font-neue-display">
      <div className="flex w-full justify-between items-center text-sm h-full gap-1">
        <Link href="/" className="w-full">
          <button className="p-2 bg-[#2C2C2C] hover:text-[#121212] hover:bg-gray-400 transition-all duration-700 drop-shadow opacity-80 text-xs rounded-md w-full">
            Index
          </button>
        </Link>
        {/* <Link href="/blog" className="w-full">
          <button className="p-2 bg-[#121212] hover:text-[#121212] hover:bg-gray-400 transition-all duration-700 drop-shadow opacity-80 text-xs rounded-md w-full">
            Blog
          </button>
        </Link> */}
        <Link href="/shop" className="w-full">
          <button className="p-2 bg-[#2C2C2C] hover:text-[#121212] hover:bg-gray-400 transition-all duration-700 drop-shadow opacity-80 text-xs rounded-md w-full">
            Tienda
          </button>
        </Link>
        <Link href="/events" className="w-full">
          <button className="p-2 bg-[#2C2C2C] hover:text-[#121212] hover:bg-gray-400 transition-all duration-700 drop-shadow opacity-80 text-xs rounded-md w-full">
            Eventos
          </button>
        </Link>
        <Link href="/authors" className="w-full">
          <button className="p-2 bg-[#2C2C2C] hover:text-[#121212] hover:bg-gray-400 transition-all duration-700 drop-shadow opacity-80 text-xs rounded-md w-full">
            Autorxs
          </button>
        </Link>
        <Link href="/contact" className="w-full">
          <button className="p-2 bg-[#2c2c2c] hover:text-[#121212] hover:bg-gray-400 transition-all duration-700 drop-shadow opacity-80 text-xs rounded-md w-full">
            Contacto
          </button>
        </Link>
      </div>
    </header>
  );
};

export default MenuHeader;
