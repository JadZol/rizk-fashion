// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  description: string | null;
  image_url: string | null;
  category: string | null;
  stock_status: string | null;
};

const CATEGORIES = [
  "All", "Sale", "Dresses", "Tops & Sweaters", "Shirts", 
  "Coats & Jackets", "Jeans", "Pants", "Skirts", "Shorts"
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  }).sort((a, b) => {
    const priceA = a.sale_price ?? a.price;
    const priceB = b.sale_price ?? b.price;
    if (sortBy === "price-low") return priceA - priceB;
    if (sortBy === "price-high") return priceB - priceA;
    return 0;
  });

  return (
    <main className="min-h-screen bg-[#FBF3EC] text-[#2E2624] pb-20">
      <div className="bg-[#D98C7A] text-white text-center py-2 text-xs tracking-widest uppercase">
        Express Delivery Across Lebanon • Whish Money & Cash on Delivery
      </div>

      <nav className="flex justify-between items-center px-6 md:px-8 py-6 border-b border-[#F3D9CE]">
        <h1 className="text-xl md:text-2xl font-serif tracking-wider">RIZK FASHION</h1>
        <div className="space-x-4 md:space-x-6 text-xs md:text-sm tracking-widest uppercase text-[#6B5F5A]">
          <Link href="/wishlist" className="hover:text-[#2E2624]">Wishlist</Link>
          {/* Admin link safely removed from public view */}
        </div>
      </nav>

      <header className="text-center py-12 px-4">
        <h2 className="text-3xl md:text-5xl font-light tracking-wide font-serif mb-2">The Boutique Collection</h2>
        <p className="text-xs md:text-sm text-[#6B5F5A] max-w-md mx-auto tracking-wider uppercase">
          Curated elegance and timeless wardrobe essentials.
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <input 
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full md:w-96 px-4 py-3 bg-white border border-[#F3D9CE] text-sm focus:outline-none focus:border-[#D98C7A]"
        />
        <select 
          value={sortBy} 
          onChange={e => setSortBy(e.target.value)}
          className="w-full md:w-auto px-4 py-3 bg-white border border-[#F3D9CE] text-xs uppercase tracking-wider focus:outline-none"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-wrap gap-2 justify-center">
        {CATEGORIES.map(category => {
          // Format category text into a clean URL slug (e.g., "Tops & Sweaters" -> "tops-sweaters")
          const slug = category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
          return (
            <Link
              key={category}
              href={`/category/${slug}`}
              className="px-4 py-2 text-xs uppercase tracking-widest border border-[#F3D9CE] bg-white text-[#2E2624] hover:border-[#2E2624] hover:bg-[#2E2624] hover:text-white transition-all"
            >
              {category}
            </Link>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {loading ? (
          <p className="text-center py-20 text-[#6B5F5A] text-xs uppercase tracking-widest">Loading...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center py-20 text-[#6B5F5A] text-xs uppercase tracking-widest">No pieces found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => {
              const effectivePrice = product.sale_price !== null && product.sale_price > 0 ? product.sale_price : product.price;
              const hasSale = product.sale_price !== null && product.sale_price > 0;
              
              return (
                <Link 
                  key={product.id} 
                  href={`/product/${product.id}`}
                  className="bg-white border border-[#F3D9CE] block touch-manipulation active:opacity-90"
                >
                  <div className="w-full h-80 bg-[#F3D9CE] relative overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-[#6B5F5A]">No image</div>
                    )}
                    {hasSale && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] uppercase px-2 py-1 font-medium z-10">
                        Sale
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex justify-between items-start bg-white">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#6B5F5A] mb-1">{product.category || "Collection"}</p>
                      <h3 className="text-sm font-medium text-[#2E2624]">{product.name}</h3>
                    </div>
                    <div className="text-right">
                      {hasSale ? (
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-gray-400 line-through">${product.price.toFixed(2)}</span>
                          <span className="text-xs font-bold text-red-600">${effectivePrice.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-[#D98C7A]">${effectivePrice.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}