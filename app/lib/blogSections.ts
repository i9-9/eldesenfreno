/** Secciones del blog (campo `section` en Contentful, short text) */
export type BlogSection = 'prensa' | 'eventos' | 'multimedia';

export const BLOG_SECTIONS: BlogSection[] = ['prensa', 'eventos', 'multimedia'];

export const SECTION_LABELS: Record<BlogSection, string> = {
  prensa: 'Prensa',
  eventos: 'Eventos',
  multimedia: 'Multimedia',
};

export function normalizeBlogSection(raw: unknown): BlogSection {
  const s = String(raw ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  if (s === 'eventos' || s === 'multimedia' || s === 'prensa') return s;
  return 'prensa';
}

export function isBlogSectionId(s: string): s is BlogSection {
  return s === 'prensa' || s === 'eventos' || s === 'multimedia';
}

/** Imágenes en /public/secciones/ — mismo nombre que el id de sección */
export const SECTION_CARD_IMAGES: Record<BlogSection, string> = {
  prensa: '/secciones/prensa.jpg',
  eventos: '/secciones/eventos.jpg',
  multimedia: '/secciones/multimedia.jpg',
};
