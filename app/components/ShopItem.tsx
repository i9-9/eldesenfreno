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
    <div className="flex mb-4">
      <Image
        src={image}
        alt={title}
        width={200}
        height={300}
        className="border border-white mr-4"
      />
      <div className="flex flex-col justify-between">
        <div className="flex flex-col">
          <h4 className="uppercase font-semibold">{title}</h4>
          <h5 className="uppercase text-xs mb-2 font-semibold">{author}</h5>
          <p className="text-xs mb-2 leading-4 tracking-wide  max-w-[600px]">
            {review}
          </p>
          <p className="text-xs italic mb-4">{reviewName}</p>
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-bold mb-2">{price}</p>
          <button className="border border-white p-2 text-xs w-16">
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopItem;
