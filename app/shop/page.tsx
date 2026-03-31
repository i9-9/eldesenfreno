'use client';

import React, { useState, useMemo } from 'react';
import editions from '../editions';
import ShopItem from '../components/ShopItem';

type SortOption = 'default' | 'price-asc' | 'price-desc';

const Shop = () => {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortOption>('default');

  const filtered = useMemo(() => {
    let result = editions.slice().reverse();

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.author.toLowerCase().includes(q),
      );
    }

    if (sort === 'price-asc') {
      result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === 'price-desc') {
      result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
  }, [query, sort]);

  return (
    <div className="flex flex-col font-neue-display px-4 md:pl-2 md:pr-0 pt-4 pb-16">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="search"
            placeholder="Buscar por título o autor..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#121212] border border-white/10 rounded-md text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="px-3 py-2 bg-[#121212] border border-white/10 rounded-md text-xs text-gray-300 focus:outline-none focus:border-white/30 transition-colors cursor-pointer"
        >
          <option value="default">Más recientes</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-gray-500 text-sm">
          No se encontraron resultados para &ldquo;{query}&rdquo;.
        </div>
      ) : (
        <div className="flex flex-col">
          {filtered.map((edition, index) => (
            <div key={edition.id} id={`${index}`}>
              <ShopItem
                id={edition.id}
                slug={edition.slug}
                image={edition.image}
                title={edition.title}
                author={edition.author}
                review={edition.review}
                reviewName={edition.reviewName}
                price={edition.price}
                link={edition.link}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
