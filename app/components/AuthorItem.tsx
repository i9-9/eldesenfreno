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
    <div className='mx-2 max-w-full flex flex-col lg:flex-row font-neue-display mb-4'>
      <Image 
        className='mb-4 object-cover saturate-0 rounded-md w-full lg:w-auto' 
        src={image} 
        alt={author} 
        width={400} 
        height={400} 
      />
      <div className='md:max-w-[400px] pb-4 md:mx-4'>
        <h4 className='font-bold mb-2 leading-4'>{author}</h4>
        <p className='text-xs mb-2 leading-5 tracking-wide'>{description}</p>
      </div>
    </div>
  );
}

export default AuthorItem;
