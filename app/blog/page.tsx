import React from 'react';
import Link from 'next/link';
import PostItem from '../components/PostItem';
import BlogSectionHero from '../components/BlogSectionHero';
import {
  BLOG_SECTIONS,
  SECTION_LABELS,
  type BlogSection,
} from '../lib/blogSections';
import { getPostsSorted, getAllTags } from '../lib/contentful';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const revalidate = 60;

export default async function Blog() {
  const allPosts = await getPostsSorted();
  const posts = allPosts.filter(p => p.published);
  const tags = await getAllTags();

  const sectionCounts = BLOG_SECTIONS.reduce(
    (acc, id) => {
      acc[id] = posts.filter((p) => p.section === id).length;
      return acc;
    },
    {} as Record<BlogSection, number>
  );

  return (
    <div className='flex flex-col font-neue-display px-4 md:px-0 pt-4 pb-16'>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Blog</h1>
        <p className='text-gray-400 text-sm max-w-lg'>
          Novedades de El Desenfreno: lanzamientos, columnas y escritos ocasionales
        </p>
      </header>

      <BlogSectionHero counts={sectionCounts} />

      {/* Tags */}
      {tags.length > 0 && (
        <nav className="mb-8" aria-label="Etiquetas">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-gray-500">
            Etiquetas
          </p>
          <div className="flex flex-wrap gap-2">
            <Link 
              href="/blog"
              className="text-xs px-4 py-1.5 bg-white text-black rounded-full font-medium transition-all"
            >
              Todos
            </Link>
            {tags.map((tag) => (
              <Link 
                key={tag} 
                href={`/blog/tag/${encodeURIComponent(tag)}`}
                className="text-xs px-4 py-1.5 bg-[#1a1a1a] border border-white/10 rounded-full text-gray-400 hover:text-white hover:border-white/30 hover:bg-[#252525] transition-all"
              >
                {tag}
              </Link>
            ))}
          </div>
        </nav>
      )}

      {/* Posts Grid */}
      <h2
        id="entradas"
        className="mb-6 text-lg font-semibold tracking-tight text-white/90"
      >
        Todas las entradas
      </h2>
      {posts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-gray-500">No hay entradas en el blog todavía.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="relative group">
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
                authorImage={post.authorImage}
                sectionLabel={SECTION_LABELS[post.section]}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
