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
  image_url: string | null;
  sizes: string | null;
  colors: string | null;
  category: string | null;
  created_at: string;
};

const categories = [
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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchProducts();

    const saved = localStorage.getItem("rizk_wishlist");
    if (saved) {
      try {
        const parsed: Product[] = JSON.parse(saved);
        setWishlistIds(parsed.map(p => p.id));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  function toggleWishlist(product: Product, e: React.MouseEvent) {
    e.preventDefault();
    const saved = localStorage.getItem("rizk_wishlist");
    let currentWishlist: Product[] = saved ? JSON.parse(saved) : [];

    if (wishlistIds.includes(product.id)) {
      currentWishlist = currentWishlist.filter(p => p.id !== product.id);
      setWishlistIds(wishlistIds.filter(id => id !== product.id));
    } else {
      currentWishlist.push(product);
      setWishlistIds([...wishlistIds, product.id]);
    }
    localStorage.setItem("rizk_wishlist", JSON.stringify(currentWishlist));
  }

  const getCategoryCount = (cat: string) => {
    if (cat === "All") return products.length;
    if (cat === "Sale") return products.filter(p => p.sale_price !== null && p.sale_price > 0).length;
    return products.filter(p => p.category === cat).length;
  };

  // Smart Multi-Word Search Engine (e.g., "white jeans")
  const filteredProducts = products.filter(p => {
    let matchesCategory = true;
    if (selectedCategory === "Sale") {
      matchesCategory = p.sale_price !== null && p.sale_price > 0;
    } else if (selectedCategory !== "All") {
      matchesCategory = p.category === selectedCategory;
    }

    const queryWords = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const matchesSearch = queryWords.length === 0 || queryWords.every(word => {
      const inName = p.name.toLowerCase().includes(word);
      const inCategory = p.category ? p.category.toLowerCase().includes(word) : false;
      const inColors = p.colors ? p.colors.toLowerCase().includes(word) : false;
      const inSale = word === "sale" && (p.sale_price !== null && p.sale_price > 0);
      return inName || inCategory || inColors || inSale;
    });

    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.sale_price !== null && a.sale_price > 0 ? a.sale_price : a.price;
    const priceB = b.sale_price !== null && b.sale_price > 0 ? b.sale_price : b.price;

    if (sortBy === "price-asc") return priceA - priceB;
    if (sortBy === "price-desc") return priceB - priceA;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

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
            <Link href="/wishlist" className="hover:text-[#2E2624]">Wishlist ({wishlistIds.length})</Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center py-12 px-4 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-3 font-serif">New Arrivals</h2>
          <p className="text-xs text-[#6B5F5A] tracking-widest uppercase mb-8">Timeless elegance, curated for the modern wardrobe</p>
          
          {/* Search and Sort Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <input 
              type="text" 
              placeholder="Search e.g. 'white jeans' or 'sale'..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full sm:w-80 px-4 py-2.5 bg-white border border-[#F3D9CE] text-sm focus:outline-none focus:border-[#D98C7A]"
            />
            
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <span className="text-xs tracking-wider text-[#6B5F5A] uppercase">Sort by:</span>
              <select 
                value={sortBy} 
                onChange={e => setSortBy(e.target.value)}
                className="px-4 py-2.5 bg-white border border-[#F3D9CE] text-sm focus:outline-none focus:border-[#D98C7A]"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Filter Tabs with Counts */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => {
              const count = getCategoryCount(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs tracking-widest uppercase border transition-all ${
                    selectedCategory === cat
                      ? "bg-[#2E2624] text-white border-[#2E2624]"
                      : cat === "Sale"
                      ? "bg-red-50 text-red-600 border-red-200 hover:border-red-400 font-medium"
                      : "bg-white text-[#6B5F5A] border-[#F3D9CE] hover:border-[#D98C7A]"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          {loading ? (
            <p className="text-center text-[#6B5F5A] py-12 tracking-wider">Loading collection...</p>
          ) : sortedProducts.length === 0 ? (
            <p className="text-center text-[#6B5F5A] py-12 tracking-wider">No products found matching your criteria.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {sortedProducts.map((product) => {
                const isWishlisted = wishlistIds.includes(product.id);
                const hasSale = product.sale_price !== null && product.sale_price > 0;
                return (
                  <Link 
                    key={product.id} 
                    href={`/product/${product.id}`}
                    className="group block bg-white border border-[#F3D9CE] overflow-hidden transition-all hover:shadow-lg relative"
                  >
                    {/* Sale Badge */}
                    {hasSale && (
                      <span className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[10px] tracking-widest uppercase px-2 py-1 font-medium">
                        Sale
                      </span>
                    )}

                    {/* Wishlist Heart Button */}
                    <button
                      onClick={(e) => toggleWishlist(product, e)}
                      className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center border border-[#F3D9CE] hover:scale-110 transition-transform"
                      title="Save to Wishlist"
                    >
                      <span className={`text-base ${isWishlisted ? "text-red-500" : "text-[#6B5F5A]"}`}>
                        {isWishlisted ? "♥" : "♡"}
                      </span>
                    </button>

                    <div className="w-full h-96 bg-[#F3D9CE] overflow-hidden relative">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#6B5F5A] text-sm">
                          {product.name}
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex justify-between items-center bg-white">
                      <div>
                        <h3 className="text-sm font-medium text-[#2E2624] tracking-wide">{product.name}</h3>
                        <p className="text-xs text-[#6B5F5A] mt-1 uppercase tracking-wider">
                          {product.category || "Collection"}
                        </p>
                      </div>
                      <div className="text-right">
                        {hasSale ? (
                          <div>
                            <span className="text-xs text-gray-400 line-through block">${product.price.toFixed(2)}</span>
                            <span className="text-sm font-bold text-red-600">${product.sale_price?.toFixed(2)}</span>
                          </div>
                        ) : (
                          <p className="text-sm font-medium text-[#D98C7A]">${product.price.toFixed(2)}</p>
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

      {/* Luxury Footer with FAQ Link Included */}
      <footer className="bg-[#2E2624] text-[#FBF3EC] py-16 px-8 mt-20 border-t border-[#F3D9CE]/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
          <div>
            <h3 className="font-serif text-lg tracking-widest mb-4">RIZK FASHION</h3>
            <p className="text-[#FBF3EC]/70 leading-relaxed text-xs">
              Exquisite tailoring and contemporary silhouettes designed for the modern wardrobe. Handcrafted excellence delivered across Lebanon.
            </p>
          </div>
          <div>
            <h4 className="uppercase tracking-widest text-xs mb-4 text-[#D98C7A]">Customer Care</h4>
            <ul className="space-y-2 text-xs text-[#FBF3EC]/70">
              <li><Link href="/faq" className="hover:text-white underline">FAQ & Store Policies</Link></li>
              <li>Direct WhatsApp Ordering</li>
              <li>Complimentary Delivery Across Lebanon</li>
            </ul>
          </div>
          <div>
            <h4 className="uppercase tracking-widest text-xs mb-4 text-[#D98C7A]">Boutique Studio</h4>
            <p className="text-xs text-[#FBF3EC]/70 leading-relaxed">
              Managed exclusively via Rizk Fashion Digital Platform.<br />
              Beirut, Lebanon
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-xs text-[#FBF3EC]/50 tracking-widest uppercase">
          &copy; {new Date().getFullYear()} Rizk Fashion. All Rights Reserved.
        </div>
      </footer>

    </main>
  );
}