import React, { useMemo } from 'react'
import editions from '../editions'
import ShopItem from '../components/ShopItem'

const Shop = () => {
  const reversedEditions = useMemo(() => editions.slice().reverse(), []);

  return (
    <div className="flex flex-col font-neue-display mr-4 ml-2">
      <div className="flex flex-col pt-4">
        {reversedEditions.map((edition, index) => (
          <div key={index} id={`${index}`}>
            <ShopItem
              id={edition.id}
              slug={edition.slug}
              image={edition.image}
              title={edition.title}
              author={edition.author}
              review={edition.review}
              reviewName={edition.reviewName}
              price={edition.price}
              link={edition.link}
            />
          </div>
        ))}
      </div>

    </div>
  )
}

export default Shop