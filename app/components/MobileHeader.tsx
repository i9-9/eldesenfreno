import Link from 'next/link'
import React from 'react'
import Dropdown from './Dropdown'
import Marquee from 'react-fast-marquee'

const MobileHeader = () => {
  const marqueeText = ' EL DESENFRENO EDICIONES •'.repeat(5);

  return (
    <div className='flex flex-col md:hidden items-center w-[calc(100%-1rem)] mx-2'>
      <Link href="/" className='w-full'>
        <Marquee 
          gradient={false} 
          direction='left' 
          speed={30} 
          loop={0}
          className='py-3 my-2 bg-[#2C2C2C] hover:bg-gray-400 transition-all duration-700 opacity-80 bg-opacity-10 rounded-md mb-2 drop-shadow-md border border-[#666666] border-opacity-20 backdrop-blur-lg shadow-lg'
        >
          <h5 className='text-center text-4xl tracking-tighter'>
            {marqueeText}
          </h5>
        </Marquee>
      </Link>
      <Dropdown />
    </div>
  )
}

export default MobileHeader
