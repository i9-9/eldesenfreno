import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import Link from 'next/link';

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);

    // Enviar el formulario usando emailjs
    emailjs.sendForm('service_jo40tzl', 'template_5fep019', e.target, 'cWBowbfYgWXQ64nWu')
      .then((result) => {
        console.log(result.text);
        setSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
      })
      .catch((error) => {
        console.log(error.text);
        setSuccess(false);
      })
      .finally(() => {
        setSending(false);
      });
  };

  return (
    <div className="flex flex-col items-start pt-2 px-2 max-w-lg mx-0 rounded-lg shadow-lg">
      <div className='flex flex-col'>
        <p className="text-xs text-white mb-2 font-bold">
          Dudas, consultas, propuestas
        </p>
        <Link href="mailto:eldesenfreno.contacto@gmail.com">
          <button type="button" className="p-2 bg-[#2C2C2C] hover:bg-gray-400 transition-all duration-700 text-xs w-full text-white border border-white border-opacity-20 rounded-lg">
            eldesenfreno.contacto@gmail.com
          </button>
        </Link>
      </div>
      <form className="w-full flex flex-col text-xs mt-4" onSubmit={handleSubmit}>
        <label className="text-white mb-2" htmlFor="name">Nombre:</label>
        <input
          type="text"
          id="name"
          name="from_name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 mb-4 bg-[#121212] border border-white border-opacity-20 rounded-md text-white focus:border-gray-400 focus:outline-none"
          placeholder="Su nombre"
          required
        />
        <label className="text-white mb-2" htmlFor="email">Correo electrónico:</label>
        <input
          type="email"
          id="email"
          name="from_email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 mb-4 bg-[#121212] border border-white border-opacity-20 rounded-md text-white focus:border-gray-400 focus:outline-none"
          placeholder="Su correo electrónico"
          required
        />
        <label className="text-white mb-2" htmlFor="message">Mensaje:</label>
        <textarea
          id="message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="p-2 mb-4 bg-[#121212] border border-white border-opacity-20 rounded-md text-white focus:border-gray-400 focus:outline-none"
          placeholder="Escriba su mensaje aquí"
          required
        />
        <input type="hidden" name="reply_to" value={email} /> {/* Campo oculto para reply_to */}
        <button
          type="submit"
          className={`p-2 mt-2 ${sending ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#2C2C2C] hover:bg-gray-400'} transition-all duration-700 text-xs w-full text-white border border-white border-opacity-20 rounded-lg`}
          disabled={sending}
        >
          {sending ? 'Enviando...' : 'Enviar'}
        </button>
        {success && <p className="text-green-500 mt-2">¡Mensaje enviado con éxito!</p>}
      </form>
    </div>
  );
};

export default ContactForm;
