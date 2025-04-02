'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function PendingPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id');

  return (
    <div className="container mx-auto p-4 text-center font-neue-display">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-yellow-600 mb-4">Pago en proceso</h1>
        <p className="mb-6">
          Tu pago está siendo procesado. Te notificaremos cuando se complete.
        </p>
        
        {paymentId && (
          <p className="text-sm text-gray-600 mb-6">ID de pago: {paymentId}</p>
        )}
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/" className="bg-black text-white px-6 py-2 rounded inline-block">
            Volver al inicio
          </Link>
          <Link href="/shop" className="bg-gray-200 text-gray-800 px-6 py-2 rounded inline-block">
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
} 