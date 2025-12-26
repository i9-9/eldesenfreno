import { NextRequest, NextResponse } from 'next/server';
import { getPostBySlug, getPostById, updatePost, deletePost } from '@/app/lib/contentful';

// GET - Obtener un post por ID o slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Primero intentamos buscar por slug
    let post = await getPostBySlug(id);
    
    // Si no lo encuentra por slug, intentamos por ID
    if (!post) {
      post = await getPostById(id);
    }
    
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updatedPost = await updatePost(id, body);

    if (!updatedPost) {
      return NextResponse.json({ error: 'Post no encontrado o error al actualizar' }, { status: 404 });
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Error al actualizar el post' }, { status: 500 });
  }
}

// DELETE - Eliminar un post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const success = await deletePost(id);
    
    if (!success) {
      return NextResponse.json({ error: 'Post no encontrado o error al eliminar' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Post eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Error al eliminar el post' }, { status: 500 });
  }
}
