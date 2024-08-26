import React from 'react';
import Locations from './Locations';

const Footer = () => {
  return (
    <footer className='bg-[#121212] text-white flex items-center justify-center text-center z-30'>
      <div className='container mx-auto flex items-center justify-center'>
        <Locations />
      </div>
    </footer>
  );
}

export default Footer;
