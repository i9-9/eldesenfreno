'use client'


import React, { useState } from 'react'
import Link from 'next/link'

const Dropdown = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
  
  return (
    <div className="relative md:hidden w-full border border-white border-x-0 ">
      <div className='flex w-full px-2 justify-around items-center' id="dropdownDefaultButton" onClick={toggleDropdown}>
        <p className="text-white w-full text-xl"> MENU </p>
        <svg 
          className={`${isOpen ? 'transform rotate-180' : ''}`} 
          width="16" 
          height="14" 
          viewBox="0 0 16 14" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M8 14L0.205772 0.5L15.7942 0.5L8 14Z" 
              fill="#D9D9D9"/>
          </svg>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="z-20 absolute bg-black divide-y divide-white w-full text-xl">
            <Link href='/' className='block border border-t-white border-x-0 border-b-0 px-2 py-1 hover:bg-hover-gray' onClick={() => setIsOpen(false)}>INDEX</Link>
            <Link href='/blog' className='block px-2 py-1 active:bg-hover-gray' onClick={() => setIsOpen(false)}>BLOG</Link>
            <Link href='/shop' className='block px-2 py-1 active:bg-hover-gray' onClick={() => setIsOpen(false)}>TIENDA</Link>
            <Link href='/events' className='block px-2 py-1 active:bg-hover-gray' onClick={() => setIsOpen(false)}>EVENTOS</Link>
            <Link href='/authors' className='block px-2 py-1 active:bg-hover-gray' onClick={() => setIsOpen(false)}>AUTORXS</Link>
            <Link href='/contact' className='block border border-b-white border-x-0 border-t-0 px-2 py-1 active:bg-hover-gray' onClick={() => setIsOpen(false)}>CONTACTO</Link>
        </div>
      )}
    </div>
  )
}

export default Dropdown