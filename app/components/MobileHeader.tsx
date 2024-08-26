import Link from 'next/link'
import React from 'react'
import Dropdown from './Dropdown'
import Marquee from 'react-fast-marquee'

const MobileHeader = () => {
  const marqueeText = 'EL DESENFRENO EDICIONES '.repeat(200);

  return (
    <div className='flex flex-col md:hidden items-center'>
      <Link href="/">
        <Marquee 
          gradient={false} 
          direction='left' 
          speed={50} 
          loop={0} // Set loop to 0 for infinite loop
          className='text-8xl'
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
