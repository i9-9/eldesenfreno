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
    <div className='ml-1 my-1 max-w-full flex flex-col lg:flex-row font-neue-display'>
        <Image className='mb-2 object-cover saturate-0' src={flyer} alt={title} width={400} height={400}/>
        <div className='md:max-w-[400px] pb-4 md:mx-4'>
          <div className=' p-2 text-xs bg-[#121212]  transition-all duration-700 drop-shadow	 opacity-80 rounded-md'>
        <h4 className='font-semibold mb-2'>{title}</h4>
          <p className='text-xs'>{location}</p>
          <p className='text-xs'>{date}</p>
          {/* <p className='text-xs mb-2 leading-5 tracking-wide'>{description}</p> */}
          </div>
          <button className=" mt-2 p-2 text-xs bg-[#121212] hover:bg-gray-400 transition-all duration-700 drop-shadow	 opacity-80 rounded-md">
            Ver más
          </button>
        </div>
    </div>
  )
}

export default EventItem