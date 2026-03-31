import { createClient, Entry, EntrySkeletonType, Asset, ContentfulClientApi } from 'contentful';
import { createClient as createManagementClient } from 'contentful-management';
import { unstable_cache } from 'next/cache';
import type { BlogSection } from './blogSections';
import { normalizeBlogSection } from './blogSections';

// Cliente lazy - se inicializa solo cuando se usa
let _contentfulClient: ContentfulClientApi<undefined> | null = null;

function getContentfulClient() {
  if (!_contentfulClient) {
    if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
      throw new Error('Contentful environment variables are not configured');
    }
    _contentfulClient = createClient({
      space: process.env.CONTENTFUL_SPACE_ID,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
    });
  }
  return _contentfulClient;
}

// Cliente para escritura (Content Management API)
export const getManagementClient = () => {
  if (!process.env.CONTENTFUL_MANAGEMENT_TOKEN) {
    throw new Error('Contentful Management Token is not configured');
  }
  return createManagementClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
  });
};

// Tipos para el blog post
export interface BlogPostFields {
  title: string;
  slug: string;
  subtitle?: string;
  content: string;
  author?: string;
  authorImage?: Asset;
  image?: Asset;
  gallery?: Asset[];
  tags?: string[];
  featured?: boolean;
  relatedBookId?: string;
  published?: boolean;
  /** Short text: prensa | eventos | multimedia */
  section?: string;
}

export interface BlogPostSkeleton extends EntrySkeletonType {
  contentTypeId: 'blogPost';
  fields: BlogPostFields;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  content: string;
  author: string;
  authorImage: string | null;
  /** IDs de assets en Contentful (para editar desde el admin) */
  imageAssetId: string | null;
  authorImageAssetId: string | null;
  galleryAssetIds: string[];
  image: string;
  gallery: string[];
  tags: string[];
  featured: boolean;
  relatedBookId: string | null;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  section: BlogSection;
}

const LOCALE = 'en-US';

function getAssetIdFromField(field: unknown): string | null {
  if (!field || typeof field !== 'object') return null;
  const f = field as { sys?: { id?: string; type?: string; linkType?: string } };
  if (f.sys?.linkType === 'Asset' && f.sys.id) return f.sys.id;
  if (f.sys?.type === 'Asset' && f.sys.id) return f.sys.id;
  return null;
}

function getGalleryAssetIds(gallery: unknown): string[] {
  if (!Array.isArray(gallery)) return [];
  return gallery.map(getAssetIdFromField).filter(Boolean) as string[];
}

function assetLink(id: string) {
  return { sys: { type: 'Link' as const, linkType: 'Asset' as const, id } };
}

// Helper para obtener URL de asset
function getAssetUrl(asset: any): string | null {
  if (!asset || !asset.fields || !asset.fields.file) return null;
  return `https:${asset.fields.file.url}?fm=webp&q=85&w=1200`;
}

// Transformar entry de Contentful a nuestro tipo
export function transformEntry(entry: Entry<BlogPostSkeleton>): BlogPost {
  const fields = entry.fields;

  return {
    id: entry.sys.id,
    slug: String(fields.slug || ''),
    title: String(fields.title || ''),
    subtitle: String(fields.subtitle || ''),
    content: String(fields.content || ''),
    author: String(fields.author || 'El Desenfreno Ediciones'),
    authorImage: getAssetUrl(fields.authorImage),
    imageAssetId: getAssetIdFromField(fields.image),
    authorImageAssetId: getAssetIdFromField(fields.authorImage),
    galleryAssetIds: getGalleryAssetIds(fields.gallery),
    image: getAssetUrl(fields.image) || '/post-1.jpg',
    gallery: (fields.gallery || []).map((asset: any) => getAssetUrl(asset)).filter(Boolean) as string[],
    tags: Array.isArray(fields.tags) ? (fields.tags as string[]) : [],
    featured: Boolean(fields.featured),
    relatedBookId: fields.relatedBookId ? String(fields.relatedBookId) : null,
    createdAt: entry.sys.createdAt,
    updatedAt: entry.sys.updatedAt,
    published: Boolean(fields.published ?? true),
    section: normalizeBlogSection(fields.section),
  };
}

