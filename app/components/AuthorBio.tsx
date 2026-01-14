import React from 'react';
import Image from 'next/image';

interface AuthorBioProps {
  name: string;
  bio: string;
  image: string | null;
}

const AuthorBio: React.FC<AuthorBioProps> = ({ name, bio, image }) => {
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
          <p className="text-sm leading-7 text-gray-300">{bio}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthorBio;
