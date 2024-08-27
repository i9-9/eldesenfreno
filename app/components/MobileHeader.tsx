import Link from 'next/link'
import React from 'react'
import Dropdown from './Dropdown'
import Marquee from 'react-fast-marquee'

const MobileHeader = () => {
  const marqueeText = ' EL DESENFRENO EDICIONES •'.repeat(20000);

  return (
    <div className='flex flex-col md:hidden items-center'>
      <Link href="/">
        <Marquee 
          gradient={false} 
          direction='left' 
          speed={30} 
          loop={0} // Set loop to 0 for infinite loop
          className='text-8xl py-3 my-2 border-t border-b  bg-[#2C2C2C]  hover:bg-gray-400 transition-all duration-700 drop-shadow opacity-80  w-full bg-opacity-10 border border-white border-opacity-80 rounded-lg backdrop-blur-lg shadow-lg'
        >
          <div className='flex items-center whitespace-nowrap'>
            <h5 className='text-center text-xl tracking-tighter'>
              {marqueeText}
            </h5>
          </div>
        </Marquee>
      </Link>
      <Dropdown />
    </div>
  )
}

export default MobileHeader
