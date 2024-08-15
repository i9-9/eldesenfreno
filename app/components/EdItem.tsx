import Image from 'next/image'
import React from 'react'
import Link from 'next/link';

interface EdItemProps {
    image: string;
    title: string;
    author: string;
    review: string;
    reviewName: string;
    link: string;
}
const EdItem = ({image, title, author, review, reviewName, link}: EdItemProps) => {

  return (
    <div className='m-2 font-neue-display'>
        <Image className='border border-white mb-2' src={image} alt={title} width={500} height={600}/>
        <div className='md:max-w-[500px] pb-4'>
          <h4 className='font-semibold'>{title}</h4>
          <h5 className=' text-xs mb-4 font-semibold'>{author}</h5>
          <p className='text-xs mb-4 leading-5'>{review}</p>
          <p className='text-xs italic mb-6'>{reviewName}</p>
          <div className='flex'>
            <Link href={link}>
              <button className=' p-2 bg-[#121212] hover:text-[#121212] hover:bg-gray-400 transition-all duration-700 drop-shadow	 opacity-80 text-xs mr-2 rounded-md hover:text'>Saber más</button>
            </Link>
              {/* <button className=' p-2 text-xs bg-[#121212] hover:bg-gray-400 transition-all duration-700 drop-shadow	 opacity-80 rounded-md'>Comprar</button> */}
          </div>
        </div>
    </div>
  )
}

export default EdItem