import "./globals.css";
import localFont from "next/font/local";
import MenuHeader from "./components/MenuHeader";
import MobileHeader from "./components/MobileHeader";
import Sidebar from "./components/Sidebar";
import type { Metadata } from "next";
import { CartProvider } from './context/CartContext'
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eldesenfreno.com";
const defaultOgImage = "/post-rounded.svg";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "El Desenfreno Ediciones",
    template: "%s | El Desenfreno Ediciones",
  },
  description: "Editorial argentina de poesía.",
  authors: [{ name: "Iván Nevares", url: "https://inevares.com" }],
  creator: "Iván Nevares",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: "El Desenfreno Ediciones",
    title: "El Desenfreno Ediciones",
    description: "Editorial argentina de poesía.",
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: "El Desenfreno Ediciones",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "El Desenfreno Ediciones",
    description: "Editorial argentina de poesía.",
    images: [defaultOgImage],
  },
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
