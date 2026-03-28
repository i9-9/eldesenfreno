import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PostItem from '@/app/components/PostItem';
import BlogSectionNav from '@/app/components/BlogSectionNav';
import {
  BLOG_SECTIONS,
  SECTION_LABELS,
  isBlogSectionId,
  type BlogSection,
} from '@/app/lib/blogSections';
import { getAllTags, getPostsSortedBySection } from '@/app/lib/contentful';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const revalidate = 60;

export async function generateStaticParams() {
  return BLOG_SECTIONS.map((section) => ({ section }));
}

export default async function BlogSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: raw } = await params;
  if (!isBlogSectionId(raw)) {
    notFound();
  }
  const section = raw as BlogSection;

  const allPosts = await getPostsSortedBySection(section);
  const posts = allPosts.filter((p) => p.published);
  const tags = await getAllTags();

  return (
    <div className="flex flex-col px-4 pt-4 pb-16 font-neue-display md:px-0">
      <nav className="mb-6">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-white"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          <span>Blog</span>
        </Link>
      </nav>

      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">{SECTION_LABELS[section]}</h1>
        <p className="max-w-lg text-sm text-gray-400">
          Entradas de la sección {SECTION_LABELS[section].toLowerCase()}.
        </p>
      </header>

      <BlogSectionNav active={section} />

      {tags.length > 0 && (
        <nav className="mb-8" aria-label="Etiquetas">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-gray-500">
            Etiquetas
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/blog"
              className="rounded-full border border-white/10 bg-[#1a1a1a] px-4 py-1.5 text-xs text-gray-400 transition-all hover:border-white/30 hover:bg-[#252525] hover:text-white"
            >
              Todas
            </Link>
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${encodeURIComponent(tag)}`}
                className="rounded-full border border-white/10 bg-[#1a1a1a] px-4 py-1.5 text-xs text-gray-400 transition-all hover:border-white/30 hover:bg-[#252525] hover:text-white"
              >
                {tag}
              </Link>
            ))}
          </div>
        </nav>
      )}

      {posts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-gray-500">No hay entradas en esta sección todavía.</p>
          <Link
            href="/blog"
            className="mt-4 inline-block text-sm text-gray-400 transition-colors hover:text-white"
          >
            ← Ver todas las entradas
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="group relative">
              {post.featured && (
                <span className="absolute left-4 top-6 z-10 rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-black shadow-lg">
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
