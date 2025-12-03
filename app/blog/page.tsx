'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PostItem from '../components/PostItem';

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
      <h5 className='text-sm mb-2 font-light'>Novedades de El Desenfreno: lanzamientos, columnas y escritos ocasionales</h5> 
      
      {isLoading ? (
        <div className="py-8 text-center">
          <p className="text-gray-400">Cargando entradas...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-400">No hay entradas en el blog todavía.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.id}>
              <PostItem
                image={post.image}
                title={post.title}
                subtitle={post.subtitle}
                date={formatDate(post.createdAt)}
                author={post.author}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
