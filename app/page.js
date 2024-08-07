import React from "react";
import EdItem from "./components/EdItem";
import editions from "./editions";

export default function Home() {
  return (
    <div className="flex flex-col">
      <h3 className="font-neue-display ml-2 -tracking-wide">Index</h3>
      <div className="flex flex-col md:flex-row">
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
