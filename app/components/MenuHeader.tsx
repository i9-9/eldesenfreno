import React from 'react'
import Image from 'next/image'
import Link from 'next/link'


const MenuHeader = () => {
  return (
    <header className="hidden md:fixed top-0 left-0 right-0 z-10 md:flex ml-8 items-center h-8 border-b shrink-0 md:ml-8 bg-[#0a0a0a] divide-y-2 font-neue-display">
        <div className='flex w-full justify-between text-xs'>
          <Link href='/' className='hover:underline'>Index</Link>
          {/* <Link href='/blog' className=' hover:underline'>Blog</Link> */}
          <Link href='/shop' className=' hover:underline'>Tienda</Link>
          <Link href='/events' className=' hover:underline'>Eventos</Link>
          <Link href='/authors' className=' hover:underline'>Autorxs</Link>
          <Link href='/contact' className='hover:underline pr-4'>Contacto</Link>
        </div>
    </header>
  )
}

export default MenuHeader