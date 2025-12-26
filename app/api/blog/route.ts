import { NextRequest, NextResponse } from 'next/server';
import { getPosts, createPost } from '@/app/lib/contentful';

// GET - Obtener todos los posts
export async function GET() {
  try {
    const posts = await getPosts();
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

    const newPost = await createPost({
      title,
      subtitle,
      content,
      author,
      image,
    });

    if (!newPost) {
      return NextResponse.json(
        { error: 'Error al crear el post en Contentful' },
        { status: 500 }
      );
    }

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Error al crear el post' }, { status: 500 });
  }
}
