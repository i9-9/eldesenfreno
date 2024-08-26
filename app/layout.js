import "./globals.css";
import localFont from "next/font/local";
import MenuHeader from "./components/MenuHeader";
import MobileHeader from "./components/MobileHeader";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

const aggie = localFont({
  src: [
    {
      path: "../public/fonts/Aggie-Regular.otf",
      weight: "400",
    },
  ],
  variable: "--font-aggie",
});

export const metadata = {
  stylesheet: "https://use.typekit.net/maa8yuy.css",
  title: "El Desenfreno Ediciones",
  description: "Editorial argentina de poesía.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={aggie.className} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <MenuHeader />
        <MobileHeader />
        <div className="flex flex-1 flex-col">
          <Sidebar />
          <main className="md:ml-[500px] md:mt-10 md:flex-1">
            {children}
          </main>
        </div>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
