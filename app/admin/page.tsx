import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-neue-display font-bold mb-4">Panel de Administración</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="border rounded p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-neue-display font-semibold mb-2">Clientes</h2>
          <p className="text-gray-600 mb-4">Gestiona la información de los clientes y visualiza su historial de compras.</p>
          <Link 
            href="/admin/customers" 
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Ver clientes
          </Link>
        </div>
        
        <div className="border rounded p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-neue-display font-semibold mb-2">Marketing</h2>
          <p className="text-gray-600 mb-4">Gestiona campañas de email, promociones y contenido SEO.</p>
          <Link 
            href="/admin/marketing" 
            className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Gestionar marketing
          </Link>
        </div>
        
        <div className="border rounded p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-neue-display font-semibold mb-2">Pedidos</h2>
          <p className="text-gray-600 mb-4">Revisa y gestiona todos los pedidos realizados en la tienda.</p>
          <Link 
            href="/admin/orders" 
            className="inline-block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
          >
            Ver pedidos
          </Link>
        </div>
        
        <div className="border rounded p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-neue-display font-semibold mb-2">Productos</h2>
          <p className="text-gray-600 mb-4">Administra el catálogo de productos de la tienda.</p>
          <Link 
            href="/admin/products" 
            className="inline-block bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
          >
            Gestionar productos
          </Link>
        </div>
        
        <div className="border rounded p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-neue-display font-semibold mb-2">SEO</h2>
          <p className="text-gray-600 mb-4">Optimiza el contenido del sitio para motores de búsqueda.</p>
          <Link 
            href="/admin/seo" 
            className="inline-block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Configurar SEO
          </Link>
        </div>
        
        <div className="border rounded p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-neue-display font-semibold mb-2">Configuración</h2>
          <p className="text-gray-600 mb-4">Configura los parámetros generales de la tienda.</p>
          <Link 
            href="/admin/settings" 
            className="inline-block bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Configurar tienda
          </Link>
        </div>
      </div>
      
      <div className="mt-8">
        <Link href="/" className="text-blue-500 hover:underline">
          ← Volver a la tienda
        </Link>
      </div>
    </div>
  );
} 