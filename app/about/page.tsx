// app/about/page.tsx
"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function AboutPage() {
  const { cart } = useCart();

  return (
    <main className="min-h-screen bg-[#FBF3EC] text-[#2E2624]">
      <nav className="flex justify-between items-center px-8 py-6 border-b border-[#F3D9CE] bg-white sticky top-0 z-50">
        <Link href="/" className="text-xl font-serif tracking-wider">RIZK FASHION</Link>
        <div className="flex gap-6 items-center">
          <Link href="/wishlist" className="text-xs tracking-widest uppercase text-[#6B5F5A] hover:text-[#2E2624]">Wishlist</Link>
          <Link href="/cart" className="flex items-center gap-1.5 font-bold text-[#D98C7A] hover:text-[#2E2624] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <span className="text-xs uppercase tracking-widest">({cart.length})</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-serif mb-8">Our Story</h1>
        <p className="text-sm md:text-base leading-relaxed text-[#6B5F5A] mb-8">
          Founded in the heart of Lebanon, Rizk Fashion (RZK) was born from a passion for curated elegance. 
          We believe that a wardrobe should be a collection of timeless essentials, blending modern aesthetics 
          with classic silhouettes. 
        </p>
        <div className="w-24 h-[1px] bg-[#D98C7A] mx-auto mb-12"></div>
        <h2 className="text-2xl font-serif mb-4">The Signature Style</h2>
        <p className="text-sm text-[#6B5F5A] mb-12">
          Inspired by the bold spirit of leopard prints, the delicate touch of floral accents, and the enduring strength 
          of the Lebanese cedar, our aesthetic reflects the dual nature of modern fashion: strong, proud, and deeply feminine.
        </p>
        <Link href="/" className="inline-block px-8 py-4 bg-[#2E2624] text-white text-xs uppercase tracking-widest hover:bg-[#D98C7A] transition-colors">
          Explore The Collection
        </Link>
      </div>
    </main>
  );
}