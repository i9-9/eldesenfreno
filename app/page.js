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
            <div className="rounded-md overflow-hidden max-w-[500px] w-full">
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
            <div className="px-2 w-full max-w-[500px]">
              <EdItem
                image={null} // Ensures the image isn't rendered again inside EdItem
                title={reversedEditions[0].title}
                author={reversedEditions[0].author}
                review={reversedEditions[0].review}
                reviewName={reversedEditions[0].reviewName}
                link={reversedEditions[0].link}
              />
            </div>
          </div>
        )}

        {/* Remaining Books in Pairs */}
        {reversedEditions.slice(1).map((edition, index) => (
          <div key={index} className="rounded-md overflow-hidden max-w-[500px] w-full">
            <EdItem
              image={edition.image}
              title={edition.title}
              author={edition.author}
              review={edition.review}
              reviewName={edition.reviewName}
              link={edition.link}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
