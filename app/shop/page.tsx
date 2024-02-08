import React from 'react'
import editions from '../editions'
import ShopItem from '../components/ShopItem'

const Shop = () => {
  return (
    <div className="flex flex-col font-neue-display mr-4 ml-2">
      <h3 className="-tracking-wide text-xl mb-2">TIENDA</h3>
      <div className="flex flex-col">
        {editions.map((edition, index) => (
          <div key={index} id={`${index}`}>
            <ShopItem
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