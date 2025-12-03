'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Post {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  content: string;
  author: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blog');
      if (res.ok) {
        const data = await res.json();
        setPosts(data.filter((p: Post) => p.published));
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className='flex flex-col font-neue-display mx-2 md:mx-0'>
      <h3 className="-tracking-wide text-xl mt-2">BLOG</h3>
      <h5 className='text-sm mb-6 font-light'>
        Novedades de El Desenfreno: lanzamientos, columnas y escritos ocasionales
      </h5>
      
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Cargando entradas...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No hay entradas en el blog todavía.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.id}>
              <article className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-md mb-3">
                  <Image 
                    src={post.image} 
                    alt={post.title} 
                    width={400} 
                    height={300} 
                    className="object-cover w-full h-[200px] group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h2 className="text-lg font-medium group-hover:text-gray-300 transition-colors">
                  {post.title}
                </h2>
                {post.subtitle && (
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                    {post.subtitle}
                  </p>
                )}
                <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Image 
                      src='/post-rounded.svg' 
                      width={10} 
                      height={10} 
                      alt='Autor'
                    />
                    <span>{post.author}</span>
                  </div>
                  <span className="italic">{formatDate(post.createdAt)}</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
