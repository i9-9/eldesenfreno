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
    <div className='m-2 md:w-96'>
        <Image className='border border-white mb-2' src={image} alt={title} width={300} height={400}/>
        <h4 className='uppercase font-semibold mb-2'>{title}</h4>
        <h5 className='uppercase text-xs mb-2'>{author}</h5>
        <p className='text-xs mb-2'>{review}</p>
        <p className='text-xs italic mb-4'>{reviewName}</p>
        <div className='flex'>
            <button className='border border-white p-2 text-xs mr-2'>Saber más</button>
            <button className='border border-white p-2 text-xs'>Comprar</button>
        </div>
    </div>
  )
}

export default EdItem