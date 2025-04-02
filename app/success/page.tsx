'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';

export default function SuccessPage() {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const { clearCart } = useCart();

  useEffect(() => {
    // Obtener los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get('payment_id');
    const status = params.get('status');
    
    // Limpiar el carrito cuando llegamos a la página de éxito
    clearCart();

    if (status === 'success' && paymentId) {
      setStatus('success');
      setMessage('¡Gracias por tu compra! Te enviaremos un email con los detalles de tu pedido.');
    } else {
      setStatus('error');
      setMessage('Hubo un problema con tu pago. Por favor, contacta a soporte.');
    }
  }, [clearCart]);

  return (
    <div className="container mx-auto p-4 text-center font-neue-display">
      <div className="max-w-md mx-auto">
        {status === 'loading' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Procesando tu pago...</h1>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
          </div>
        )}

        {status === 'success' && (
          <div>
            <h1 className="text-2xl font-bold mb-4 text-green-500">¡Pago exitoso!</h1>
            <p className="mb-6">{message}</p>
            <Link 
              href="/shop" 
              className="bg-[#121212] text-white px-6 py-3 rounded hover:bg-gray-800 transition"
            >
              Volver a la tienda
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div>
            <h1 className="text-2xl font-bold mb-4 text-red-500">Error en el pago</h1>
            <p className="mb-6">{message}</p>
            <Link 
              href="/checkout" 
              className="bg-[#121212] text-white px-6 py-3 rounded hover:bg-gray-800 transition"
            >
              Volver al checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 