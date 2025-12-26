import { createClient, Entry, EntrySkeletonType, Asset, ContentfulClientApi } from 'contentful';
import { createClient as createManagementClient } from 'contentful-management';

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
  image: string;
  gallery: string[];
  tags: string[];
  featured: boolean;
  relatedBookId: string | null;
  createdAt: string;
  updatedAt: string;
  published: boolean;
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
    image: getAssetUrl(fields.image) || '/post-1.jpg',
    gallery: (fields.gallery || []).map((asset: any) => getAssetUrl(asset)).filter(Boolean) as string[],
    tags: Array.isArray(fields.tags) ? (fields.tags as string[]) : [],
    featured: Boolean(fields.featured),
    relatedBookId: fields.relatedBookId ? String(fields.relatedBookId) : null,
    createdAt: entry.sys.createdAt,
    updatedAt: entry.sys.updatedAt,
    published: Boolean(fields.published ?? true),
  };
}

// Obtener todos los posts
export async function getPosts(): Promise<BlogPost[]> {
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

// Obtener todos los tags únicos
export async function getAllTags(): Promise<string[]> {
  const posts = await getPosts();
  const allTags = posts.flatMap(post => post.tags);
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

// Crear un nuevo post (requiere Management API)
export async function createPost(data: {
  title: string;
  subtitle?: string;
  content: string;
  author?: string;
  tags?: string[];
  featured?: boolean;
  relatedBookId?: string;
}): Promise<BlogPost | null> {
  try {
    const client = getManagementClient();
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || 'master');
    
    const entry = await environment.createEntry('blogPost', {
      fields: {
        title: { 'en-US': data.title },
        slug: { 'en-US': generateSlug(data.title) },
        subtitle: { 'en-US': data.subtitle || '' },
        content: { 'en-US': data.content },
        author: { 'en-US': data.author || 'El Desenfreno Ediciones' },
        tags: { 'en-US': data.tags || [] },
        featured: { 'en-US': data.featured || false },
        relatedBookId: { 'en-US': data.relatedBookId || '' },
        published: { 'en-US': true },
      },
    });
    
    // Publicar el entry
    await entry.publish();
    
    return {
      id: entry.sys.id,
      slug: generateSlug(data.title),
      title: data.title,
      subtitle: data.subtitle || '',
      content: data.content,
      author: data.author || 'El Desenfreno Ediciones',
      authorImage: null,
      image: '/post-1.jpg',
      gallery: [],
      tags: data.tags || [],
      featured: data.featured || false,
      relatedBookId: data.relatedBookId || null,
      createdAt: entry.sys.createdAt,
      updatedAt: entry.sys.updatedAt,
      published: true,
    };
  } catch (error) {
    console.error('Error creating post in Contentful:', error);
    return null;
  }
}

// Actualizar un post existente
export async function updatePost(id: string, data: Partial<{
  title: string;
  subtitle: string;
  content: string;
  author: string;
  tags: string[];
  featured: boolean;
  relatedBookId: string;
  published: boolean;
}>): Promise<BlogPost | null> {
  try {
    const client = getManagementClient();
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || 'master');
    
    let entry = await environment.getEntry(id);
    
    if (data.title !== undefined) {
      entry.fields.title = { 'en-US': data.title };
      entry.fields.slug = { 'en-US': generateSlug(data.title) };
    }
    if (data.subtitle !== undefined) {
      entry.fields.subtitle = { 'en-US': data.subtitle };
    }
    if (data.content !== undefined) {
      entry.fields.content = { 'en-US': data.content };
    }
    if (data.author !== undefined) {
      entry.fields.author = { 'en-US': data.author };
    }
    if (data.tags !== undefined) {
      entry.fields.tags = { 'en-US': data.tags };
    }
    if (data.featured !== undefined) {
      entry.fields.featured = { 'en-US': data.featured };
    }
    if (data.relatedBookId !== undefined) {
      entry.fields.relatedBookId = { 'en-US': data.relatedBookId };
    }
    if (data.published !== undefined) {
      entry.fields.published = { 'en-US': data.published };
    }
    
    entry = await entry.update();
    await entry.publish();
    
    // Obtener el post actualizado
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
