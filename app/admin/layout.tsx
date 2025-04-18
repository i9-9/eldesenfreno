import { ReactNode } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-xl font-bold">
              El Desenfreno Admin
            </Link>
          </div>
          <nav className="flex space-x-4">
            <Link href="/admin/customers" className="hover:text-blue-300">
              Clientes
            </Link>
            <Link href="/admin/marketing" className="hover:text-blue-300">
              Marketing
            </Link>
            <Link href="/" className="hover:text-blue-300">
              Ver tienda
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto py-4 px-2">
        {children}
      </main>
      
      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto text-center">
          <p>El Desenfreno Ediciones © {new Date().getFullYear()} - Panel de Administración</p>
        </div>
      </footer>
    </div>
  );
} 