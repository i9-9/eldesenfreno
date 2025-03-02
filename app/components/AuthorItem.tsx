import Image from 'next/image';
import React from 'react';

interface AuthorItemProps {
    image: string;
    author: string;
    description: React.ReactNode;
    link: string;
}

const AuthorItem = ({ image, author, description, link }: AuthorItemProps) => {
  return (
    <div className='mx-2 flex flex-col lg:flex-row font-neue-display mb-10'>
      <Image 
        className='object-cover saturate-0 rounded-md w-full lg:w-[400px] lg:h-[400px] mb-4'
        src={image} 
        alt={author} 
        width={400} 
        height={400} 
      />
      <div className='md:max-w-[600px] md:mx-4 flex flex-col justify-start overflow-y-auto h-[400px] scrollbar-hidden'>
        <h4 className='font-bold mb-2 leading-4'>{author}</h4> 
        <p className='text-xs leading-5 tracking-wide'>{description}</p>
      </div>
    </div>
  );
}

export default AuthorItem;
