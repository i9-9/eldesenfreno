import "./globals.css";
import localFont from "next/font/local";
import MenuHeader from "./components/MenuHeader";
import MobileHeader from "./components/MobileHeader";
import Sidebar from "./components/Sidebar";
import Head from "next/head";
import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import { SidebarProvider } from './context/SidebarContext'
import ToastProviderWrapper from './components/ToastProviderWrapper'
import { Analytics } from '@vercel/analytics/next'
import MainContent from './components/MainContent'
import TopTicker from './components/TopTicker'

const aggie = localFont({
  src: [
    {
      path: "../public/fonts/Aggie-Regular.otf",
      weight: "400",
    },
  ],
  variable: "--font-aggie",
  display: 'swap',
  preload: true,
});

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "El Desenfreno Ediciones",
  description: "Editorial argentina de poesía.",
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    stylesheet: "https://use.typekit.net/maa8yuy.css",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="overflow-x-hidden">
      <body
        className={`${aggie.className}`}
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <CartProvider>
          <SidebarProvider>
            <ToastProviderWrapper>
              <TopTicker />
              <MenuHeader />
              <MobileHeader />
              <div className="flex flex-1 flex-col">
                <Sidebar />
                <MainContent>{children}</MainContent>
              </div>
            </ToastProviderWrapper>
          </SidebarProvider>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
