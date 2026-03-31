import type { Metadata } from "next";
import type { ReactNode } from "react";
import editions from "../../editions";

type ProductLayoutProps = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

const toPlainText = (html: string) =>
  html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export async function generateMetadata({ params }: ProductLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const product = editions.find((edition) => edition.slug === slug);

  if (!product) {
    return {
      title: "Producto no encontrado",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description = `${product.title} de ${product.author}. ${toPlainText(product.review).slice(0, 140)}...`;
  const imageUrl = product.image || "/post-rounded.svg";
  const canonicalPath = `/product/${product.slug}`;

  return {
    title: `${product.title} - ${product.author}`,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      url: canonicalPath,
      title: product.title,
      description,
      images: [
        {
          url: imageUrl,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description,
      images: [imageUrl],
    },
  };
}

export default function ProductLayout({ children }: ProductLayoutProps) {
  return children;
}
