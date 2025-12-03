'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Post {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  content: string;
  author: string;
  image: string;
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
    image: '/post-1.jpg'
  });
  const router = useRouter();

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuth();
  }, []);

  // Cargar posts cuando esté autenticado
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
    
    try {
      const url = editingPost ? `/api/blog/${editingPost.id}` : '/api/blog';
      const method = editingPost ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
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
      image: post.image
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
      image: '/post-1.jpg'
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
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  // Pantalla de login
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-white">
            Administración del Blog
          </h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresá la contraseña"
                required
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm mb-4">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition-colors font-medium"
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
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            {showForm ? 'Cancelar' : '+ Nueva entrada'}
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-gray-900 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingPost ? 'Editar entrada' : 'Nueva entrada'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Título *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Subtítulo
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Autor *
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">
                URL de imagen
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/post-1.jpg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Contenido *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[300px]"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Podés usar saltos de línea para crear párrafos
              </p>
            </div>
            
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                {editingPost ? 'Guardar cambios' : 'Publicar entrada'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de posts */}
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="text-left p-4">Título</th>
              <th className="text-left p-4">Autor</th>
              <th className="text-left p-4">Fecha</th>
              <th className="text-right p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-400">
                  No hay entradas en el blog. ¡Creá la primera!
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{post.title}</p>
                      {post.subtitle && (
                        <p className="text-sm text-gray-400">{post.subtitle}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{post.author}</td>
                  <td className="p-4 text-gray-300">{formatDate(post.createdAt)}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 text-sm"
                      >
                        Ver
                      </a>
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
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

