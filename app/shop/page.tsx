// app/shop/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useCart } from "../context/CartContext";

type Product = {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  description: string | null;
  image_url: string | null;
  category: string | null;
  sizes: string | null;
  stock_status: string | null;
};

const CATEGORIES = [
  "All", "Sale", "Dresses", "Tops & Sweaters", "Shirts", 
  "Coats & Jackets", "Jeans", "Pants", "Skirts", "Shorts", "Sets"
];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Instant Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState<number>(150);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  
  const { cart, addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
    loadWishlist();
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

  function loadWishlist() {
    const saved = localStorage.getItem("rizk_wishlist");
    if (saved) {
      try {
        const items: Product[] = JSON.parse(saved);
        setWishlistIds(items.map(i => i.id));
      } catch (e) {
        setWishlistIds([]);
      }
    }
  }

  const toggleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    const saved = localStorage.getItem("rizk_wishlist");
    let wishlist: Product[] = saved ? JSON.parse(saved) : [];
    
    const exists = wishlist.some(item => item.id === product.id);
    if (exists) {
      wishlist = wishlist.filter(item => item.id !== product.id);
    } else {
      wishlist.push(product);
    }
    
    localStorage.setItem("rizk_wishlist", JSON.stringify(wishlist));
    setWishlistIds(wishlist.map(i => i.id));
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  // Dynamically extract all available sizes from fetched products
  const availableSizes = Array.from(new Set(
    products.flatMap(p => p.sizes ? p.sizes.split(",").map(s => s.trim()) : [])
  )).filter(Boolean);

  // Master Filter Engine
  const filteredProducts = products.filter(product => {
    const effectivePrice = product.sale_price !== null && product.sale_price > 0 ? product.sale_price : product.price;
    const hasActiveSale = product.sale_price !== null && product.sale_price > 0;

    // 1. Search Query
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = query === "" || 
      product.name.toLowerCase().includes(query) ||
      (product.description && product.description.toLowerCase().includes(query));

    // 2. Category Match
    let matchesCategory = true;
    if (selectedCategory === "Sale") {
      matchesCategory = hasActiveSale;
    } else if (selectedCategory !== "All") {
      matchesCategory = product.category?.toLowerCase() === selectedCategory.toLowerCase();
    }

    // 3. Price Match
    const matchesPrice = effectivePrice <= maxPrice;

    // 4. Size Match
    let matchesSize = true;
    if (selectedSizes.length > 0) {
      const productSizes = product.sizes ? product.sizes.split(",").map(s => s.trim()) : [];
      matchesSize = selectedSizes.some(size => productSizes.includes(size));
    }

    return matchesSearch && matchesCategory && matchesPrice && matchesSize;
  }).sort((a, b) => {
    const priceA = a.sale_price ?? a.price;
    const priceB = b.sale_price ?? b.price;
    if (sortBy === "price-low") return priceA - priceB;
    if (sortBy === "price-high") return priceB - priceA;
    return 0; // Default newest
  });

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    const effectivePrice = product.sale_price !== null && product.sale_price > 0 ? product.sale_price : product.price;
    addToCart({
      id: product.id,
      name: product.name,
      price: effectivePrice,
      image_url: product.image_url,
      size: "One Size"
    });
  };

  return (
    <main className="min-h-screen bg-[#FBF3EC] text-[#2E2624] pb-20 relative">
      
      {/* Editorial Full-Screen Hero */}
      <header className="relative w-full h-[85vh] bg-[#2E2624] flex items-center justify-center overflow-hidden mb-16">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
          alt="Rizk Fashion Editorial" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
        />
        <div className="relative z-10 text-center text-white px-6">
          <p className="text-xs md:text-sm tracking-[0.3em] uppercase mb-4 drop-shadow-md">The New Standard</p>
          <h2 className="text-5xl md:text-7xl font-serif font-light tracking-wide mb-6 drop-shadow-lg">
            Curated Elegance.
          </h2>
        </div>
      </header>

      {/* Horizontal Instant Category Switcher */}
      <div id="catalog" className="scroll-mt-24 max-w-7xl mx-auto px-6 mb-12 flex flex-wrap gap-2 justify-center">
        {CATEGORIES.map(category => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 text-xs uppercase tracking-widest border transition-all duration-300 cursor-pointer ${
                isActive 
                  ? "bg-[#2E2624] text-white border-[#2E2624]" 
                  : "bg-white text-[#2E2624] border-[#F3D9CE] hover:border-[#2E2624] hover:bg-[#2E2624] hover:text-white"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Main Content: Sidebar Filters + Product Grid */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-10 items-start">
        
        {/* Left Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 md:sticky md:top-28 space-y-8 bg-white p-6 border border-[#F3D9CE]">
          
          {/* Search & Sort */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-bold border-b border-[#F3D9CE] pb-2">Search</h3>
            <input 
              type="text"
              placeholder="Search pieces..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-[#FBF3EC] border border-[#F3D9CE] text-sm focus:outline-none focus:border-[#D98C7A]"
            />
            
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-[#FBF3EC] border border-[#F3D9CE] text-xs uppercase tracking-wider focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-bold border-b border-[#F3D9CE] pb-2">Max Price</h3>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="0" 
                max="150" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#2E2624] cursor-pointer"
              />
            </div>
            <p className="text-xs text-[#6B5F5A]">Up to ${maxPrice}</p>
          </div>

          {/* Size Filter */}
          {availableSizes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-bold border-b border-[#F3D9CE] pb-2">Sizes</h3>
              <div className="flex flex-col gap-3">
                {availableSizes.map(size => (
                  <label key={size} className="flex items-center gap-3 cursor-pointer text-sm hover:text-[#D98C7A] transition-colors">
                    <input 
                      type="checkbox" 
                      checked={selectedSizes.includes(size)}
                      onChange={() => toggleSize(size)}
                      className="w-4 h-4 accent-[#2E2624] cursor-pointer"
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>
          )}

        </aside>

        {/* Right Product Grid */}
        <div className="flex-1 w-full">
          {loading ? (
            <p className="text-center py-20 text-[#6B5F5A] text-xs uppercase tracking-widest">Loading Collection...</p>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white border border-[#F3D9CE]">
              <p className="text-[#6B5F5A] text-xs uppercase tracking-widest mb-4">No pieces match your filters.</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setMaxPrice(150);
                  setSelectedSizes([]);
                }}
                className="text-xs font-bold uppercase tracking-widest text-[#2E2624] underline hover:text-[#D98C7A] cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => {
                const effectivePrice = product.sale_price !== null && product.sale_price > 0 ? product.sale_price : product.price;
                const hasSale = product.sale_price !== null && product.sale_price > 0;
                const isWishlisted = wishlistIds.includes(product.id);
                
                return (
                  <Link 
                    key={product.id} 
                    href={`/product/${product.id}`}
                    className="bg-white border border-[#F3D9CE] block touch-manipulation group relative overflow-hidden cursor-pointer"
                  >
                    <div className="w-full h-[350px] md:h-[400px] bg-[#F3D9CE] relative overflow-hidden">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-[#6B5F5A]">No image</div>
                      )}

                      {hasSale && (
                        <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] uppercase px-3 py-1.5 font-medium z-10 shadow-sm">
                          Sale
                        </span>
                      )}

                      {/* Interactive Wishlist Heart Button */}
                      <button
                        onClick={(e) => toggleWishlist(e, product)}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-[#F3D9CE] flex items-center justify-center hover:bg-white transition-all z-20 shadow-sm cursor-pointer"
                        title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill={isWishlisted ? "#D98C7A" : "none"} 
                          viewBox="0 0 24 24" 
                          strokeWidth={1.5} 
                          stroke="currentColor" 
                          className={`w-4 h-4 transition-colors ${isWishlisted ? "text-[#D98C7A]" : "text-[#2E2624]"}`}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                      </button>

                      {/* Quick Add Overlay Button on Hover */}
                      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/90 backdrop-blur-sm z-20">
                        <button 
                          onClick={(e) => handleQuickAdd(e, product)}
                          className="w-full bg-[#2E2624] text-white py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-[#D98C7A] transition-colors cursor-pointer"
                        >
                          + Quick Add to Bag
                        </button>
                      </div>
                    </div>

                    <div className="p-5 flex justify-between items-start bg-white">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#D98C7A] mb-1.5">{product.category || "Collection"}</p>
                        <h3 className="text-sm font-medium text-[#2E2624]">{product.name}</h3>
                      </div>
                      <div className="text-right pl-4">
                        {hasSale ? (
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-400 line-through">${product.price.toFixed(2)}</span>
                            <span className="text-sm font-bold text-red-600">${effectivePrice.toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className="text-sm font-bold text-[#2E2624]">${effectivePrice.toFixed(2)}</span>
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