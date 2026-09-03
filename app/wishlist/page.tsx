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
      size: "One Size"
    });
    removeFromWishlist(product.id);
  }

  return (
    <main className="min-h-screen bg-[#FBF3EC] text-[#2E2624]">
      {/* Header */}
      <div className="text-center py-12 px-4 pt-16">
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