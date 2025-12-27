import React from 'react';
import Link from 'next/link';
import PostItem from '@/app/components/PostItem';
import { getPostsByTag, getAllTags } from '@/app/lib/contentful';

export const revalidate = 60;

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({
    tag: encodeURIComponent(tag),
  }));
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const allPosts = await getPostsByTag(decodedTag);
  const posts = allPosts.filter(p => p.published);
  const allTags = await getAllTags();

  return (
    <div className='flex flex-col font-neue-display px-4 md:px-0 pt-4 pb-16'>
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span>Blog</span>
        </Link>
      </nav>
      
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl font-bold tracking-tight">#{decodedTag}</span>
        </div>
        <p className='text-gray-400 text-sm'>
          {posts.length} {posts.length === 1 ? 'entrada' : 'entradas'} con este tag
        </p>
      </header>

      {/* Otros tags */}
      {allTags.length > 1 && (
        <nav className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Link 
              href="/blog"
              className="text-xs px-4 py-1.5 bg-[#1a1a1a] border border-white/10 rounded-full text-gray-400 hover:text-white hover:border-white/30 transition-all"
            >
              Todos
            </Link>
            {allTags.map((t) => (
              <Link 
                key={t} 
                href={`/blog/tag/${encodeURIComponent(t)}`}
                className={`text-xs px-4 py-1.5 rounded-full font-medium transition-all ${
                  t === decodedTag 
                    ? 'bg-white text-black' 
                    : 'bg-[#1a1a1a] border border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                }`}
              >
                {t}
              </Link>
            ))}
          </div>
        </nav>
      )}

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-gray-500 mb-4">No hay entradas con este tag.</p>
          <Link 
            href="/blog"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Ver todas las entradas
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="relative">
              {post.featured && (
                <span className="absolute top-6 left-4 z-10 text-[10px] px-2.5 py-1 bg-white text-black rounded-full font-medium shadow-lg">
                  ★ Destacado
                </span>
              )}
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
}
