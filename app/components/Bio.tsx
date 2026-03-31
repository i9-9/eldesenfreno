import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Bio = () => {
  return (
    <div className='flex flex-col px-2 ml-4'>
        <Link href="/">
          <Image
            src="/photo.png"
            alt='El Desenfreno Ediciones'
            width={400}
            height={467}
            sizes="(max-width: 768px) 100vw, calc(25vw - 34px)"
            className='pt-4 w-full h-auto'
          />
        </Link> 
        <div>
          <p className=' text-white text-xs font-neue-display leading-6 italic -tracking-wide mt-2 p-2 transition-all duration-300 drop-shadow	 opacity-80 rounded-md'>
            No es desierto. Es atropello.
          </p>
        </div>

    </div>
  )
}

export default Bio