import React from 'react';
import Link from 'next/link';
import PostItem from '../components/PostItem';
import BlogSectionHero from '../components/BlogSectionHero';
import { SECTION_LABELS } from '../lib/blogSections';
import { getPostsSorted } from '../lib/contentful';

const POSTS_PER_PAGE = 9;

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const revalidate = 60;

export default async function Blog({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || '1', 10));

  const allPosts = await getPostsSorted();
  const posts = allPosts.filter((p) => p.published);
  const tags = [...new Set(posts.flatMap((p) => p.tags))].sort();

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const safePage = Math.min(currentPage, Math.max(1, totalPages));
  const paginatedPosts = posts.slice(
    (safePage - 1) * POSTS_PER_PAGE,
    safePage * POSTS_PER_PAGE,
  );

  return (
    <div className="flex flex-col font-neue-display px-4 md:pl-2 md:pr-0 pt-4 pb-16">
      <BlogSectionHero />

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

      {/* Heading con conteo */}
      <div className="mb-6 flex items-baseline justify-between">
        <h2
          id="entradas"
          className="text-lg font-semibold tracking-tight text-white/90"
        >
          Todas las entradas
        </h2>
        {totalPages > 1 && (
          <span className="text-xs text-gray-500">
            {(safePage - 1) * POSTS_PER_PAGE + 1}–
            {Math.min(safePage * POSTS_PER_PAGE, posts.length)} de {posts.length}
          </span>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-gray-500">No hay entradas en el blog todavía.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {paginatedPosts.map((post) => (
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

          {/* Paginación */}
          {totalPages > 1 && (
            <nav
              aria-label="Paginación del blog"
              className="mt-12 flex items-center justify-center gap-2"
            >
              {/* Anterior */}
              {safePage > 1 ? (
                <Link
                  href={`/blog?page=${safePage - 1}`}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs border border-white/10 rounded-md text-gray-400 hover:text-white hover:border-white/30 transition-all"
                >
                  <span>←</span>
                  <span>Anterior</span>
                </Link>
              ) : (
                <span className="flex items-center gap-1.5 px-4 py-2 text-xs border border-white/5 rounded-md text-gray-600 cursor-not-allowed select-none">
                  <span>←</span>
                  <span>Anterior</span>
                </span>
              )}

              {/* Números de página */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const isCurrentPage = p === safePage;
                  const isNear = Math.abs(p - safePage) <= 1 || p === 1 || p === totalPages;

                  if (!isNear) {
                    const isEllipsis =
                      (p === safePage - 2 && safePage > 3) ||
                      (p === safePage + 2 && safePage < totalPages - 2);
                    return isEllipsis ? (
                      <span key={p} className="px-1 text-xs text-gray-600 select-none">
                        …
                      </span>
                    ) : null;
                  }

                  return (
                    <Link
                      key={p}
                      href={`/blog?page=${p}`}
                      aria-current={isCurrentPage ? 'page' : undefined}
                      className={`w-8 h-8 flex items-center justify-center text-xs rounded-md transition-all ${
                        isCurrentPage
                          ? 'bg-white text-black font-medium'
                          : 'border border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                      }`}
                    >
                      {p}
                    </Link>
                  );
                })}
              </div>

              {/* Siguiente */}
              {safePage < totalPages ? (
                <Link
                  href={`/blog?page=${safePage + 1}`}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs border border-white/10 rounded-md text-gray-400 hover:text-white hover:border-white/30 transition-all"
                >
                  <span>Siguiente</span>
                  <span>→</span>
                </Link>
              ) : (
                <span className="flex items-center gap-1.5 px-4 py-2 text-xs border border-white/5 rounded-md text-gray-600 cursor-not-allowed select-none">
                  <span>Siguiente</span>
                  <span>→</span>
                </span>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
