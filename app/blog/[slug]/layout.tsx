import type { Metadata } from 'next';
import { getPostBySlug } from '@/app/lib/contentful';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.published) {
    return {
      title: 'Entrada | El Desenfreno Ediciones',
      robots: { index: false, follow: true },
    };
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? '';
  const canonical = base ? `${base}/blog/${slug}` : undefined;
  const description =
    post.subtitle?.trim() || 'Artículo en el blog de El Desenfreno Ediciones.';

  const absoluteImage = (() => {
    if (!post.image || post.image === '/post-1.jpg') {
      return base ? `${base}/post-1.jpg` : undefined;
    }
    if (post.image.startsWith('http')) return post.image;
    return base ? `${base}${post.image}` : undefined;
  })();

  return {
    title: `${post.title} | El Desenfreno`,
    description,
    ...(canonical && { alternates: { canonical } }),
    openGraph: {
      title: post.title,
      description,
      url: canonical,
      siteName: 'El Desenfreno Ediciones',
      locale: 'es_AR',
      type: 'article',
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      ...(absoluteImage && {
        images: [
          {
            url: absoluteImage,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      ...(absoluteImage && { images: [absoluteImage] }),
    },
  };
}

export default function BlogPostSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
