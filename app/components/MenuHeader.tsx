import React from 'react'
import Image from 'next/image'
import Link from 'next/link'


const MenuHeader = () => {
  return (
    <header className="hidden md:fixed top-0 left-0 right-0 z-10 md:flex ml-8 items-center h-8 border-b shrink-0 md:ml-8 bg-black divide-y-2 font-neue-display">
        <div className='flex w-full justify-between font-semibold text-sm'>
          <Link href='/' className=' hover:underline'>INDEX</Link>
          <Link href='/blog' className=' hover:underline'>BLOG</Link>
          <Link href='/shop' className=' hover:underline'>TIENDA</Link>
          <Link href='/events' className=' hover:underline'>EVENTOS</Link>
          <Link href='/authors' className=' hover:underline'>AUTORXS</Link>
          <Link href='/contact' className='hover:underline pr-4'>CONTACTO</Link>
        </div>
    </header>
  )
}

export default MenuHeader