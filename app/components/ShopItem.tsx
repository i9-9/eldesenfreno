import React from "react";
import Image from "next/image";

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
    <div className="flex flex-col lg:flex-row mb-4">
      <Image
        src={image}
        alt={title}
        width={200}
        height={300}
        className="rounded-md mr-4 w-[400px] lg:w-[200px]"
      />
      <div className="flex flex-col justify-between">
        <div className="flex flex-col">
          <h4 className=" font-semibold">{title}</h4>
          <h5 className=" text-xs mb-2 font-semibold">{author}</h5>
          <p className="text-xs mb-4 leading-4 tracking-wide  max-w-[600px]">
            {review}
          </p>
          <p className="text-xs italic mb-4">{reviewName}</p>
        </div>
        <div className="flex flex-col w-20">   
          <button className="p-2 bg-[#121212] hover:text-[#121212] hover:bg-gray-400 transition-all duration-700 drop-shadow	opacity-80 text-xs mr-2 rounded-md hover:text">
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopItem;
