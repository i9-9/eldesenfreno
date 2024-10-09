import Image from 'next/image';
import React from 'react';

interface AuthorItemProps {
    image: string;
    author: string;
    description: string;
    link: string;
}

const AuthorItem = ({ image, author, description, link }: AuthorItemProps) => {
  return (
    <div className='mx-2 flex flex-col lg:flex-row font-neue-display mb-4'>
      <Image 
        className='object-cover saturate-0 rounded-md w-full lg:w-[400px] lg:h-[400px]'
        src={image} 
        alt={author} 
        width={400} 
        height={400} 
      />
      <div className='md:max-w-[400px] md:mx-4 flex flex-col justify-start'> 
        <h4 className='font-bold mb-1 leading-4'>{author}</h4> 
        <p className='text-xs leading-5 tracking-wide'>{description}</p>
      </div>
    </div>
  );
}

export default AuthorItem;
