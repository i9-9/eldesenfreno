import React from 'react';
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
    <div className='ml-1 my-1 flex flex-col lg:flex-row font-neue-display'>
        <Image
            className='mb-2 px-2 object-cover saturate-0 rounded-md w-full lg:w-auto '
            src={flyer}
            alt={title}
            width={400}
            height={400}
        />
        <div className='md:max-w-[400px] pb-4 md:mx-4'>
          <div className='p-2 mx-2 md:mx-0 bg-[#2c2c2c] hover:bg-gray-400 transition-all duration-700 drop-shadow opacity-80 text-xs rounded-md'>
            <h4 className='font-semibold mb-2'>{title}</h4>
            <p className='text-xs'>{location}</p>
            <p className='text-xs'>{date}</p>
          </div>
        </div>
    </div>
  );
};

export default EventItem;
