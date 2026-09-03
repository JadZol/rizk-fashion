// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useCart } from "./context/CartContext";

type Product = {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  image_url: string | null;
  category: string | null;
};

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useCart();

  useEffect(() => {
    fetchFeatured();
  }, []);

  async function fetchFeatured() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(4);
    if (data) setFeaturedProducts(data);
  }

  return (
    <main className="min-h-screen bg-[#FBF3EC] text-[#2E2624] relative">
      {/* Marquee Ticker */}
      <div className="bg-[#D98C7A] text-white py-2 overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-[marquee_15s_linear_infinite] text-xs tracking-widest uppercase">
          Express Delivery Across Lebanon &nbsp; • &nbsp; Whish Money & Cash on Delivery &nbsp; • &nbsp; Signature Packaging Included &nbsp; • &nbsp; Express Delivery Across Lebanon &nbsp; • &nbsp; Whish Money & Cash on Delivery
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 md:px-8 py-6 bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-[#F3D9CE]">
        <div className="flex items-center gap-4">
          {/* Hamburger Menu Button */}
          <button 
            onClick={() => setMenuOpen(true)}
            className="text-[#2E2624] hover:opacity-70 transition-opacity p-1"
            aria-label="Open Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <Link href="/" className="block rounded-full overflow-hidden h-10 w-10 md:h-12 md:w-12 shadow-sm border border-[#F3D9CE]">
            <img src="/logo.png" alt="Rizk" className="h-full w-full object-cover scale-[1.15]" />
          </Link>
        </div>

        <div className="flex gap-6 items-center text-xs tracking-widest uppercase text-[#6B5F5A]">
          <Link href="/shop" className="hover:text-[#2E2624] hidden sm:inline">Shop</Link>
          <Link href="/wishlist" className="hover:text-[#2E2624]">Wishlist</Link>
          <Link href="/cart" className="flex items-center gap-1.5 font-bold text-[#D98C7A] hover:text-[#2E2624]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <span>({cart.length})</span>
          </Link>
        </div>
      </nav>

      {/* Slide-out Mobile/Boutique Menu Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-start transition-opacity">
          <div className="bg-[#FBF3EC] w-4/5 max-w-sm h-full shadow-2xl p-8 flex flex-col justify-between border-r border-[#F3D9CE] animate-in slide-in-from-left duration-300">
            <div>
              <div className="flex justify-between items-center mb-12">
                <span className="text-xs uppercase tracking-[0.2em] font-serif font-bold text-[#2E2624]">Rizk Fashion — RZK</span>
                <button 
                  onClick={() => setMenuOpen(false)}
                  className="text-[#2E2624] p-2 hover:opacity-70"
                  aria-label="Close Menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6 text-lg font-serif tracking-wide text-[#2E2624]">
                <Link href="/" onClick={() => setMenuOpen(false)} className="block hover:text-[#D98C7A] transition-colors">Home</Link>
                <Link href="/shop" onClick={() => setMenuOpen(false)} className="block hover:text-[#D98C7A] transition-colors">Shop Collection</Link>
                <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="block hover:text-[#D98C7A] transition-colors">Wishlist</Link>
                <Link href="/cart" onClick={() => setMenuOpen(false)} className="block hover:text-[#D98C7A] transition-colors">Shopping Bag ({cart.length})</Link>
                <Link href="/about" onClick={() => setMenuOpen(false)} className="block hover:text-[#D98C7A] transition-colors">Our Story</Link>
                <Link href="/faq" onClick={() => setMenuOpen(false)} className="block hover:text-[#D98C7A] transition-colors">Contact & FAQ</Link>
              </div>
            </div>

            <div className="pt-8 border-t border-[#F3D9CE] space-y-2 text-xs text-[#6B5F5A]">
              <p>rizkfashion82@gmail.com</p>
              <p>+961 76 380 819</p>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMenuOpen(false)} />
        </div>
      )}

      {/* Hero Section */}
      <header className="relative w-full h-[85vh] bg-[#2E2624] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
          alt="Rizk Fashion" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
        />
        <div className="relative z-10 text-center text-white px-6 space-y-6">
          <p className="text-xs md:text-sm tracking-[0.3em] uppercase">Rizk Fashion — RZK</p>
          <h1 className="text-5xl md:text-8xl font-serif font-light tracking-wide">Timeless Elegance.</h1>
          <div>
            <Link href="/shop" className="inline-block bg-white text-[#2E2624] px-8 py-4 text-xs uppercase tracking-widest font-bold hover:bg-[#D98C7A] hover:text-white transition-all shadow-lg">
              Explore Collection
            </Link>
          </div>
        </div>
      </header>

      {/* Featured Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#D98C7A] mb-2">Curated Selection</p>
            <h2 className="text-3xl font-serif">Latest Arrivals</h2>
          </div>
          <Link href="/shop" className="text-xs uppercase tracking-widest underline text-[#6B5F5A] hover:text-[#2E2624]">
            View All Collection →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map(product => {
            const price = product.sale_price ?? product.price;
            return (
              <Link key={product.id} href={`/product/${product.id}`} className="bg-white border border-[#F3D9CE] group block overflow-hidden">
                <div className="w-full h-80 bg-[#F3D9CE] overflow-hidden relative">
                  {product.image_url && (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  )}
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#D98C7A]">{product.category || "Collection"}</p>
                    <h3 className="text-sm font-medium text-[#2E2624]">{product.name}</h3>
                  </div>
                  <span className="text-sm font-bold text-[#2E2624]">${price.toFixed(2)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer with Email & Phone */}
      <footer className="bg-white border-t border-[#F3D9CE] py-16 px-8 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          <div>
            <h3 className="text-lg font-serif mb-2">Rizk Fashion — RZK</h3>
            <p className="text-xs text-[#6B5F5A] leading-relaxed">Curated women's clothing and boutique pieces delivered across Lebanon.</p>
          </div>
          <div className="space-y-3 text-xs tracking-wider text-[#6B5F5A]">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#2E2624]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
              <a href="tel:+96176380819" className="hover:text-[#2E2624] transition-colors">+961 76 380 819</a>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#2E2624]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              <a href="mailto:rizkfashion82@gmail.com" className="hover:text-[#2E2624] transition-colors">rizkfashion82@gmail.com</a>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#2E2624]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              <span>Lebanon — Online Only</span>
            </div>
          </div>
          <div className="text-right text-xs tracking-widest text-[#6B5F5A]">
            <p>© 2026 RIZK FASHION</p>
            <p className="mt-1">All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}