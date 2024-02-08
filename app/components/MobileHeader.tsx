import Link from 'next/link'
import React from 'react'
import Dropdown from './Dropdown'

interface MobileHeaderProps {
    font: string;
}

const MobileHeader = ({font}: MobileHeaderProps) => {
  return (
    <div className='flex flex-col md:hidden'>
        <Link href="/" className=' my-1'>
            <h5 className={`${font} 'border border-b-white border-x-0 border-t-0 text-center text-xl tracking-tighter'`}>
                EL DESENFRENO EDICIONES
            </h5>
        </Link>
        <Dropdown/>
  </div>
)
}

export default MobileHeader