import { ReactNode } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen font-neue-display bg-[#0b0b0b] text-white">
      <header className="bg-[#1a1a1a] border-b border-[#333333] p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-xl font-bold tracking-tight">
              El Desenfreno Admin
            </Link>
          </div>
          <nav className="flex space-x-6 text-sm">
            <Link href="/admin/blog" className="text-gray-400 hover:text-white transition-colors">
              Blog
            </Link>
            <Link href="/admin/customers" className="text-gray-400 hover:text-white transition-colors">
              Clientes
            </Link>
            <Link href="/admin/marketing" className="text-gray-400 hover:text-white transition-colors">
              Marketing
            </Link>
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              Ver tienda
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto py-6 px-4">
        {children}
      </main>
      
      <footer className="bg-[#1a1a1a] border-t border-[#333333] p-4">
        <div className="container mx-auto text-center text-sm text-gray-500">
          <p>El Desenfreno Ediciones © {new Date().getFullYear()} - Panel de Administración</p>
        </div>
      </footer>
    </div>
  );
}
