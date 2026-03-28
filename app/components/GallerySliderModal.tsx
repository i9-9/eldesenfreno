'use client';

import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import AnimatedImage from './AnimatedImage';

type Props = {
  images: string[];
  title: string;
};

export default function GallerySliderModal({ images, title }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  const len = images.length;

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + len) % len);
  }, [len]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % len);
  }, [len]);

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (len < 2) return;
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };

    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close, goPrev, goNext, len]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null || len < 2) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 48) return;
    if (dx > 0) goPrev();
    else goNext();
  };

  if (len === 0) return null;

  return (
    <>
      <section className="mb-12">
        <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-400">Galería</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {images.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              onClick={() => openAt(i)}
              className="group relative cursor-zoom-in overflow-hidden rounded-lg border-0 bg-transparent p-0 text-left outline-none ring-white/40 transition-transform focus-visible:ring-2"
              aria-label={`Ampliar imagen ${i + 1} de ${len}`}
            >
              <AnimatedImage
                src={img}
                alt={`${title} — imagen ${i + 1}`}
                width={400}
                height={400}
                className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                animationDelay={i * 100}
              />
            </button>
          ))}
        </div>
      </section>

      {open &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8"
            role="dialog"
            aria-modal="true"
            aria-label="Galería ampliada"
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"
              aria-label="Cerrar galería"
              onClick={close}
            />

            <div className="relative z-[1] flex w-full max-w-[min(100vw-1.5rem,56rem)] flex-col lg:max-w-4xl">
              <div className="mb-2 flex items-center justify-between gap-3 px-1">
                <p className="font-neue-haas-grotesk text-sm text-white/70">
                  {index + 1} / {len}
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="rounded-full border border-white/20 bg-black/50 px-3 py-1.5 font-neue-haas-grotesk text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/70 sm:px-4 sm:py-2 sm:text-sm"
                >
                  Cerrar
                </button>
              </div>

              <div
                className="relative overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-2xl"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                <div className="flex min-h-[min(72vh,720px)] items-center justify-center px-2 py-10 sm:px-4 sm:py-12 md:min-h-[min(78vh,800px)] md:px-8">
                  <div className="relative flex max-h-[min(72vh,720px)] w-full items-center justify-center md:max-h-[min(78vh,800px)]">
                    <Image
                      src={images[index]}
                      alt={`${title} — ${index + 1} de ${len}`}
                      width={1600}
                      height={1600}
                      className="h-auto max-h-[min(72vh,720px)] w-full object-contain md:max-h-[min(78vh,800px)]"
                      sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) min(90vw, 48rem), min(56rem, 85vw)"
                      priority
                    />
                  </div>
                </div>

                {len > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goPrev();
                      }}
                      className="absolute left-1 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70 sm:left-2 sm:h-12 sm:w-12 md:left-3"
                      aria-label="Imagen anterior"
                    >
                      <ChevronIcon dir="left" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goNext();
                      }}
                      className="absolute right-1 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70 sm:right-2 sm:h-12 sm:w-12 md:right-3"
                      aria-label="Imagen siguiente"
                    >
                      <ChevronIcon dir="right" />
                    </button>
                  </>
                )}
              </div>

              {len > 1 && (
                <div className="mt-3 flex justify-center gap-1.5 px-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setIndex(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/35 hover:bg-white/55'
                      }`}
                      aria-label={`Ir a la imagen ${i + 1}`}
                      aria-current={i === index ? 'true' : undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

function ChevronIcon({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {dir === 'left' ? (
        <path d="M15 18l-6-6 6-6" />
      ) : (
        <path d="M9 18l6-6-6-6" />
      )}
    </svg>
  );
}
