import React from "react";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from './AddToCartButton';
import { formatPrice } from '../utils/formatPrice';

interface ShopItemProps {
  id: string;
  image: string;
  title: string;
  author: string;
  review: string;
  reviewName: string;
  price: string;
  link: string;
}

const ShopItem = ({
  id,
  image,
  title,
  author,
  review,
  reviewName,
  price,
  link,
}: ShopItemProps) => {
  return (
    <div className="mb-8 p-4 bg-[#0B0B0B] rounded-lg">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 mb-4 md:mb-0">
          <Link href={`/product/${id}`}>
            <Image
              src={image}
              alt={title}
              width={300}
              height={400}
              className="rounded-md mb-2 drop-shadow-md border border-[#666666] border-opacity-20 object-contain w-full"
            />
          </Link>
        </div>
        <div className="md:w-2/3 md:pl-6">
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <h3 className="text-md mb-2">{author}</h3>
          <p className="text-lg font-bold mb-4">{formatPrice(price)}</p>
          <p className="text-sm mb-4 line-clamp-3">{review}</p>
          <div className="flex space-x-3">
            <Link href={`/product/${id}`}>
              <button className="p-2 bg-[#121212] text-white hover:bg-gray-400 transition-all 
              duration-700 drop-shadow opacity-80 text-xs rounded-md">
                Ver detalles
              </button>
            </Link>
            <AddToCartButton id={id} title={title} price={price} image={image} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopItem;
