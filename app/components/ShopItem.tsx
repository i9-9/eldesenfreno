import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ShopItemProps {
  image: string;
  title: string;
  author: string;
  review: string;
  reviewName: string;
  price: string;
  link: string;
}

const ShopItem = ({
  image,
  title,
  author,
  review,
  reviewName,
  price,
  link,
}: ShopItemProps) => {
  return (
    <div className="flex flex-col lg:flex-row mb-4 shadow-sm">
      <Image
        src={image}
        alt={title}
        width={400}
        height={300}
        className="rounded-md w-full lg:w-[200px] mb-4 lg:mb-0"
      />
      <div className="flex flex-col justify-between px-4 md:pt-2">
        <div className="flex flex-col">
          <h4 className="font-semibold">{title}</h4>
          <h5 className="text-xs mb-2 font-semibold">{author}</h5>
          <p className="text-xs mb-4 leading-4 tracking-wide max-w-[600px]">
            {review}
          </p>
          <p className="text-xs italic mb-4">{reviewName}</p>
        </div>
        <div className="flex flex-col w-full mt-4">   
          <Link href={link}>
            <button className="w-full p-2 bg-[#2c2c2c] hover:bg-gray-400 transition-all duration-700 drop-shadow opacity-80 text-xs rounded-md">
              Comprar
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopItem;
