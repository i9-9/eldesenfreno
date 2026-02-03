'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import editions from '../../editions';
import AddToCartButton from '../../components/AddToCartButton';
import AnimatedImage from '../../components/AnimatedImage';
import AuthorBio from '../../components/AuthorBio';
import { formatPrice } from '../../utils/formatPrice';

const ProductPage = () => {
  const { slug } = useParams();
  const currentIndex = editions.findIndex(edition => edition.slug === slug);
  const product = editions[currentIndex];

  // Navegación entre libros
  const prevProduct = currentIndex > 0 ? editions[currentIndex - 1] : null;
  const nextProduct = currentIndex < editions.length - 1 ? editions[currentIndex + 1] : null;

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 font-neue-display">
        <p className="text-gray-400">Producto no encontrado</p>
        <Link href="/shop" className="text-sm text-gray-400 hover:text-white mt-4 inline-block">
          ← Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 font-neue-display">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/shop" className="text-sm text-gray-400 hover:text-white transition-colors">
          ← Volver a la tienda
        </Link>
      </div>

      <div className="flex flex-col md:flex-row bg-[#0B0B0B] rounded-lg p-6 gap-8">
        {/* Imagen del libro */}
        <div className="w-full md:w-1/2">
          {product.image && (
            <AnimatedImage 
              src={product.image} 
              alt={product.title} 
              width={500} 
              height={600}
              className="rounded-md drop-shadow-md border border-[#666666] border-opacity-20 object-contain w-full"
            />
          )}
        </div>
        
        {/* Información del libro */}
        <div className="w-full md:w-1/2">
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <h2 className="text-lg text-gray-400 mb-4">{product.author}</h2>
          <p className="text-2xl font-bold mb-6">{formatPrice(product.price)}</p>
          
          {/* Descripción / Reseña */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Sobre el libro</h3>
            <div className="text-sm leading-7 text-gray-300 whitespace-pre-line">{product.review}</div>
            <p className="text-sm italic mt-4 text-gray-500">— {product.reviewName}</p>
          </div>
          
          <AddToCartButton
            id={product.id}
            title={product.title}
            price={product.price}
            image={product.image}
          />
        </div>
      </div>

      {/* Bio del autor */}
      {product.authorBio && (
        <AuthorBio
          name={product.author}
          bio={product.authorBio}
          image={product.authorImage}
        />
      )}

      {/* Tracklist */}
      {(product as any).tracklist && (
        <div className="mt-12 bg-[#0B0B0B] rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Tracklist</h3>
          <div className="space-y-2">
            {((product as any).tracklist as Array<{ number: number; artist: string; title: string; duration: string }>).map((track) => (
              <div key={track.number} className="flex items-start gap-4 text-sm text-gray-300 border-b border-white/10 pb-2 last:border-0">
                <span className="text-gray-500 font-mono text-xs w-6 flex-shrink-0">{track.number}.</span>
                <div className="flex-1">
                  <div className="font-medium">{track.artist} - {track.title}</div>
                </div>
                <span className="text-gray-500 text-xs font-mono flex-shrink-0">{track.duration}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bandcamp Embed para DESPARRAMO V/A */}
      {product.id === "7" && (
        <div className="mt-8 flex justify-center">
          <iframe 
            style={{ border: 0, width: '350px', height: '470px' }} 
            src="https://bandcamp.com/EmbeddedPlayer/album=2883471037/size=large/bgcol=333333/linkcol=ffffff/tracklist=false/transparent=true/" 
            seamless
            title="DESPARRAMO V/A by El desenfreno"
          />
        </div>
      )}

      {/* Navegación entre libros */}
      <div className="mt-12 flex justify-between items-center">
        {/* Flecha Anterior */}
        {prevProduct ? (
          <Link
            href={`/product/${prevProduct.slug}`}
            className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
            <div className="hidden sm:block text-left">
              <p className="text-xs text-gray-500">Anterior</p>
              <p className="text-sm">{prevProduct.title}</p>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {/* Flecha Siguiente */}
        {nextProduct ? (
          <Link
            href={`/product/${nextProduct.slug}`}
            className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
          >
            <div className="hidden sm:block text-right">
              <p className="text-xs text-gray-500">Siguiente</p>
              <p className="text-sm">{nextProduct.title}</p>
            </div>
            <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default ProductPage;
