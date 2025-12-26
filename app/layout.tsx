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
import ToastProviderWrapper from './components/ToastProviderWrapper'

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
    <html lang="en" className="overflow-x-hidden hide-scrollbar">
      <body
        className={`${aggie.className} hide-scrollbar`}
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <CartProvider>
          <ToastProviderWrapper>
            <MenuHeader />
            <MobileHeader />
            <div className="flex flex-1 flex-col">
              <Sidebar />
              <main className="md:ml-[500px] md:mt-10 md:flex-1">{children}</main>
            </div>
          </ToastProviderWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
