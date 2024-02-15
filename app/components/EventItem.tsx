import React from 'react'
import Image from 'next/image';

interface EventItemProps {
    flyer: string;
    title: string;
    location: string;
    date: string;
    description: string;
    eventLink: string;
}
const EventItem = ({ flyer, title, location, date, description, eventLink }: EventItemProps) => {
  return (
    <div className='m-2 max-w-full flex flex-col lg:flex-row font-neue-display'>
        <Image className='mb-2 object-cover saturate-0' src={flyer} alt={title} width={400} height={400}/>
        <div className='md:max-w-[400px] pb-4 md:mx-4'>
        <h4 className='font-semibold'>{title}</h4>
          <p className='text-xs'>{location}</p>
          <p className='text-xs mb-2'>{date}</p>
          <p className='text-xs mb-2 leading-5 tracking-wide'>{description}</p>
          <button className="border border-white p-2 text-xs font-semibold">
            ENTRADAS
          </button>
        </div>
    </div>
  )
}

export default EventItem