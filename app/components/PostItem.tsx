'use client';

import Image from 'next/image';
import React from 'react'
import AnimatedImage from './AnimatedImage';

interface PostItemProps {
  image: string;
  title: string;
  subtitle: string;
  date: string;
  author: string;
}
  
const PostItem = ({image, title, subtitle, date, author}: PostItemProps) => {
  return (
    <article className='group flex flex-col py-4 cursor-pointer'>
      {/* Imagen con overlay en hover */}
      <div className="relative overflow-hidden rounded-lg mb-4">
        <AnimatedImage
          src={image}
          alt={title}
          width={400}
          height={280}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className='object-cover w-full aspect-[4/3] group-hover:scale-105 transition-transform duration-500'
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>
      
      {/* Contenido */}
      <div className="space-y-2">
        <h3 className='text-lg font-semibold leading-tight group-hover:text-gray-300 transition-colors line-clamp-2'>
          {title}
        </h3>
        {subtitle && (
          <p className='text-sm text-gray-400 line-clamp-2'>{subtitle}</p>
        )}
        
        {/* Meta info */}
        <div className='flex items-center justify-between text-xs text-gray-500 pt-2'>
          <div className='flex items-center gap-1.5'>
            <Image src='/post-rounded.svg' width={10} height={10} alt='Autor'/>
            <span>{author}</span>
          </div>
          <time className='italic'>{date}</time>
        </div>
      </div>
    </article>
  )
}

export default PostItem
