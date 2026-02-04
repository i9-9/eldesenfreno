'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface AuthorBioProps {
  name: string;
  bio: string;
  image: string | null;
}

const AuthorBio: React.FC<AuthorBioProps> = ({ name, bio, image }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#0B0B0B] rounded-lg p-6 mt-8">
      <h3 className="text-lg font-semibold mb-4">Sobre el autor</h3>
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {image && (
          <div className="flex-shrink-0">
            <Image
              src={image}
              alt={name}
              width={120}
              height={120}
              className="rounded-lg object-cover border border-white/10"
            />
          </div>
        )}
        <div className="flex-1">
          <h4 className="text-base font-semibold mb-2">{name}</h4>
          <div className="relative">
            <div
              className={`text-sm leading-7 text-gray-300 transition-all duration-500 ease-in-out ${
                isExpanded ? 'max-h-[2000px]' : 'max-h-[7rem] overflow-hidden'
              }`}
              dangerouslySetInnerHTML={{ __html: bio }}
            />
            {!isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0B0B0B] to-transparent pointer-events-none" />
            )}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-white/70 hover:text-white mt-3 transition-colors duration-200 flex items-center gap-1"
          >
            {isExpanded ? (
              <>
                Leer menos
                <svg className="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </>
            ) : (
              <>
                Leer más
                <svg className="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthorBio;
