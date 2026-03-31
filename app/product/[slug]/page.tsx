'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import editions from '../../editions';
import AddToCartButton from '../../components/AddToCartButton';
import AnimatedImage from '../../components/AnimatedImage';
import AuthorBio from '../../components/AuthorBio';
import DesparramoBandcampEmbeds from '../../components/DesparramoBandcampEmbeds';
import RelatedProducts from '../../components/RelatedProducts';
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
      <div className="px-4 md:pl-2 md:pr-0 pt-4 pb-16 font-neue-display">
        <p className="text-gray-400">Producto no encontrado</p>
        <Link href="/shop" className="text-sm text-gray-400 hover:text-white mt-4 inline-block">
          ← Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 md:pl-2 md:pr-0 pt-4 pb-16 font-neue-display">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
        <span aria-hidden="true">/</span>
        <Link href="/shop" className="hover:text-white transition-colors">Tienda</Link>
        <span aria-hidden="true">/</span>
        <span className="text-gray-300 truncate max-w-[220px]" aria-current="page">{product.title}</span>
      </nav>

      <div className="flex flex-col md:flex-row bg-[#0B0B0B] rounded-lg py-4 pr-4">
        {/* Imagen del libro */}
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
          {product.image && (
            <AnimatedImage 
              src={product.image} 
              alt={product.title} 
              width={300} 
              height={400}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="rounded-md drop-shadow-md border border-[#666666] border-opacity-20 object-contain w-full"
            />
          )}
        </div>
        
        {/* Información del libro */}
        <div className="w-full md:w-2/3 md:pl-6">
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <h2 className="text-lg text-gray-400 mb-4">{product.author}</h2>
          <p className="text-2xl font-bold mb-6">{formatPrice(product.price)}</p>
          
          {/* Descripción / Reseña */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Sobre el libro</h3>
            <div
              className="text-sm leading-7 text-gray-300 whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: product.review }}
            />
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

      {product.id === "7" && (
        <DesparramoBandcampEmbeds className="mt-12" />
      )}

      {/* Productos relacionados */}
      <RelatedProducts currentSlug={product.slug} allEditions={editions} />

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
