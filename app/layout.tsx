// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
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
        <ToastProvider>
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
                  <ul className="space-y-3 text-xs text-gray-400">
                    <li>
                      <a href="https://www.instagram.com/rizk_fashion?igsi=MWJqODdwamhjdTAxcA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-2.5">
                        <svg className="w-4 h-4 text-[#D98C7A]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                        </svg>
                        Instagram
                      </a>
                    </li>
                    <li>
                      <a href="https://www.facebook.com/profile.php?id=61561274979493&mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-2.5">
                        <svg className="w-4 h-4 text-[#D98C7A]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </a>
                    </li>
                    <li>
                      <a href="https://www.tiktok.com/@rizk_fashion?_r=1&_t=ZS-99VemVUreTN" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-2.5">
                        <svg className="w-4 h-4 text-[#D98C7A]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                        TikTok
                      </a>
                    </li>
                    <li>
                      <a href="https://wa.me/96176380819" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-2.5">
                        <svg className="w-4 h-4 text-[#D98C7A]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                        </svg>
                        WhatsApp
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="max-w-7xl mx-auto px-6 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest">
                <p>&copy; {new Date().getFullYear()} Rizk Fashion. All Rights Reserved.</p>
                <p className="mt-2 md:mt-0 font-serif lowercase tracking-normal text-xs text-[#D98C7A]">timeless elegance.</p>
              </div>
            </footer>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}