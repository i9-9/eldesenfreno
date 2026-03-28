import Link from 'next/link';
import {
  BLOG_SECTIONS,
  SECTION_LABELS,
  type BlogSection,
} from '@/app/lib/blogSections';

type Active = 'all' | BlogSection;

type Props = {
  active: Active;
};

export default function BlogSectionNav({ active }: Props) {
  return (
    <nav className="mb-6" aria-label="Secciones del blog">
      <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-gray-500">
        Sección
      </p>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/blog"
          className={`text-xs rounded-full px-4 py-1.5 font-medium transition-all ${
            active === 'all'
              ? 'bg-white text-black'
              : 'border border-white/10 bg-[#1a1a1a] text-gray-400 hover:border-white/30 hover:bg-[#252525] hover:text-white'
          }`}
        >
          Todas
        </Link>
        {BLOG_SECTIONS.map((id) => (
          <Link
            key={id}
            href={`/blog/seccion/${id}`}
            className={`text-xs rounded-full px-4 py-1.5 font-medium transition-all ${
              active === id
                ? 'bg-white text-black'
                : 'border border-white/10 bg-[#1a1a1a] text-gray-400 hover:border-white/30 hover:bg-[#252525] hover:text-white'
            }`}
          >
            {SECTION_LABELS[id]}
          </Link>
        ))}
      </div>
    </nav>
  );
}
