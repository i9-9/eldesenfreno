import Image from 'next/image'
import React from 'react'

interface AuthorItemProps {
    image: string;
    author: string;
    description: string;
    link: string;
};
const AuthorItem = ({image,  author, description, link}: AuthorItemProps) => {

  return (
    <div className='m-2 max-w-full flex flex-col lg:flex-row font-neue-display'>
        <Image className='mb-2 object-cover saturate-0' src={image} alt={author} width={400} height={400}/>
        <div className='md:max-w-[400px] pb-4 md:mx-4'>
          <h4 className='font-bold mb-2'>{author}</h4>
          <p className='text-sm mb-2 leading-5 tracking-wide'>{description}</p>
        </div>
    </div>
  )
}

export default AuthorItem