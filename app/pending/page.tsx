'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PendingContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id');

  return (
    <div className="container mx-auto p-4 text-center font-neue-display">
      <div className="max-w-md mx-auto bg-[#111] p-8 rounded-xl border border-white/10">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-500">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-yellow-500 mb-4">Pago en proceso</h1>
        <p className="text-gray-400 mb-6">
          Tu pago está siendo procesado. Te notificaremos cuando se complete.
        </p>
        
        {paymentId && (
          <p className="text-sm text-gray-500 mb-6">ID de pago: {paymentId}</p>
        )}
        
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link href="/" className="px-6 py-2.5 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors">
            Volver al inicio
          </Link>
          <Link href="/shop" className="px-6 py-2.5 bg-[#1a1a1a] text-white border border-white/20 rounded-full hover:bg-[#252525] transition-colors">
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PendingPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto p-4 text-center font-neue-display">
        <div className="max-w-md mx-auto bg-[#111] p-8 rounded-xl border border-white/10">
          <div className="animate-pulse">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-700" />
            <div className="h-8 bg-gray-700 rounded mb-4 w-3/4 mx-auto" />
            <div className="h-4 bg-gray-700 rounded mb-2 w-full" />
            <div className="h-4 bg-gray-700 rounded mb-6 w-2/3 mx-auto" />
          </div>
        </div>
      </div>
    }>
      <PendingContent />
    </Suspense>
  );
}
