import "./globals.css";
import localFont from "next/font/local";
import MenuHeader from "./components/MenuHeader";
import Bio from "./components/Bio";
import MobileHeader from "./components/MobileHeader";
import Sidebar from "./components/Sidebar";

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
      <body className={aggie.className}>
          <MenuHeader />
          <MobileHeader />
          <div className="flex h-screen">
            <Sidebar/>
            <div className="md:ml-[500px] md:mt-10 md:flex-1 ">
              {children}
            </div>
          </div>
      </body>
    </html>
  );
}
