'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

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

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (params.slug) {
      fetchPost();
    }
  }, [params.slug]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/blog/${params.slug}`);
      if (res.ok) {
        const data = await res.json();
        setPost(data);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setNotFound(true);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-neue-display">
        <p className="text-gray-400">Cargando...</p>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] font-neue-display">
        <h1 className="text-2xl font-bold mb-4">Entrada no encontrada</h1>
        <p className="text-gray-400 mb-6">La entrada que buscás no existe o fue eliminada.</p>
        <Link 
          href="/blog" 
          className="bg-[#2C2C2C] hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors"
        >
          Volver al blog
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto font-neue-display px-4 md:px-0">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">
          ← Volver al blog
        </Link>
      </div>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
          {post.title}
        </h1>
        {post.subtitle && (
          <p className="text-lg text-gray-400 mb-4">
            {post.subtitle}
          </p>
        )}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Image 
              src='/post-rounded.svg' 
              width={12} 
              height={12} 
              alt='Autor'
            />
            <span>{post.author}</span>
          </div>
          <span>•</span>
          <span className="italic">{formatDate(post.createdAt)}</span>
        </div>
      </header>

      {/* Imagen destacada */}
      <div className="mb-8 rounded-lg overflow-hidden">
        <Image 
          src={post.image} 
          alt={post.title} 
          width={800} 
          height={450} 
          className="w-full object-cover"
        />
      </div>

      {/* Contenido */}
      <div className="prose prose-invert prose-lg max-w-none">
        {post.content.split('\n').map((paragraph, index) => (
          paragraph.trim() && (
            <p key={index} className="mb-4 text-gray-200 leading-relaxed">
              {paragraph}
            </p>
          )
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-gray-800">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          ← Ver más entradas del blog
        </Link>
      </footer>
    </article>
  );
}

