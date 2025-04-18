'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function FailurePage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Hubo un problema al procesar tu pago';

  return (
    <div className="container mx-auto p-4 text-center font-neue-display">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Pago no completado</h1>
        <p className="mb-6 text-gray-700">
          {error}
          <br />
          <span className="text-sm mt-2 block">
            Si el problema persiste, por favor contacta a soporte en eldesenfreno.contacto@gmail.com
          </span>
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/checkout" 
            className="bg-[#121212] text-white px-6 py-3 rounded hover:bg-gray-800 transition"
          >
            Intentar nuevamente
          </Link>
          <Link 
            href="/shop" 
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded hover:bg-gray-300 transition"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
} 