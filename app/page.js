import React from "react";
import EdItem from "./components/EdItem";
import editions from "./editions";

export default function Home() {
  return (
    <div className="flex flex-col pt-2">
      <div className="flex flex-col md:flex-row rounded-md bg-[#0B0B0B] pt-2">
        {editions.map((edition, index) => (
          <div key={index} id={`${index}`}>
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
