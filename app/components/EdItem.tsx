import Image from 'next/image'
import React from 'react'
import Link from 'next/link';
import AddToCartButton from './AddToCartButton';
import { formatPrice } from '../utils/formatPrice';

interface EdItemProps {
    id: string;
    image: string | null;
    title: string;
    author: string;
    review: string;
    reviewName: string;
    link: string;
    price: string;
}

const EdItem = ({id, image, title, author, review, reviewName, link, price}: EdItemProps) => {

  return (
    <div className='m-2 font-neue-display'>
        {image && (
          <Link href={`/product/${id}`}>
            <Image 
              className='rounded-md mb-2 drop-shadow-md border border-[#666666] border-opacity-20 object-contain w-full'
              src={image} 
              alt={title} 
              width={500}
              height={600}
            />
          </Link>
        )}
        <div className='md:max-w-[500px] pb-4 px-2'>
          <h4 className='font-semibold text-lg'>{title}</h4>
          <h5 className='text-xs mb-4'>{author}</h5>
          <p className='text-xs mb-4 leading-5'>{review}</p>
          <p className='text-xs italic mb-2'>{reviewName}</p>
          <p className='text-lg font-bold mb-4'>{formatPrice(price)}</p>
          <div className='flex'>
            <Link href={`/product/${id}`}>
              <button className='p-2 bg-[#121212] text-white hover:bg-gray-400 transition-all 
              duration-700 drop-shadow opacity-80 text-xs mr-2 rounded-md'>Ver detalles</button>
            </Link>
            <AddToCartButton id={id} title={title} price={price} image={image} />
          </div>
        </div>
    </div>
  )
}

export default EdItem