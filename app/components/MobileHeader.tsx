import Link from 'next/link'
import React from 'react'
import Dropdown from './Dropdown'
import Marquee from 'react-fast-marquee'

const MobileHeader = () => {
  const marqueeText = 'EL DESENFRENO EDICIONES '.repeat(20);

  return (
    <div className='flex flex-col md:hidden items-center'>
      <Link href="/">
        <Marquee gradient={false} direction='left' speed={100} className='text-8xl overflow-hidden'>
          <div className='flex items-center whitespace-nowrap'>
            <h5 className='text-center text-xl tracking-tighter'>
              {marqueeText}
            </h5>
          </div>
        </Marquee>
      </Link>
      <Dropdown/>
    </div>
  )
}

export default MobileHeader
