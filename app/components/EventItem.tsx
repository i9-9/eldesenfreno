"use client"; // Ensure this is present

import React, { useState } from 'react';
import Image from 'next/image';

interface EventItemProps {
    flyer: string;
    flyerHover?: string; // Optional hover image
    title: string;
    location: string;
    date: string;
    description: string;
    eventLink: string;
}

const EventItem = ({
    flyer,
    flyerHover,
    title,
    location,
    date,
    description,
    eventLink,
}: EventItemProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="ml-1 my-1 flex flex-col lg:flex-row font-neue-display">
            <div
                className="relative w-full lg:w-auto"
                onMouseEnter={() => flyerHover && setIsHovered(true)}
                onMouseLeave={() => flyerHover && setIsHovered(false)}
            >
                <Image
                    className={`mb-2 px-2 object-cover rounded-md transition-opacity duration-700 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
                    src={flyer}
                    alt={title}
                    width={400}
                    height={400}
                />
                {flyerHover && (
                    <Image
                        className={`absolute top-0 left-0 mb-2 px-2 object-cover rounded-md transition-opacity duration-1000 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                        src={flyerHover}
                        alt={`${title} hover`}
                        width={400}
                        height={400}
                    />
                )}
            </div>
            <div className="md:max-w-[400px] pb-4 md:mx-4">
                <div className="p-2 mx-2 md:mx-0 bg-[#2c2c2c] hover:bg-gray-400 transition-all duration-700 drop-shadow opacity-80 text-xs rounded-md">
                    <h4 className="font-semibold mb-2">{title}</h4>
                    <p className="text-xs">{location}</p>
                    <p className="text-xs">{date}</p>
                    {eventLink && (
                        <a
                            href={eventLink}
                            className="text-blue-500 underline text-xs"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            More Info
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventItem;
