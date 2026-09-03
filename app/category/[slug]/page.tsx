// app/category/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

type Product = {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  image_url: string | null;
  category: string | null;
  sizes: string | null;
  colors: string | null;
};

// Map URL slugs to clean display names, including "Sets"
const CATEGORY_TITLE_MAP: Record<string, string> = {
  "tops-sweaters": "Tops & Sweaters",
  "coats-jackets": "Coats & Jackets",
  "dresses": "Dresses",
  "shirts": "Shirts",
  "jeans": "Jeans",
  "pants": "Pants",
  "skirts": "Skirts",
  "shorts": "Shorts",
  "sets": "Sets",
  "sale": "Sale Collection",
  "all": "All Collection"
};

export default function CategoryPage() {
  const params = useParams();
  const rawSlug = typeof params?.slug === 'string' ? params.slug.toLowerCase() : "";
  
  const categoryName = CATEGORY_TITLE_MAP[rawSlug] || decodeURIComponent(rawSlug).replace(/-/g, " ");
  
  const { cart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  
  const availableSizes = Array.from(new Set(
    products.flatMap(p => p.sizes ? p.sizes.split(",").map(s => s.trim()) : [])
  )).filter(Boolean);

  useEffect(() => {
    async function fetchCategoryProducts() {
      setLoading(true);
      let query = supabase.from("products").select("*").order("created_at", { ascending: false });
      
      if (rawSlug !== "all" && rawSlug !== "sale") {
        query = query.or(`category.ilike.${categoryName},category.ilike.${rawSlug.replace(/-/g, " ")}`);
      }
      
      const { data, error } = await query;
      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchCategoryProducts();
  }, [rawSlug, categoryName]);

  function toggleSize(size: string) {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  }

  const filteredProducts = products.filter(product => {
    const effectivePrice = product.sale_price && product.sale_price > 0 ? product.sale_price : product.price;
    if (effectivePrice > maxPrice) return false;

    if (rawSlug === "sale" && (!product.sale_price || product.sale_price <= 0)) {
      return false;
    }

    if (selectedSizes.length > 0) {
      const productSizes = product.sizes ? product.sizes.split(",").map(s => s.trim()) : [];
      const hasMatchingSize = selectedSizes.some(size => productSizes.includes(size));
      if (!hasMatchingSize) return false;
    }

    return true;
  });

  return (
    <main className="min-h-screen bg-[#FBF3EC] text-[#2E2624] pt-8">
      <div className="max-w-[1400px] mx-auto px-6 py-10 flex flex-col md:flex-row gap-10">
        <aside className="w-full md:w-64 flex-shrink-0">
          <h2 className="text-2xl font-serif capitalize mb-8">{categoryName}</h2>
          
          <div className="border-t border-[#F3D9CE] py-6">
            <h3 className="text-xs uppercase tracking-widest font-bold mb-4">Price Range</h3>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="0" 
                max="150" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#2E2624]"
              />
            </div>
            <p className="text-xs text-[#6B5F5A] mt-2">Up to ${maxPrice}</p>
          </div>

          {availableSizes.length > 0 && (
            <div className="border-t border-[#F3D9CE] py-6">
              <h3 className="text-xs uppercase tracking-widest font-bold mb-4">Size</h3>
              <div className="flex flex-col gap-2">
                {availableSizes.map(size => (
                  <label key={size} className="flex items-center gap-3 cursor-pointer text-sm">
                    <input 
                      type="checkbox" 
                      checked={selectedSizes.includes(size)}
                      onChange={() => toggleSize(size)}
                      className="w-4 h-4 accent-[#2E2624]"
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>
          )}
        </aside>

        <div className="flex-1">
          {loading ? (
            <p className="text-xs uppercase tracking-widest text-[#6B5F5A]">Loading collection...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-xs uppercase tracking-widest text-[#6B5F5A]">No pieces match your filters.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => {
                const effectivePrice = product.sale_price !== null && product.sale_price > 0 ? product.sale_price : product.price;
                const hasSale = product.sale_price !== null && product.sale_price > 0;
                
                return (
                  <Link key={product.id} href={`/product/${product.id}`} className="block group bg-white border border-[#F3D9CE]">
                    <div className="w-full h-96 bg-[#F3D9CE] relative overflow-hidden">
                      {product.image_url && (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      )}
                      {hasSale && (
                        <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] uppercase px-2 py-1 font-medium z-10">Sale</span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] uppercase tracking-wider text-[#6B5F5A] mb-1">{product.category}</p>
                      <h3 className="text-sm font-medium mb-2 truncate">{product.name}</h3>
                      <div className="flex justify-between items-center">
                        {hasSale ? (
                          <div className="flex gap-2 items-center">
                            <span className="text-xs text-gray-400 line-through">${product.price.toFixed(2)}</span>
                            <span className="text-sm font-bold text-red-600">${effectivePrice.toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className="text-sm font-bold">${effectivePrice.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}