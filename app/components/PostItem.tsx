import Image from 'next/image';
import React from 'react'

interface ShopItemProps {
    image: string;
    title: string;
    subtitle: string;
    date: string;
    author: string;
  }
  
const PostItem = ({image, title, subtitle, date, author}: ShopItemProps) => {
  return (
    <div className='flex flex-col lg:max-w-[300px] lg:max-h-[500px] py-4'>
        <Image src={image} alt={title} width={300} height={300} className='object-cover' />
        <p className='text-lg'>{title}</p>
        <p className='text-xs'>{subtitle}</p>
        <div className='flex justify-between text-[8px]'>
            <div className='flex mt-1'>
                <Image src='/post-rounded.svg' width={8} height={8} alt='Posted By'/>
                <p className='ml-1'>{author}</p>
            </div>
            <p className='italic'>{date}</p>
        </div>
    </div>
  )
}

export default PostItem