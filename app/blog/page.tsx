import React from 'react'
import PostItem from '../components/PostItem'
import posts from '../posts'

const Blog = () => {
  return (
    <div className='flex flex-col font-neue-display mx-2 md:mx-0'>
      <h3 className="-tracking-wide text-xl mt-2">BLOG</h3>
      <h5 className='text-sm mb-2 font-light'>Novedades de El Desenfreno: lanzamientos, columnas y escritos ocasionales</h5> 
      <div className="grid grid-cols-1 md:grid-cols-3">
        {posts.map((post, index) => (
          <div key={index} id={`${index}`}>
            <PostItem
              image={post.image}
              title={post.title}
              subtitle={post.subtitle}
              date={post.date}
              author={post.author}
            />
          </div>
        ))}
      </div>

    </div>
  )
}

export default Blog