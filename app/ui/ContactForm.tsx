import Link from 'next/link';
import React from 'react';

const ContactForm = () => {
  return (
    <div className="flex flex-col items-start pt-2 px-2 max-w-lg mx-0 rounded-lg shadow-lg">
      <div className='flex flex-col'>
        <p className="text-xs text-white mb-2">
          Dudas, consultas, propuestas
        </p>
        <Link href="mailto:eldesenfreno@gmail.com" className="text-white py-2 hover:underline text-xs">
        <button type="submit" className="p-2 bg-[#2C2C2C] hover:bg-gray-400 transition-all duration-700 drop-shadow opacity-80 text-xs w-full bg-opacity-10 border border-white border-opacity-20 rounded-lg">
          eldesenfreno@gmail.com
        </button>
        </Link>
      </div>
      <form className="w-full flex flex-col text-xs mt-4">
        <label className="text-white mb-2" htmlFor="name">Nombre:</label>
        <input
          type="text"
          id="name"
          name="name"
          className="p-2 mb-4 bg-[#121212] border border-white border-opacity-20 rounded-md text-white focus:border-gray-400 focus:outline-none"
          placeholder="Su nombre"
        />
        <label className="text-white mb-2" htmlFor="email">Correo electrónico:</label>
        <input
          type="email"
          id="email"
          name="email"
          className="p-2 mb-4 bg-[#121212] border border-white border-opacity-20 rounded-md text-white focus:border-gray-400 focus:outline-none"
          placeholder="Su correo electrónico"
        />
        <label className="text-white mb-2" htmlFor="message">Mensaje:</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="p-2 mb-4 bg-[#121212] border border-white border-opacity-20 rounded-md text-white focus:border-gray-400 focus:outline-none"
          placeholder="Escriba su mensaje aquí"
        />
        <button type="submit" className="p-2 bg-[#2C2C2C] hover:bg-gray-400 transition-all duration-700 drop-shadow opacity-80 text-xs w-full bg-opacity-10 border border-white border-opacity-20 rounded-lg">
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
