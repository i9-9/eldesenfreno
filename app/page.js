'use client';

import React from "react";
import Link from "next/link";
import EdItem from "./components/EdItem";
import AnimatedImage from "./components/AnimatedImage";
import editions from "./editions";

export default function Home() {
  // Obtener el último libro (novedad)
  const latestBook = editions[editions.length - 1];

  if (!latestBook) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400">No hay libros disponibles.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col pt-2">
      {/* Título de la sección */}
      <h2 className="text-xl font-neue-display font-bold -tracking-wide mx-2 mb-2">Novedades</h2>

      {/* Novedad - Último libro */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start rounded-md bg-[#0B0B0B]">
        {/* Imagen del libro */}
        <div className="m-2 font-neue-display">
          {latestBook.image && (
            <AnimatedImage
              src={latestBook.image}
              alt={latestBook.title}
              width={500}
              height={600}
              priority
              className="rounded-md mb-2 drop-shadow-md border border-[#666666] border-opacity-20 object-contain w-full"
            />
          )}
        </div>
        
        {/* Información del libro */}
        <div className="m-2 font-neue-display">
          <EdItem
            id={latestBook.id}
            image={null}
            title={latestBook.title}
            author={latestBook.author}
            review={latestBook.review}
            reviewName={latestBook.reviewName}
            link={latestBook.link}
            price={latestBook.price}
          />
        </div>
      </div>

      {/* Link a la tienda para ver más */}
      <div className="flex justify-center mt-8 mb-4">
        <Link 
          href="/shop"
          className="text-sm text-gray-400 hover:text-white transition-colors border border-white/20 px-6 py-3 rounded-lg hover:bg-white/5"
          style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
        >
          Ver todo el catálogo →
        </Link>
      </div>
    </div>
  );
}
