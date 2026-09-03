// app/wishlist/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";

type Product = {
  id: string;
  name: string;
  price: number;
  sale_price?: number | null;
  image_url: string | null;
  category: string | null;
  sizes: string | null;
  colors: string | null;
};

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { cart, addToCart } = useCart();

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

  function moveToBag(product: Product) {
    const effectivePrice = product.sale_price && product.sale_price > 0 ? product.sale_price : product.price;
    addToCart({
      id: product.id,
      name: product.name,
      price: effectivePrice,
      image_url: product.image_url,
      size: "One Size" // Default size for quick-add from wishlist
    });
    removeFromWishlist(product.id);
  }

  return (
    <main className="min-h-screen bg-[#FBF3EC] text-[#2E2624]">
      {/* Top Announcement Bar */}
      <div className="bg-[#D98C7A] text-white text-center py-2 text-xs tracking-widest uppercase">
        Complimentary delivery across Lebanon on all orders
      </div>

      {/* Navigation Header with SVG Bag Icon */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-[#F3D9CE] bg-white sticky top-0 z-50">
        <Link href="/" className="text-xl font-serif tracking-widest">RIZK FASHION</Link>
        <div className="flex gap-6 items-center">
          <Link href="/wishlist" className="text-xs tracking-widest uppercase font-bold text-[#D98C7A]">
            Wishlist ({wishlist.length})
          </Link>
          <Link href="/cart" className="flex items-center gap-1.5 font-bold text-[#6B5F5A] hover:text-[#2E2624] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <span className="text-xs uppercase tracking-widest">({cart.length})</span>
          </Link>
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
              <div key={product.id} className="bg-white border border-[#F3D9CE] overflow-hidden relative flex flex-col h-full group">
                <Link href={`/product/${product.id}`} className="block relative">
                  <div className="w-full h-96 bg-[#F3D9CE] overflow-hidden relative">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#6B5F5A] text-sm">{product.name}</div>
                    )}
                  </div>
                </Link>
                
                <button 
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-3 right-3 text-red-500 text-xl bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm z-10 hover:scale-110 transition-transform"
                >
                  ×
                </button>

                <div className="p-4 flex flex-col flex-1 justify-between bg-white">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-[#2E2624]">{product.name}</h3>
                    <p className="text-xs font-bold text-[#D98C7A] mt-1">${product.price.toFixed(2)}</p>
                  </div>
                  
                  <button 
                    onClick={() => moveToBag(product)}
                    className="w-full bg-[#2E2624] text-white py-3 text-xs uppercase tracking-widest hover:bg-[#D98C7A] transition-colors mt-auto"
                  >
                    Move to Bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}