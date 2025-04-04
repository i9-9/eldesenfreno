import React from "react";
import Image from "next/image";
import EdItem from "./components/EdItem";
import editions from "./editions";

export default function Home() {
  const reversedEditions = editions.slice().reverse();

  return (
    <div className="flex flex-col pt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-md bg-[#0B0B0B] pt-2">
        {/* First Book (Latest) - Custom Layout */}
        {reversedEditions.length > 0 && (
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 items-start rounded-md">
            {/* Image on the left */}
            <div className="m-2 font-neue-display">
              {reversedEditions[0].image && (
                <Image
                  src={reversedEditions[0].image}
                  alt={reversedEditions[0].title}
                  width={500}
                  height={600}
                  className="rounded-md mb-2 drop-shadow-md border border-[#666666] border-opacity-20 object-contain w-full"
                />
              )}
            </div>
            {/* EdItem for the content on the right */}
            <div className="m-2 font-neue-display">
              <EdItem
                id={reversedEditions[0].id}
                image={null}
                title={reversedEditions[0].title}
                author={reversedEditions[0].author}
                review={reversedEditions[0].review}
                reviewName={reversedEditions[0].reviewName}
                link={reversedEditions[0].link}
                price={reversedEditions[0].price}
              />
            </div>
          </div>
        )}

        {/* Remaining Books in Pairs */}
        {reversedEditions.slice(1).map((edition, index) => (
          <div key={index}>
            <EdItem
              id={edition.id}
              image={edition.image}
              title={edition.title}
              author={edition.author}
              review={edition.review}
              reviewName={edition.reviewName}
              link={edition.link}
              price={edition.price}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
