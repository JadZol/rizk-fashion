// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { CartProvider } from "./context/CartContext";

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
      <body className={inter.className}>
        <CartProvider>
          {children}
          
          <footer className="bg-[#2E2624] text-white pt-16 pb-8 border-t border-[#F3D9CE]">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div>
                <h3 className="text-lg font-serif tracking-widest mb-4">RIZK FASHION</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Curated elegance and timeless wardrobe essentials. Proudly serving Lebanon with premium boutique fashion.
                </p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-[#D98C7A]">Customer Care</h4>
                <ul className="space-y-2 text-xs text-gray-400">
                  <li><Link href="/faq" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
                  <li><Link href="/faq" className="hover:text-white transition-colors">Payment Methods</Link></li>
                  <li><Link href="/faq" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
                  <li><Link href="/faq" className="hover:text-white transition-colors">Order Cancellations</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-[#D98C7A]">The Brand</h4>
                <ul className="space-y-2 text-xs text-gray-400">
                  <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                  <li><Link href="/" className="hover:text-white transition-colors">New Arrivals</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-[#D98C7A]">Connect</h4>
                <ul className="space-y-2 text-xs text-gray-400">
                  <li><a href="https://www.instagram.com/rizk_fashion?igsi=MWJqODdwamhjdTAxcA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a></li>
                  <li><a href="https://www.facebook.com/profile.php?id=61561274979493&mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a></li>
                </ul>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 border-t border-gray-700 pt-8 text-center text-[10px] text-gray-500 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} Rizk Fashion. All Rights Reserved.
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}