'use client';

import React, { useState } from 'react';

interface BuyButtonProps {
  title: string;
  price: string;
}

const BuyButton = ({ title, price }: BuyButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleBuy = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/mercadopago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          price: parseFloat(price.replace('$', '')),
          quantity: 1,
        }),
      });

      const data = await response.json();
      
      if (data.init_point) {
        window.location.href = data.init_point;
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleBuy}
      disabled={isLoading}
      className="p-2 bg-[#121212] text-white hover:bg-gray-400 transition-all 
      duration-300 drop-shadow opacity-80 text-xs mr-2 rounded-md"
    >
      {isLoading ? 'Processing...' : 'Comprar'}
    </button>
  );
};

export default BuyButton; 