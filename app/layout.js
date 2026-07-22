import { Jost } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Police du logo "MAISON BUBBLE'S", utilisée pour tout le site.
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata = {
  title: "Maison Bubble's — Coffrets cadeaux",
  description: "Découvrez nos coffrets cadeaux.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${jost.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-ecru">
        <CartProvider>
          <Header />
          {children}
        </CartProvider>
        <Footer />
      </body>
    </html>
  );
}
