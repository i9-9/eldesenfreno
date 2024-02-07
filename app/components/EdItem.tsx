import Image from 'next/image'
import React from 'react'

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
    <div className='m-2 font-neue-haas-grotesk md:max-h-screen '>
        <Image className='border border-white mb-2' src={image} alt={title} width={500} height={600}/>
        <div className='md:max-w-[600px] pb-4'>
          <h4 className='uppercase font-semibold mb-2'>{title}</h4>
          <h5 className='uppercase text-xs mb-2'>{author}</h5>
          <p className='text-xs mb-2 leading-4'>{review}</p>
          <p className='text-xs italic mb-4'>{reviewName}</p>
          <div className='flex'>
              <button className='border border-white p-2 text-xs mr-2'>Saber más</button>
              <button className='border border-white p-2 text-xs'>Comprar</button>
          </div>
        </div>
    </div>
  )
}

export default EdItem