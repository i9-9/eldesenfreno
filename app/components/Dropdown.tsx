import React, { useState } from 'react'
import Link from 'next/link'

const Dropdown = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
  
  return (
    <div className="relative inline-block text-center md:hidden w-full">
      <button
        id="dropdownDefaultButton"
        onClick={toggleDropdown}
        className="text-white font-neue-haas-grotesk font-medium flex items-center justify-center w-full"
        type="button"> MENU
        <svg
          className={`w-2.5 h-2.5 ms-3 hidden ${isOpen ? 'transform rotate-180' : ''}`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="z-20 absolute bg-black divide-y divide-white  w-full font-neue-haas-grotesk">
            <Link href='/' className='block border border-t-white border-x-0 border-b-0 px-4 py-1 hover:bg-hover-gray'>BLOG</Link>
            <Link href='/' className='block px-4 py-1 hover:bg-hover-gray'>TIENDA</Link>
            <Link href='/' className='block px-4 py-1 hover:bg-hover-gray'>EVENTOS</Link>
            <Link href='/' className='block px-4 py-1 hover:bg-hover-gray'>AUTORXS</Link>
            <Link href='/' className='block border border-b-white border-x-0 border-t-0 px-4 py-1 hover:bg-hover-gray'>CONTACTO</Link>
        </div>
      )}
    </div>
  )
}

export default Dropdown