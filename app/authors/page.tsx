import React from 'react';
import authors from '../authors';
import AuthorItem from '../components/AuthorItem';

const AuthorsPage = () => {
  return (
    <div className='flex flex-col font-neue-display mt-4'>
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
  );
}

export default AuthorsPage;