async function _getPosts(): Promise<BlogPost[]> {
  try {
    const client = getContentfulClient();
    const entries = await client.getEntries<BlogPostSkeleton>({
      content_type: 'blogPost',
      order: ['-sys.createdAt'],
      include: 2,
    });
    
    return entries.items.map(transformEntry);
  } catch (error) {
    console.error('Error fetching posts from Contentful:', error);
    return [];
  }
}

// Obtener todos los posts (con caché de 5 minutos; revalidable por tag)
export const getPosts = unstable_cache(_getPosts, ['contentful-posts'], {
  revalidate: 300,
  tags: ['contentful-posts'],
});

// Obtener posts destacados primero
export async function getPostsSorted(): Promise<BlogPost[]> {
  const posts = await getPosts();
  // Ordenar: destacados primero, luego por fecha
  return posts.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

/** Posts de una sección (tras ordenar; entradas sin campo en Contentful cuentan como Prensa) */
export async function getPostsSortedBySection(section: BlogSection): Promise<BlogPost[]> {
  const sorted = await getPostsSorted();
  return sorted.filter((p) => p.section === section);
}

// Obtener posts por tag
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  try {
    const client = getContentfulClient();
    const entries = await client.getEntries<BlogPostSkeleton>({
      content_type: 'blogPost',
      'fields.tags[in]': tag,
      order: ['-sys.createdAt'],
      include: 2,
    } as any);
    
    return entries.items.map(transformEntry);
  } catch (error) {
    console.error('Error fetching posts by tag from Contentful:', error);
    return [];
  }
}

// Obtener todos los tags únicos (solo entradas publicadas)
export async function getAllTags(): Promise<string[]> {
  const posts = (await getPosts()).filter((p) => p.published);
  const allTags = posts.flatMap((post) => post.tags);
  return [...new Set(allTags)].sort();
}

// Obtener un post por slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const client = getContentfulClient();
    const entries = await client.getEntries<BlogPostSkeleton>({
      content_type: 'blogPost',
      'fields.slug[match]': slug,
      limit: 1,
      include: 2,
    } as any);
    
    if (entries.items.length === 0) {
      return null;
    }
    
    return transformEntry(entries.items[0]);
  } catch (error) {
    console.error('Error fetching post from Contentful:', error);
    return null;
  }
}

// Obtener un post por ID
export async function getPostById(id: string): Promise<BlogPost | null> {
  try {
    const client = getContentfulClient();
    const entry = await client.getEntry<BlogPostSkeleton>(id, { include: 2 });
    return transformEntry(entry);
  } catch (error) {
    console.error('Error fetching post from Contentful:', error);
    return null;
  }
}

// Generar slug a partir del título
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export type CreateBlogPostInput = {
  title: string;
  subtitle?: string;
  content: string;
  author?: string;
  tags?: string[];
  featured?: boolean;
  relatedBookId?: string;
  published?: boolean;
  imageAssetId?: string | null;
  authorImageAssetId?: string | null;
  galleryAssetIds?: string[];
  section?: BlogSection;
};

