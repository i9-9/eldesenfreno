import React from 'react'
import Image from 'next/image'
import Link from 'next/link'


const Menu = () => {
  return (
    <div className='w-full h-8 divide-y-2 pr-4 bg-black pt-2'>
      <div className='flex w-full justify-between font-semibold text-sm'>
        <Link href='/' className=' hover:underline'>INDEX</Link>
        <Link href='/blog' className=' hover:underline'>BLOG</Link>
        <Link href='/shop' className=' hover:underline'>TIENDA</Link>
        <Link href='/events' className=' hover:underline'>EVENTOS</Link>
        <Link href='/authors' className=' hover:underline'>AUTORXS</Link>
        <Link href='/contact' className='hover:underline pr-4'>CONTACTO</Link>
      </div>
    </div>
  )
}

export default Menu