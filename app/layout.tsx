// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { CartProvider } from "./context/CartContext";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rizk Fashion | The Boutique Collection",
  description: "Exclusive boutique collection in Lebanon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#FBF3EC] text-[#2E2624] antialiased`}>
        <CartProvider>
          <Navbar />
          {children}
          
          <footer className="bg-[#2E2624] text-white pt-16 pb-8 border-t border-[#F3D9CE]/30">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="space-y-4">
                <h3 className="text-lg font-serif tracking-widest">RIZK FASHION</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Curated elegance and timeless wardrobe essentials. Proudly serving Lebanon with premium boutique fashion.
                </p>
                <div className="space-y-1.5 text-xs text-gray-400">
                  <p><a href="tel:+96176380819" className="hover:text-white transition-colors cursor-pointer">+961 76 380 819</a></p>
                  <p><a href="mailto:rizkfashion82@gmail.com" className="hover:text-white transition-colors cursor-pointer">rizkfashion82@gmail.com</a></p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-[#D98C7A]">Customer Care</h4>
                <ul className="space-y-2.5 text-xs text-gray-400">
                  <li><Link href="/faq" className="hover:text-white transition-colors cursor-pointer">Shipping & Delivery</Link></li>
                  <li><Link href="/faq" className="hover:text-white transition-colors cursor-pointer">Payment Methods</Link></li>
                  <li><Link href="/faq" className="hover:text-white transition-colors cursor-pointer">Returns & Exchanges</Link></li>
                  <li><Link href="/faq" className="hover:text-white transition-colors cursor-pointer">Order Cancellations</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-[#D98C7A]">The Brand</h4>
                <ul className="space-y-2.5 text-xs text-gray-400">
                  <li><Link href="/about" className="hover:text-white transition-colors cursor-pointer">About Us</Link></li>
                  <li><Link href="/shop" className="hover:text-white transition-colors cursor-pointer">New Arrivals</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-[#D98C7A]">Connect</h4>
                <ul className="space-y-2.5 text-xs text-gray-400">
                  <li><a href="https://www.instagram.com/rizk_fashion?igsi=MWJqODdwamhjdTAxcA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">Instagram</a></li>
                  <li><a href="https://www.facebook.com/profile.php?id=61561274979493&mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">Facebook</a></li>
                  <li><a href="https://wa.me/96176380819" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">WhatsApp</a></li>
                </ul>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest">
              <p>&copy; {new Date().getFullYear()} Rizk Fashion. All Rights Reserved.</p>
              <p className="mt-2 md:mt-0 font-serif lowercase tracking-normal text-xs text-[#D98C7A]">timeless elegance.</p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}