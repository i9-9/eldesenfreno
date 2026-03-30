import Image from 'next/image';
import Link from 'next/link';
import {
  BLOG_SECTIONS,
  SECTION_CARD_IMAGES,
  SECTION_LABELS,
} from '@/app/lib/blogSections';

export default function BlogSectionHero() {
  return (
    <section className="mb-12" aria-label="Secciones del blog">
      <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-500">
        Secciones
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {BLOG_SECTIONS.map((id) => (
          <Link
            key={id}
            href={`/blog/seccion/${id}`}
            className="group relative block aspect-[4/3] overflow-hidden rounded-xl border border-black/25 bg-[#141414] shadow-sm transition-all hover:border-black/45"
            aria-label={SECTION_LABELS[id]}
          >
            <Image
              src={SECTION_CARD_IMAGES[id]}
              alt=""
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, 33vw"
              priority={id === 'prensa'}
            />
            <div className="absolute inset-0 flex flex-col justify-center p-5 md:p-6">
              <span className="block w-full font-neue-haas-grotesk text-2xl font-bold leading-tight tracking-tight text-black md:text-[1.65rem]">
                {SECTION_LABELS[id]}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
