import "./globals.css";
import localFont from "next/font/local";
import MenuHeader from "./components/MenuHeader";
import MobileHeader from "./components/MobileHeader";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Head from "next/head";
import type { Metadata } from "next";

const aggie = localFont({
  src: [
    {
      path: "../public/fonts/Aggie-Regular.otf",
      weight: "400",
    },
  ],
  variable: "--font-aggie",
});

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
    <html lang="en">
      <body
        className={aggie.className}
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <MenuHeader />
        <MobileHeader />
        <div className="flex flex-1 flex-col">
          <Sidebar />
          <main className="md:ml-[500px] md:mt-10 md:flex-1">{children}</main>
        </div>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
