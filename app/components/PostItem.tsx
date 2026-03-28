'use client';

import Image from 'next/image';
import React from 'react';
import AnimatedImage from './AnimatedImage';
import AuthorPhotoLightbox from './AuthorPhotoLightbox';

interface PostItemProps {
  image: string;
  title: string;
  subtitle: string;
  date: string;
  author: string;
  /** Foto del autor (Contentful); si no hay, ícono por defecto */
  authorImage?: string | null;
  /** Etiqueta de sección (Prensa, Eventos, Multimedia) */
  sectionLabel?: string;
}
  
const PostItem = ({image, title, subtitle, date, author, authorImage, sectionLabel}: PostItemProps) => {
  return (
    <article className='group flex flex-col py-4 cursor-pointer'>
      {/* Imagen con overlay en hover */}
      <div className="relative overflow-hidden rounded-lg mb-4">
        <div className="grayscale">
          <AnimatedImage
            src={image}
            alt={title}
            width={600}
            height={600}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 z-[1] bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
        {sectionLabel && (
          <span className="pointer-events-none absolute bottom-2 left-2 z-[2] rounded bg-black/65 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/95 backdrop-blur-sm">
            {sectionLabel}
          </span>
        )}
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
          <div className='flex items-center gap-2'>
            {authorImage ? (
              <AuthorPhotoLightbox src={authorImage} alt={author} variant="sm" />
            ) : (
              <Image src='/post-rounded.svg' width={10} height={10} alt='Autor'/>
            )}
            <span>{author}</span>
          </div>
          <time className='italic'>{date}</time>
        </div>
      </div>
    </article>
  )
}

export default PostItem
