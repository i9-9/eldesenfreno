'use client';

import React, { useState, useEffect } from 'react';
import editions from '@/app/editions';

interface Post {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  content: string;
  author: string;
  authorImage: string | null;
  image: string;
  imageAssetId: string | null;
  authorImageAssetId: string | null;
  galleryAssetIds: string[];
  gallery: string[];
  tags: string[];
  featured: boolean;
  relatedBookId: string | null;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

export default function AdminBlogPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    author: '',
    tags: '',
    featured: false,
    published: true,
    relatedBookId: '',
    imageAssetId: '',
    authorImageAssetId: '',
    galleryAssetIds: '',
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/auth');
      if (res.ok) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        setIsAuthenticated(true);
        setPassword('');
      } else {
        setError('Contraseña incorrecta');
      }
    } catch (error) {
      setError('Error al iniciar sesión');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    setIsAuthenticated(false);
    setPosts([]);
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blog');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tags = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const galleryAssetIds = formData.galleryAssetIds
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title,
      subtitle: formData.subtitle,
      content: formData.content,
      author: formData.author,
      tags,
      featured: formData.featured,
      published: formData.published,
      relatedBookId: formData.relatedBookId,
      imageAssetId: formData.imageAssetId.trim() || null,
      authorImageAssetId: formData.authorImageAssetId.trim() || null,
      galleryAssetIds,
    };

    try {
      const url = editingPost ? `/api/blog/${editingPost.id}` : '/api/blog';
      const method = editingPost ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchPosts();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      subtitle: post.subtitle,
      content: post.content,
      author: post.author,
      tags: post.tags?.join(', ') ?? '',
      featured: post.featured ?? false,
      published: post.published ?? true,
      relatedBookId: post.relatedBookId ?? '',
      imageAssetId: post.imageAssetId ?? '',
      authorImageAssetId: post.authorImageAssetId ?? '',
      galleryAssetIds: post.galleryAssetIds?.join(', ') ?? '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que querés eliminar este post?')) return;
    
    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      content: '',
      author: '',
      tags: '',
      featured: false,
      published: true,
      relatedBookId: '',
      imageAssetId: '',
      authorImageAssetId: '',
      galleryAssetIds: '',
    });
    setEditingPost(null);
    setShowForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Pantalla de carga
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400">Cargando...</div>
      </div>
    );
  }

  // Pantalla de login
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-[#1a1a1a] border border-[#333333] p-8 rounded-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Administración del Blog
          </h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-400">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-[#0b0b0b] border border-[#333333] rounded-md text-white focus:outline-none focus:border-white transition-colors"
                placeholder="Ingresá la contraseña"
                required
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm mb-4">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-[#2C2C2C] hover:bg-gray-600 text-white py-3 rounded-md transition-colors font-medium border border-[#333333]"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Panel de administración
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Gestión del Blog</h1>
        <div className="flex gap-4">
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="bg-[#2C2C2C] hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors text-sm border border-[#333333]"
          >
            {showForm ? 'Cancelar' : '+ Nueva entrada'}
          </button>
          <button
            onClick={handleLogout}
            className="bg-[#1a1a1a] hover:bg-[#2C2C2C] text-gray-400 hover:text-white px-4 py-2 rounded-md transition-colors text-sm border border-[#333333]"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-[#1a1a1a] border border-[#333333] p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingPost ? 'Editar entrada' : 'Nueva entrada'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">
                Título *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 bg-[#0b0b0b] border border-[#333333] rounded-md text-white focus:outline-none focus:border-white transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">
                Subtítulo
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full p-3 bg-[#0b0b0b] border border-[#333333] rounded-md text-white focus:outline-none focus:border-white transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">
                Autor *
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full p-3 bg-[#0b0b0b] border border-[#333333] rounded-md text-white focus:outline-none focus:border-white transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">
                Tags (separados por coma)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full p-3 bg-[#0b0b0b] border border-[#333333] rounded-md text-white focus:outline-none focus:border-white transition-colors"
                placeholder="poesía, novedades"
              />
            </div>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-[#333333] bg-[#0b0b0b]"
                />
                Destacado
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="rounded border-[#333333] bg-[#0b0b0b]"
                />
                Publicado
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">
                Libro relacionado (opcional)
              </label>
              <select
                value={formData.relatedBookId}
                onChange={(e) => setFormData({ ...formData, relatedBookId: e.target.value })}
                className="w-full p-3 bg-[#0b0b0b] border border-[#333333] rounded-md text-white focus:outline-none focus:border-white transition-colors"
              >
                <option value="">Ninguno</option>
                {editions.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">
                Imagen destacada — ID del asset (Contentful)
              </label>
              <input
                type="text"
                value={formData.imageAssetId}
                onChange={(e) => setFormData({ ...formData, imageAssetId: e.target.value })}
                className="w-full p-3 bg-[#0b0b0b] border border-[#333333] rounded-md text-white font-mono text-sm focus:outline-none focus:border-white transition-colors"
                placeholder="ej. 4vST0..."
              />
              <p className="text-xs text-gray-500 mt-1">
                En Contentful: Media → elegí la imagen → el ID aparece en la URL o en el panel del asset.
                Dejá vacío para quitar la imagen al editar.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">
                Foto del autor — ID del asset (Contentful)
              </label>
              <input
                type="text"
                value={formData.authorImageAssetId}
                onChange={(e) => setFormData({ ...formData, authorImageAssetId: e.target.value })}
                className="w-full p-3 bg-[#0b0b0b] border border-[#333333] rounded-md text-white font-mono text-sm focus:outline-none focus:border-white transition-colors"
                placeholder="ej. 7kLm2..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">
                Galería — IDs de assets separados por coma
              </label>
              <input
                type="text"
                value={formData.galleryAssetIds}
                onChange={(e) => setFormData({ ...formData, galleryAssetIds: e.target.value })}
                className="w-full p-3 bg-[#0b0b0b] border border-[#333333] rounded-md text-white font-mono text-sm focus:outline-none focus:border-white transition-colors"
                placeholder="id1, id2, id3"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">
                Contenido * (Markdown)
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full p-3 bg-[#0b0b0b] border border-[#333333] rounded-md text-white focus:outline-none focus:border-white transition-colors min-h-[300px] font-mono text-sm"
                required
                placeholder="# Título&#10;&#10;Texto normal con **negrita** y *cursiva*.&#10;&#10;## Subtítulo&#10;&#10;- Lista item 1&#10;- Lista item 2&#10;&#10;> Cita o blockquote&#10;&#10;[Link](https://ejemplo.com)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Soporta Markdown: **negrita**, *cursiva*, # títulos, - listas, {'>'} citas, [links](url), `código`
              </p>
            </div>
            
            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                className="bg-[#2C2C2C] hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors border border-[#333333]"
              >
                {editingPost ? 'Guardar cambios' : 'Publicar entrada'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-[#1a1a1a] hover:bg-[#2C2C2C] text-gray-400 hover:text-white px-6 py-2 rounded-md transition-colors border border-[#333333]"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de posts */}
      <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0b0b0b] border-b border-[#333333]">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Título</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Autor</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Fecha</th>
              <th className="text-right p-4 text-sm font-medium text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No hay entradas en el blog. ¡Creá la primera!
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-t border-[#333333] hover:bg-[#0b0b0b]/50 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{post.title}</p>
                      {post.subtitle && (
                        <p className="text-sm text-gray-500">{post.subtitle}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-gray-400">{post.author}</td>
                  <td className="p-4 text-gray-400">{formatDate(post.createdAt)}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-3">
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white text-sm transition-colors"
                      >
                        Ver
                      </a>
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-gray-400 hover:text-white text-sm transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-gray-400 hover:text-red-400 text-sm transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
