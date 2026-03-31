import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';
import { formatPrice } from '../utils/formatPrice';

interface Edition {
  id: string;
  slug: string;
  image: string;
  title: string;
  author: string;
  price: string;
}

interface RelatedProductsProps {
  currentSlug: string;
  allEditions: Edition[];
}

const RelatedProducts = ({ currentSlug, allEditions }: RelatedProductsProps) => {
  // Toma hasta 3 ediciones (excluyendo la actual), ordenadas de más reciente a más antigua
  const related = allEditions
    .slice()
    .reverse()
    .filter((e) => e.slug !== currentSlug)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-16" aria-labelledby="related-heading">
      <div className="flex items-baseline justify-between mb-6">
        <h2
          id="related-heading"
          className="text-sm font-medium uppercase tracking-wider text-gray-500"
        >
          Otros títulos
        </h2>
        <Link
          href="/shop"
          className="text-xs text-gray-500 hover:text-white transition-colors"
        >
          Ver catálogo completo →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {related.map((edition) => (
          <div
            key={edition.id}
            className="group bg-[#0B0B0B] rounded-lg p-4 flex gap-4 hover:bg-[#111] transition-colors"
          >
            {/* Portada */}
            <Link
              href={`/product/${edition.slug}`}
              className="flex-shrink-0 w-16 h-20 relative overflow-hidden rounded"
              tabIndex={-1}
              aria-hidden="true"
            >
              <Image
                src={edition.image}
                alt={edition.title}
                fill
                sizes="64px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>

            {/* Info */}
            <div className="flex flex-col justify-between flex-1 min-w-0">
              <div>
                <Link href={`/product/${edition.slug}`}>
                  <h3 className="text-sm font-semibold leading-snug line-clamp-2 hover:text-gray-300 transition-colors">
                    {edition.title}
                  </h3>
                </Link>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{edition.author}</p>
              </div>

              <div className="flex items-center justify-between mt-3 gap-2">
                <span className="text-sm font-bold">{formatPrice(edition.price)}</span>
                <AddToCartButton
                  id={edition.id}
                  title={edition.title}
                  price={edition.price}
                  image={edition.image}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
