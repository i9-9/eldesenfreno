'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import MarkdownContent from '@/app/components/MarkdownContent';
import AnimatedImage from '@/app/components/AnimatedImage';
import AuthorPhotoLightbox from '@/app/components/AuthorPhotoLightbox';
import GallerySliderModal from '@/app/components/GallerySliderModal';
import ShareBlogPost from '@/app/components/ShareBlogPost';
import {
  SECTION_LABELS,
  type BlogSection,
  isBlogSectionId,
} from '@/app/lib/blogSections';
import editions from '@/app/editions';

interface Post {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  content: string;
  author: string;
  authorImage: string | null;
  image: string;
  gallery: string[];
  tags: string[];
  featured: boolean;
  relatedBookId: string | null;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  section?: BlogSection;
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

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/blog/${params.slug}`, { cache: 'no-store' });
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


  // Obtener libro relacionado
  const relatedBook = post?.relatedBookId 
    ? editions.find(e => e.id === post.relatedBookId) 
    : null;

  const section: BlogSection =
    post?.section && isBlogSectionId(post.section) ? post.section : 'prensa';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-neue-display">
        <div className="animate-pulse text-gray-500">Cargando...</div>
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
          className="text-sm px-6 py-2.5 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors"
        >
          Volver al blog
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto font-neue-display px-4 md:px-0 pt-4 pb-16">
      {/* Breadcrumb */}
      <nav
        className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-500"
        aria-label="Migas de pan"
      >
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 transition-colors hover:text-white"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          Blog
        </Link>
        <span className="text-gray-600" aria-hidden>
          /
        </span>
        <Link
          href={`/blog/seccion/${section}`}
          className="transition-colors hover:text-white"
        >
          {SECTION_LABELS[section]}
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-10">
        {/* Tags y Featured */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {post.featured && (
            <span className="text-[10px] px-2.5 py-1 bg-white text-black rounded-full font-medium">
              ★ Destacado
            </span>
          )}
          {post.tags && post.tags.map((tag) => (
            <Link 
              key={tag} 
              href={`/blog/tag/${encodeURIComponent(tag)}`}
              className="text-[10px] px-2.5 py-1 bg-[#1a1a1a] border border-white/10 rounded-full text-gray-400 hover:text-white hover:border-white/30 transition-all"
            >
              {tag}
            </Link>
          ))}
        </div>

        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-[1.1] tracking-tight">
          {post.title}
        </h1>
        
        {/* Subtítulo */}
        {post.subtitle && (
          <p className="text-xl text-gray-400 mb-6 leading-relaxed">
            {post.subtitle}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          {post.authorImage && (
            <AuthorPhotoLightbox src={post.authorImage} alt={post.author} variant="lg" />
          )}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-gray-300 font-medium">{post.author}</span>
            <span className="text-gray-600" aria-hidden>
              ·
            </span>
            <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
          </div>
        </div>
      </header>

      {/* Imagen destacada (cuadrada: horizontal y cuadrado se recortan al centro con object-cover) */}
      {post.image && post.image !== '/post-1.jpg' && (
        <figure className="mb-10 -mx-4 md:mx-0">
          <div className="mx-auto max-w-2xl overflow-hidden rounded-none md:rounded-xl grayscale">
            <AnimatedImage
              src={post.image}
              alt={post.title}
              width={1200}
              height={1200}
              className="aspect-square w-full object-cover"
            />
          </div>
        </figure>
      )}

      {/* Contenido Markdown */}
      <div className="mb-12">
        <MarkdownContent 
          content={post.content} 
          className="prose-blog"
        />
      </div>

      {/* Galería: rejilla + modal slider al hacer clic */}
      {post.gallery && post.gallery.length > 0 && (
        <GallerySliderModal images={post.gallery} title={post.title} />
      )}

      {/* Libro relacionado */}
      {relatedBook && (
        <section className="mb-12">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Libro relacionado
          </h3>
          <Link
            href={`/product/${relatedBook.slug}`}
            className="flex gap-5 p-5 bg-[#111] rounded-xl border border-white/5 hover:border-white/20 transition-all group"
          >
            <div className="w-24 flex-shrink-0">
              <Image
                src={relatedBook.image}
                alt={relatedBook.title}
                width={96}
                height={140}
                className="rounded-md object-cover shadow-lg"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h4 className="font-semibold text-lg group-hover:text-gray-300 transition-colors">
                {relatedBook.title}
              </h4>
              <p className="text-sm text-gray-500 mb-2">{relatedBook.author}</p>
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors inline-flex items-center gap-1">
                Ver libro 
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </div>
          </Link>
        </section>
      )}

      <ShareBlogPost title={post.title} />

      {/* Footer */}
      <footer className="pt-8 border-t border-white/10">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Ver más entradas
        </Link>
      </footer>
    </article>
  );
}
