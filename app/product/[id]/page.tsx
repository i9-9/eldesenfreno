'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import editions from '../../editions';
import AddToCartButton from '../../components/AddToCartButton';
import AnimatedImage from '../../components/AnimatedImage';
import { formatPrice } from '../../utils/formatPrice';

const ProductPage = () => {
  const { id } = useParams();
  const currentIndex = editions.findIndex(edition => edition.id === id);
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
            <p className="text-sm leading-7 text-gray-300">{product.review}</p>
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

      {/* Sección del Autor */}
      {product.authorImage && product.authorBio && (
        <div className="mt-12 bg-[#1a1a1a] rounded-lg p-6 border border-white/10">
          <h3 className="text-lg font-semibold mb-6">Sobre el autor</h3>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Foto del autor */}
            <div className="flex-shrink-0">
              <AnimatedImage
                src={product.authorImage}
                alt={product.author}
                width={120}
                height={120}
                animationDelay={200}
                className="rounded-full object-cover w-[120px] h-[120px] border-2 border-white/20"
              />
            </div>
            
            {/* Bio del autor */}
            <div className="flex-1">
              <h4 className="text-xl font-medium mb-3">{product.author}</h4>
              <p className="text-sm leading-7 text-gray-400">{product.authorBio}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navegación entre libros */}
      <div className="mt-12 flex justify-between items-center">
        {/* Flecha Anterior */}
        {prevProduct ? (
          <Link 
            href={`/product/${prevProduct.id}`}
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
            href={`/product/${nextProduct.id}`}
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
