'use client'

import { useState } from 'react';
import Link from 'next/link';

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState('email');
  const [emailCampaign, setEmailCampaign] = useState({
    subject: '',
    content: '',
    sendTo: 'all'
  });
  const [socialPost, setSocialPost] = useState({
    content: '',
    platforms: {
      instagram: true,
      facebook: true,
      twitter: false
    },
    image: null
  });
  const [seoSettings, setSeoSettings] = useState({
    title: 'El Desenfreno Ediciones - Literatura y Poesía',
    description: 'Editorial independiente especializada en poesía contemporánea y literatura.',
    keywords: 'editorial, literatura, poesía, libros, argentina'
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleEmailCampaignChange = (e) => {
    const { name, value } = e.target;
    setEmailCampaign(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialPostChange = (e) => {
    const { name, value } = e.target;
    setSocialPost(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialPlatformChange = (platform) => {
    setSocialPost(prev => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: !prev.platforms[platform]
      }
    }));
  };

  const handleSeoChange = (e) => {
    const { name, value } = e.target;
    setSeoSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleEmailCampaignSubmit = (e) => {
    e.preventDefault();
    alert('Campaña de email configurada (simulado)');
    console.log('Email campaign:', emailCampaign);
  };

  const handleSocialPostSubmit = (e) => {
    e.preventDefault();
    alert('Publicación en redes sociales programada (simulado)');
    console.log('Social post:', socialPost);
  };

  const handleSeoSubmit = (e) => {
    e.preventDefault();
    alert('Configuración SEO guardada (simulado)');
    console.log('SEO settings:', seoSettings);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Marketing</h1>
      <Link href="/admin" className="text-blue-500 hover:underline mb-4 inline-block">
        ← Volver al panel de administración
      </Link>

      <div className="mt-4">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`mr-1 py-2 px-4 text-center border-b-2 font-medium text-sm leading-5 ${
                activeTab === 'email'
                  ? 'border-blue-500 text-blue-600 focus:outline-none focus:text-blue-800 focus:border-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300'
              }`}
              onClick={() => handleTabChange('email')}
            >
              Campañas de Email
            </button>
            <button
              className={`mr-1 py-2 px-4 text-center border-b-2 font-medium text-sm leading-5 ${
                activeTab === 'social'
                  ? 'border-blue-500 text-blue-600 focus:outline-none focus:text-blue-800 focus:border-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300'
              }`}
              onClick={() => handleTabChange('social')}
            >
              Redes Sociales
            </button>
            <button
              className={`mr-1 py-2 px-4 text-center border-b-2 font-medium text-sm leading-5 ${
                activeTab === 'seo'
                  ? 'border-blue-500 text-blue-600 focus:outline-none focus:text-blue-800 focus:border-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300'
              }`}
              onClick={() => handleTabChange('seo')}
            >
              SEO
            </button>
          </nav>
        </div>

        <div className="mt-4">
          {activeTab === 'email' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Campañas de Email</h2>
              <p className="mb-4 text-gray-600">
                Configura y envía campañas de email a tus clientes. Puedes segmentar por tipo de cliente o enviar a todos.
              </p>

              <form onSubmit={handleEmailCampaignSubmit} className="max-w-2xl">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
                    Asunto
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="subject"
                    type="text"
                    name="subject"
                    value={emailCampaign.subject}
                    onChange={handleEmailCampaignChange}
                    placeholder="Asunto del email"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                    Contenido
                  </label>
                  <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="content"
                    name="content"
                    value={emailCampaign.content}
                    onChange={handleEmailCampaignChange}
                    placeholder="Contenido del email"
                    rows={6}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sendTo">
                    Enviar a
                  </label>
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="sendTo"
                    name="sendTo"
                    value={emailCampaign.sendTo}
                    onChange={handleEmailCampaignChange}
                  >
                    <option value="all">Todos los clientes</option>
                    <option value="recent">Clientes recientes (últimos 30 días)</option>
                    <option value="inactive">Clientes inactivos (&gt; 90 días sin comprar)</option>
                  </select>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    Programar campaña
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'social' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Redes Sociales</h2>
              <p className="mb-4 text-gray-600">
                Programa publicaciones para tus redes sociales. Puedes elegir en qué plataformas publicar.
              </p>

              <form onSubmit={handleSocialPostSubmit} className="max-w-2xl">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                    Contenido
                  </label>
                  <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="content"
                    name="content"
                    value={socialPost.content}
                    onChange={handleSocialPostChange}
                    placeholder="Texto de la publicación"
                    rows={4}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Plataformas
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-600"
                        checked={socialPost.platforms.instagram}
                        onChange={() => handleSocialPlatformChange('instagram')}
                      />
                      <span className="ml-2 text-gray-700">Instagram</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-600"
                        checked={socialPost.platforms.facebook}
                        onChange={() => handleSocialPlatformChange('facebook')}
                      />
                      <span className="ml-2 text-gray-700">Facebook</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-600"
                        checked={socialPost.platforms.twitter}
                        onChange={() => handleSocialPlatformChange('twitter')}
                      />
                      <span className="ml-2 text-gray-700">X (Twitter)</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    Programar publicación
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'seo' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">SEO</h2>
              <p className="mb-4 text-gray-600">
                Configura los metadatos SEO de tu tienda para mejorar tu visibilidad en los motores de búsqueda.
              </p>

              <form onSubmit={handleSeoSubmit} className="max-w-2xl">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                    Título de la página principal
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="title"
                    type="text"
                    name="title"
                    value={seoSettings.title}
                    onChange={handleSeoChange}
                    placeholder="Título de la página"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Recomendado: 50-60 caracteres. Actual: {seoSettings.title.length} caracteres.
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Meta descripción
                  </label>
                  <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="description"
                    name="description"
                    value={seoSettings.description}
                    onChange={handleSeoChange}
                    placeholder="Descripción de la página"
                    rows={3}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Recomendado: 150-160 caracteres. Actual: {seoSettings.description.length} caracteres.
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="keywords">
                    Palabras clave
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="keywords"
                    type="text"
                    name="keywords"
                    value={seoSettings.keywords}
                    onChange={handleSeoChange}
                    placeholder="Palabras clave separadas por comas"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Separadas por comas, no abusar de palabras clave.
                  </p>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    Guardar configuración
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 