import Link from 'next/link'
import React from 'react'
import Dropdown from './Dropdown'

const MobileHeader = () => {
  return (
    <div className='flex flex-col md:hidden'>
        <Link href="/" className=' my-1'>
            <h5 className='text-center text-xl tracking-tighter'>
                EL DESENFRENO EDICIONES
            </h5>
        </Link>
        <Dropdown/>
  </div>
)
}

export default MobileHeader