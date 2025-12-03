import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const POSTS_FILE = path.join(process.cwd(), 'data', 'blog-posts.json');

// Asegurar que el directorio y archivo existan
function ensureDataFile() {
  const dir = path.dirname(POSTS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(POSTS_FILE)) {
    fs.writeFileSync(POSTS_FILE, JSON.stringify([], null, 2));
  }
}

function readPosts() {
  ensureDataFile();
  const data = fs.readFileSync(POSTS_FILE, 'utf-8');
  return JSON.parse(data);
}

function writePosts(posts: any[]) {
  ensureDataFile();
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
}

// GET - Obtener todos los posts
export async function GET() {
  try {
    const posts = readPosts();
    // Ordenar por fecha descendente
    posts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error reading posts:', error);
    return NextResponse.json({ error: 'Error al leer los posts' }, { status: 500 });
  }
}

// POST - Crear nuevo post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subtitle, content, author, image } = body;

    if (!title || !content || !author) {
      return NextResponse.json(
        { error: 'Título, contenido y autor son requeridos' },
        { status: 400 }
      );
    }

    const posts = readPosts();
    
    const newPost = {
      id: Date.now().toString(),
      slug: generateSlug(title),
      title,
      subtitle: subtitle || '',
      content,
      author,
      image: image || '/post-1.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: true
    };

    posts.push(newPost);
    writePosts(posts);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Error al crear el post' }, { status: 500 });
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
    .trim()
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-'); // Múltiples guiones a uno
}

