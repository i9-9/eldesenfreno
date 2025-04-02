'use client';

import React from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import editions from '../../editions';
import AddToCartButton from '../../components/AddToCartButton';

const ProductPage = () => {
  const { id } = useParams();
  const product = editions.find(edition => edition.id === id);

  if (!product) {
    return <div className="container mx-auto px-4 py-8">Producto no encontrado</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 font-neue-display">
      <div className="flex flex-col md:flex-row bg-[#0B0B0B] rounded-lg p-6">
        <div className="w-full md:w-1/2 mb-6 md:mb-0">
          {product.image && (
            <Image 
              src={product.image} 
              alt={product.title} 
              width={500} 
              height={600}
              className="rounded-md mb-2 drop-shadow-md border border-[#666666] border-opacity-20 object-contain w-full"
            />
          )}
        </div>
        
        <div className="w-full md:w-1/2 md:pl-8">
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <h2 className="text-lg mb-4">{product.author}</h2>
          <p className="text-2xl font-bold mb-6">${product.price}</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Descripción</h3>
            <p className="text-sm leading-6">{product.review}</p>
            <p className="text-sm italic mt-4">{product.reviewName}</p>
          </div>
          
          <AddToCartButton 
            id={product.id} 
            title={product.title} 
            price={product.price} 
            image={product.image} 
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPage; 