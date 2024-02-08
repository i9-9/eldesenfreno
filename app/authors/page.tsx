import React from 'react'
import authors from '../authors';
import AuthorItem from '../components/AuthorItem';

const Authors = () => {
  return (
    <div className='flex flex-col'>
      <h1 className='uppercase mx-2 text-xl'>Autorxs</h1>
          {authors.map((author, index) => (
            <div key={index} id={`${index}`}>
              <AuthorItem 
                image={author.image}
                author={author.author}
                description={author.description}
                link={author.link}
              />
            </div>
          ))}
    </div>
  )
}

export default Authors