// Crear un nuevo post (requiere Management API)
export async function createPost(data: CreateBlogPostInput): Promise<BlogPost | null> {
  try {
    const client = getManagementClient();
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || 'master');

    const fields: Record<string, { [loc: string]: unknown }> = {
      title: { [LOCALE]: data.title },
      slug: { [LOCALE]: generateSlug(data.title) },
      subtitle: { [LOCALE]: data.subtitle || '' },
      content: { [LOCALE]: data.content },
      author: { [LOCALE]: data.author || 'El Desenfreno Ediciones' },
      tags: { [LOCALE]: data.tags || [] },
      featured: { [LOCALE]: data.featured ?? false },
      relatedBookId: { [LOCALE]: data.relatedBookId || '' },
      published: { [LOCALE]: data.published ?? true },
      section: { [LOCALE]: normalizeBlogSection(data.section ?? 'prensa') },
    };

    if (data.imageAssetId?.trim()) {
      fields.image = { [LOCALE]: assetLink(data.imageAssetId.trim()) };
    }
    if (data.authorImageAssetId?.trim()) {
      fields.authorImage = { [LOCALE]: assetLink(data.authorImageAssetId.trim()) };
    }
    if (data.galleryAssetIds?.length) {
      const ids = data.galleryAssetIds.map((s) => s.trim()).filter(Boolean);
      if (ids.length) {
        fields.gallery = { [LOCALE]: ids.map(assetLink) };
      }
    }

    const entry = await environment.createEntry('blogPost', { fields });

    await entry.publish();

    return getPostById(entry.sys.id);
  } catch (error) {
    console.error('Error creating post in Contentful:', error);
    return null;
  }
}

export type UpdateBlogPostInput = Partial<{
  title: string;
  subtitle: string;
  content: string;
  author: string;
  tags: string[];
  featured: boolean;
  relatedBookId: string;
  published: boolean;
  imageAssetId: string | null;
  authorImageAssetId: string | null;
  galleryAssetIds: string[] | null;
  section: BlogSection;
}>;

// Actualizar un post existente
export async function updatePost(id: string, data: UpdateBlogPostInput): Promise<BlogPost | null> {
  try {
    const client = getManagementClient();
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || 'master');

    let entry = await environment.getEntry(id);

    if (data.title !== undefined) {
      entry.fields.title = { [LOCALE]: data.title };
      entry.fields.slug = { [LOCALE]: generateSlug(data.title) };
    }
    if (data.subtitle !== undefined) {
      entry.fields.subtitle = { [LOCALE]: data.subtitle };
    }
    if (data.content !== undefined) {
      entry.fields.content = { [LOCALE]: data.content };
    }
    if (data.author !== undefined) {
      entry.fields.author = { [LOCALE]: data.author };
    }
    if (data.tags !== undefined) {
      entry.fields.tags = { [LOCALE]: data.tags };
    }
    if (data.featured !== undefined) {
      entry.fields.featured = { [LOCALE]: data.featured };
    }
    if (data.relatedBookId !== undefined) {
      entry.fields.relatedBookId = { [LOCALE]: data.relatedBookId };
    }
    if (data.published !== undefined) {
      entry.fields.published = { [LOCALE]: data.published };
    }
    if (data.section !== undefined) {
      entry.fields.section = { [LOCALE]: normalizeBlogSection(data.section) };
    }
    if (data.imageAssetId !== undefined) {
      entry.fields.image = data.imageAssetId?.trim()
        ? { [LOCALE]: assetLink(data.imageAssetId.trim()) }
        : { [LOCALE]: null };
    }
    if (data.authorImageAssetId !== undefined) {
      entry.fields.authorImage = data.authorImageAssetId?.trim()
        ? { [LOCALE]: assetLink(data.authorImageAssetId.trim()) }
        : { [LOCALE]: null };
    }
    if (data.galleryAssetIds !== undefined) {
      const ids = (data.galleryAssetIds || []).map((s) => s.trim()).filter(Boolean);
      entry.fields.gallery = { [LOCALE]: ids.map(assetLink) };
    }

    entry = await entry.update();
    await entry.publish();

    return getPostById(id);
  } catch (error) {
    console.error('Error updating post in Contentful:', error);
    return null;
  }
}

// Eliminar un post
export async function deletePost(id: string): Promise<boolean> {
  try {
    const client = getManagementClient();
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || 'master');
    
    const entry = await environment.getEntry(id);
    
    // Primero despublicar si está publicado
    if (entry.isPublished()) {
      await entry.unpublish();
    }
    
    // Luego eliminar
    await entry.delete();
    
    return true;
  } catch (error) {
    console.error('Error deleting post from Contentful:', error);
    return false;
  }
}
