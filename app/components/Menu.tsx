import React from 'react'
import Image from 'next/image'
import Link from 'next/link'


const Menu = () => {
  return (
    <div className='w-full h-12 md:w-1/4 md:h-screen m-4'>
      <div className='md:flex md:flex-col hidden md:visible font-semibold font-neue-haas-grotesk'>
        <Image src='/logo.png' width={50} height={100} alt='El Desenfreno' className='mb-4'/>
        <Link href='/'>BLOG</Link>
        <Link href='/'>TIENDA</Link>
        <Link href='/'>EVENTOS</Link>
        <Link href='/'>AUTORXS</Link>
        <Link href='/'>CONTACTO</Link>
      </div>
    </div>
  )
}

export default Menu