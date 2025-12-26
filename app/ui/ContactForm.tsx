'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSuccess(false);
    setError('');

    // Validación adicional
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Por favor complete todos los campos');
      setSending(false);
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingrese un email válido');
      setSending(false);
      return;
    }

    try {
      // Enviar a la API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el mensaje');
      }

      console.log('Email enviado exitosamente:', data.messageId);
      setSuccess(true);
      setError('');
      setName('');
      setEmail('');
      setMessage('');

      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Error al enviar email:', err);
      setError(err instanceof Error ? err.message : 'Error al enviar el mensaje. Intente nuevamente más tarde.');
      setSuccess(false);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col items-start pt-2 px-2 max-w-lg mx-0 rounded-lg shadow-lg">
      <div className='flex flex-col'>
        <p className="text-xs text-white mb-2 font-bold">
          Dudas, consultas, propuestas
        </p>
        <Link href="mailto:eldesenfreno.contacto@gmail.com">
          <button type="button" className="p-2 bg-[#2C2C2C] hover:bg-gray-400 transition-all duration-300 text-xs w-full text-white border border-white border-opacity-20 rounded-lg">
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
        <button
          type="submit"
          className={`p-2 mt-2 ${sending ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#2C2C2C] hover:bg-gray-400'} transition-all duration-300 text-xs w-full text-white border border-white border-opacity-20 rounded-lg`}
          disabled={sending}
        >
          {sending ? 'Enviando...' : 'Enviar'}
        </button>
        {success && (
          <div className="mt-3 p-3 bg-green-900/30 border border-green-500/50 rounded-md">
            <p className="text-green-400 text-xs">✓ ¡Mensaje enviado con éxito! Te responderemos pronto.</p>
          </div>
        )}
        {error && (
          <div className="mt-3 p-3 bg-red-900/30 border border-red-500/50 rounded-md">
            <p className="text-red-400 text-xs">✗ {error}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
