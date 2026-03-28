'use client';

import Image from 'next/image';
import React, { useCallback, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';

type Variant = 'sm' | 'lg';

type Props = {
  src: string;
  alt: string;
  variant?: Variant;
};

export default function AuthorPhotoLightbox({ src, alt, variant = 'sm' }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  const thumb =
    variant === 'sm'
      ? 'h-[22px] w-[22px] ring-1 ring-white/20'
      : 'h-11 w-11 ring-1 ring-white/20';

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className={`relative shrink-0 overflow-hidden rounded-full ${thumb} cursor-zoom-in transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Ampliar foto de ${alt}`}
      >
        <Image src={src} alt="" fill className="object-cover" sizes={variant === 'sm' ? '22px' : '44px'} />
      </button>

      {open &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"
              aria-label="Cerrar"
              onClick={close}
            />
            <div className="relative z-[1] flex w-full max-w-[calc(100vw-2rem)] flex-col sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
              <div className="mb-3 flex items-center justify-between gap-3 px-0.5">
                <p id={titleId} className="truncate text-sm font-medium text-white/90">
                  {alt}
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="shrink-0 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20"
                >
                  Cerrar
                </button>
              </div>
              <div className="overflow-hidden rounded-xl border border-white/10 bg-black/50 shadow-2xl">
                <div className="flex max-h-[min(85vh,880px)] w-full items-center justify-center p-2 sm:p-4 md:p-5">
                  <Image
                    src={src}
                    alt={alt}
                    width={1600}
                    height={1600}
                    className="h-auto max-h-[min(85vh,880px)] w-full object-contain"
                    sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 768px) min(90vw, 36rem), (max-width: 1024px) min(85vw, 42rem), min(48rem, 75vw)"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
