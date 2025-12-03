import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const POSTS_FILE = path.join(process.cwd(), 'data', 'blog-posts.json');

function readPosts() {
  if (!fs.existsSync(POSTS_FILE)) {
    return [];
  }
  const data = fs.readFileSync(POSTS_FILE, 'utf-8');
  return JSON.parse(data);
}

function writePosts(posts: any[]) {
  const dir = path.dirname(POSTS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
}

// GET - Obtener un post por ID o slug
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const posts = readPosts();
    const post = posts.find((p: any) => p.id === params.id || p.slug === params.id);
    
    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error reading post:', error);
    return NextResponse.json({ error: 'Error al leer el post' }, { status: 500 });
  }
}

// PUT - Actualizar un post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const posts = readPosts();
    const index = posts.findIndex((p: any) => p.id === params.id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    const updatedPost = {
      ...posts[index],
      ...body,
      updatedAt: new Date().toISOString(),
      slug: body.title ? generateSlug(body.title) : posts[index].slug
    };

    posts[index] = updatedPost;
    writePosts(posts);

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Error al actualizar el post' }, { status: 500 });
  }
}

// DELETE - Eliminar un post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const posts = readPosts();
    const index = posts.findIndex((p: any) => p.id === params.id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    posts.splice(index, 1);
    writePosts(posts);

    return NextResponse.json({ message: 'Post eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Error al eliminar el post' }, { status: 500 });
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

