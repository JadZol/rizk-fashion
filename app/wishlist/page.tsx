// app/wishlist/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  category: string | null;
  sizes: string | null;
  colors: string | null;
};

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("rizk_wishlist");
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  function removeFromWishlist(id: string) {
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("rizk_wishlist", JSON.stringify(updated));
  }

  return (
    <main className="min-h-screen bg-[#FBF3EC] text-[#2E2624] flex flex-col justify-between">
      <div>
        {/* Top Announcement Bar */}
        <div className="bg-[#D98C7A] text-white text-center py-2 text-xs tracking-widest uppercase">
          Complimentary delivery across Lebanon on all orders
        </div>

        {/* Navigation Header */}
        <nav className="flex justify-between items-center px-8 py-6 border-b border-[#F3D9CE]">
          <h1 className="text-2xl font-serif tracking-widest">RIZK FASHION</h1>
          <div className="space-x-6 text-sm tracking-widest uppercase text-[#6B5F5A]">
            <Link href="/" className="hover:text-[#2E2624]">Shop</Link>
            <Link href="/wishlist" className="hover:text-[#2E2624] font-medium text-[#D98C7A]">Wishlist ({wishlist.length})</Link>
          </div>
        </nav>

        {/* Header */}
        <div className="text-center py-12 px-4">
          <h2 className="text-4xl font-light tracking-wide mb-2 font-serif">Your Curated Wishlist</h2>
          <p className="text-xs text-[#6B5F5A] tracking-widest uppercase">Saved pieces for your wardrobe</p>
        </div>

        {/* Wishlist Grid */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          {wishlist.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <p className="text-[#6B5F5A] text-sm tracking-wider">Your wishlist is currently empty.</p>
              <div>
                <Link href="/" className="inline-block bg-[#2E2624] text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-[#D98C7A] transition-colors">
                  Explore Collection
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {wishlist.map((product) => (
                <div key={product.id} className="bg-white border border-[#F3D9CE] overflow-hidden relative group">
                  <Link href={`/product/${product.id}`} className="block">
                    <div className="w-full h-96 bg-[#F3D9CE] overflow-hidden relative">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#6B5F5A] text-sm">{product.name}</div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4 flex justify-between items-center bg-white">
                    <div>
                      <h3 className="text-sm font-medium text-[#2E2624]">{product.name}</h3>
                      <p className="text-xs text-[#D98C7A] mt-1">${product.price.toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => removeFromWishlist(product.id)}
                      className="text-xs uppercase tracking-wider text-[#6B5F5A] hover:text-red-600 underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#2E2624] text-[#FBF3EC] py-12 px-8 text-center text-xs tracking-widest uppercase border-t border-[#F3D9CE]/20">
        &copy; {new Date().getFullYear()} Rizk Fashion. All Rights Reserved.
      </footer>
    </main>
  );
}