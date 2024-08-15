import React from 'react'
import authors from '../authors';
import AuthorItem from '../components/AuthorItem';

const Authors = () => {
  return (
    <div className='flex flex-col font-neue-display'>
      <h1 className='mx-2 text-md leading-5 mb-2'>Autorxs</h1>
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