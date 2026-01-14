'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

interface AddToCartButtonProps {
  id: string;
  title: string;
  price: string;
  image: string | null;
}

const AddToCartButton = ({ id, title, price, image }: AddToCartButtonProps) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = () => {
    const cleanPrice = price.replace('$', '').trim();
    addToCart({ id, title, price: cleanPrice, image });
    showToast(`${title} añadido al carrito`, 'success');
  };

  return (
    <button 
      onClick={handleAddToCart}
      className="p-2 bg-[#333333] text-white hover:bg-gray-500 transition-all 
      duration-300 drop-shadow opacity-80 text-xs rounded-md border border-white border-opacity-20"
    >
      Añadir al carrito
    </button>
  );
};

export default AddToCartButton; 