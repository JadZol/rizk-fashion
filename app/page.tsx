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
  "All",
  "Sale",
  "Dresses",
  "Tops & Sweaters",
  "Shirts",
  "Coats & Jackets",
  "Jeans",
  "Pants",
  "Skirts",
  "Shorts",
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
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

    if (selectedCategory === "All") return matchesSearch;
    if (selectedCategory === "Sale") return matchesSearch && product.sale_price !== null && product.sale_price > 0;
    return matchesSearch && product.category === selectedCategory;
  }).sort((a, b) => {
    const priceA = a.sale_price ?? a.price;
    const priceB = b.sale_price ?? b.price;
    if (sortBy === "price-low") return priceA - priceB;
    if (sortBy === "price-high") return priceB - priceA;
    return 0;
  });

  return (
    <main className="min-h-screen bg-[#FBF3EC] text-[#2E2624]">
      <div className="bg-[#D98C7A] text-white text-center py-2 text-xs tracking-widest uppercase">
        Express Delivery Across Lebanon • Whish Money & Cash on Delivery Available
      </div>

      <nav className="flex justify-between items-center px-8 py-6 border-b border-[#F3D9CE]">
        <h1 className="text-2xl font-serif tracking-wider">RIZK FASHION</h1>
        <div className="space-x-6 text-sm tracking-widest uppercase text-[#6B5F5A]">
          <Link href="/wishlist" className="hover:text-[#2E2624]">Wishlist</Link>
          <Link href="/admin" className="hover:text-[#2E2624]">Admin</Link>
        </div>
      </nav>

      <header className="text-center py-16 px-4 bg-gradient-to-b from-[#F3D9CE]/30 to-transparent">
        <h2 className="text-4xl md:text-5xl font-light tracking-wide font-serif mb-3">The Boutique Collection</h2>
        <p className="text-sm text-[#6B5F5A] max-w-md mx-auto tracking-wider uppercase">
          Curated elegance and timeless wardrobe essentials.
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <input 
          type="text"
          placeholder="Search products or categories..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full md:w-96 px-4 py-2.5 bg-white border border-[#F3D9CE] text-sm focus:outline-none focus:border-[#D98C7A]"
        />

        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <span className="text-xs uppercase tracking-wider text-[#6B5F5A]">Sort:</span>
          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white border border-[#F3D9CE] text-xs uppercase tracking-wider focus:outline-none"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-wrap gap-2 justify-center">
        {CATEGORIES.map(category => {
          const count = category === "All" 
            ? products.length 
            : category === "Sale" 
            ? products.filter(p => p.sale_price !== null && p.sale_price > 0).length 
            : products.filter(p => p.category === category).length;

          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-xs uppercase tracking-widest border transition-all ${
                selectedCategory === category 
                  ? "border-[#2E2624] bg-[#2E2624] text-white" 
                  : "border-[#F3D9CE] bg-white text-[#2E2624] hover:border-[#D98C7A]"
              }`}
            >
              {category} ({count})
            </button>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        {loading ? (
          <p className="text-center py-20 text-[#6B5F5A] text-sm tracking-widest uppercase">Loading collection...</p>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#F3D9CE] p-8">
            <p className="text-sm text-[#6B5F5A] uppercase tracking-wider mb-2">No pieces found matching your criteria.</p>
            <button onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }} className="text-xs uppercase tracking-widest underline text-[#D98C7A]">
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => {
              const effectivePrice = product.sale_price !== null && product.sale_price > 0 ? product.sale_price : product.price;
              const hasSale = product.sale_price !== null && product.sale_price > 0;

              return (
                <Link 
                  key={product.id} 
                  href={`/product/${product.id}`}
                  className="bg-white border border-[#F3D9CE] overflow-hidden group block hover:shadow-md transition-all"
                >
                  <div className="w-full h-80 bg-[#F3D9CE] overflow-hidden relative">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-[#6B5F5A]">No image</div>
                    )}
                    {hasSale && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] uppercase tracking-widest px-2 py-1 font-medium">
                        Sale
                      </span>
                    )}
                  </div>
                  <div className="p-4 bg-white flex justify-between items-start">
                    <div>
                      <h3 className="text-xs uppercase tracking-wider text-[#6B5F5A] mb-1">{product.category || "Collection"}</h3>
                      <h4 className="text-sm font-medium text-[#2E2624] truncate">{product.name}</h4>
                    </div>
                    <div className="text-right">
                      {hasSale ? (
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-gray-400 line-through">${product.price.toFixed(2)}</span>
                          <span className="text-xs font-bold text-red-600">${effectivePrice.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-[#D98C7A]">${product.price.toFixed(2)}</span>
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