// app/shop/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import Select from "react-select";

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
  "Sale", "Dresses", "Tops & Sweaters", "Shirts", 
  "Coats & Jackets", "Jeans", "Pants", "Skirts", "Shorts", "Sets"
];

const sortOptions = [
  { value: "newest", label: "Newest Arrivals" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" }
];

const boutiqueSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: '#FBF3EC',
    borderColor: state.isFocused ? '#D98C7A' : '#F3D9CE',
    boxShadow: 'none',
    borderRadius: '0',
    minHeight: '42px',
    cursor: 'pointer',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    '&:hover': { borderColor: '#D98C7A' }
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? '#2E2624' : state.isFocused ? '#FBF3EC' : 'white',
    color: state.isSelected ? 'white' : '#2E2624',
    cursor: 'pointer',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    '&:active': { backgroundColor: '#D98C7A' }
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: '0',
    marginTop: '2px',
    border: '1px solid #F3D9CE',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    zIndex: 50
  }),
  singleValue: (base: any) => ({
    ...base,
    color: '#2E2624',
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base: any) => ({
    ...base,
    color: '#6B5F5A',
    padding: '4px',
    '&:hover': { color: '#2E2624' }
  })
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(150);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const { cart, addToCart } = useCart();

  useEffect(() => {
    // 1. Instantly snap to the absolute top
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    
    // 2. Prevent the browser from trying to remember old scroll positions
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // 3. Fire a secondary fallback scroll just in case Next.js tries to pull it down after loading
    const scrollTimer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 100);

    fetchProducts();
    loadWishlist();

    return () => clearTimeout(scrollTimer);
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

  const scrollToProductsOnMobile = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setTimeout(() => {
        document.getElementById("product-grid")?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  };

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

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
    scrollToProductsOnMobile();
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
    scrollToProductsOnMobile();
  };

  const handleSortChange = (option: any) => {
    setSortBy(option.value);
    scrollToProductsOnMobile();
  };

  const availableSizes = Array.from(new Set(
    products.flatMap(p => p.sizes ? p.sizes.split(",").map(s => s.trim()) : [])
  )).filter(Boolean);

  const filteredProducts = products.filter(product => {
    const effectivePrice = product.sale_price !== null && product.sale_price > 0 ? product.sale_price : product.price;
    const hasActiveSale = product.sale_price !== null && product.sale_price > 0;

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = query === "" || 
      product.name.toLowerCase().includes(query) ||
      (product.description && product.description.toLowerCase().includes(query));

    let matchesCategory = true;
    if (selectedCategories.length > 0) {
      matchesCategory = selectedCategories.some(c => {
        if (c === "Sale") return hasActiveSale;
        return product.category?.toLowerCase() === c.toLowerCase();
      });
    }

    const matchesPrice = effectivePrice <= maxPrice;

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
    return 0; 
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

  const FilterForm = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-xs uppercase tracking-widest font-bold border-b border-[#F3D9CE] pb-2">Search & Sort</h3>
        <input 
          type="text"
          placeholder="Search pieces..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 bg-[#FBF3EC] border border-[#F3D9CE] text-sm focus:outline-none focus:border-[#D98C7A]"
        />
        
        <Select
          value={sortOptions.find(o => o.value === sortBy)}
          onChange={handleSortChange}
          options={sortOptions}
          styles={boutiqueSelectStyles}
          isSearchable={false}
          instanceId="sort-dropdown"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-xs uppercase tracking-widest font-bold border-b border-[#F3D9CE] pb-2">Categories</h3>
        <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {CATEGORIES.map(category => (
            <label key={category} className="flex items-center gap-3 cursor-pointer text-sm hover:text-[#D98C7A] transition-colors">
              <input 
                type="checkbox" 
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="w-4 h-4 accent-[#2E2624] cursor-pointer"
              />
              {category}
            </label>
          ))}
        </div>
      </div>

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

      {availableSizes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-widest font-bold border-b border-[#F3D9CE] pb-2">Sizes</h3>
          <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
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
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FBF3EC] text-[#2E2624] pb-20 relative">
      
      <header className="relative w-full h-[60vh] md:h-[85vh] bg-[#2E2624] flex items-center justify-center overflow-hidden mb-6 md:mb-16">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
          alt="Rizk Fashion Editorial" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
        />
        <div className="relative z-10 text-center text-white px-6">
          <p className="text-[10px] md:text-sm tracking-[0.3em] uppercase mb-4 drop-shadow-md">The New Standard</p>
          <h2 className="text-4xl md:text-7xl font-serif font-light tracking-wide mb-6 drop-shadow-lg">
            Curated Elegance.
          </h2>
        </div>
      </header>

      {/* Sticky Mobile Filter Button */}
      <div className="md:hidden sticky top-[80px] z-30 px-6 py-4 bg-[#FBF3EC]/90 backdrop-blur-md border-b border-[#F3D9CE] mb-6 shadow-sm">
        <button 
          onClick={() => setMobileFiltersOpen(true)}
          className="w-full py-3.5 bg-white border border-[#2E2624] text-[#2E2624] text-xs tracking-widest uppercase font-bold flex items-center justify-center gap-2 active:bg-[#F3D9CE] transition-colors cursor-pointer shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
          </svg>
          Filters & Sort
        </button>
      </div>

      <div id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-8 items-start">
        
        {/* Desktop Sidebar (Hidden on Mobile) */}
        <aside className="hidden md:block w-64 flex-shrink-0 sticky top-28 bg-white p-6 border border-[#F3D9CE]">
          <FilterForm />
        </aside>

        {/* Mobile Filter Drawer (Slide-Up) */}
        <div className={`fixed inset-0 z-50 flex flex-col justify-end transition-opacity duration-300 md:hidden ${mobileFiltersOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileFiltersOpen(false)} />
          <div className={`relative bg-white w-full h-[85vh] rounded-t-2xl shadow-2xl flex flex-col z-10 transform-gpu will-change-transform transition-transform duration-300 ease-in-out ${mobileFiltersOpen ? "translate-y-0" : "translate-y-full"}`}>
            <div className="p-5 border-b border-[#F3D9CE] flex justify-between items-center bg-[#FBF3EC] rounded-t-2xl">
              <h2 className="text-sm font-bold tracking-widest uppercase text-[#2E2624]">Filter Collection</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="text-[#6B5F5A] p-2 font-bold text-lg">✕</button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <FilterForm />
            </div>
            <div className="p-5 border-t border-[#F3D9CE] bg-white">
              <button 
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-[#2E2624] text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#D98C7A]"
              >
                Show Results ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>

        {/* Right Product Grid Area (2 Columns on Mobile, 3 on Desktop) */}
        <div id="product-grid" className="flex-1 w-full scroll-mt-[140px]">
          {loading ? (
            <p className="text-center py-20 text-[#6B5F5A] text-xs uppercase tracking-widest">Loading Collection...</p>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white border border-[#F3D9CE] mx-2 md:mx-0">
              <p className="text-[#6B5F5A] text-xs uppercase tracking-widest mb-4">No pieces match your filters.</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategories([]);
                  setMaxPrice(150);
                  setSelectedSizes([]);
                }}
                className="text-xs font-bold uppercase tracking-widest text-[#2E2624] underline cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
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
                    <div className="w-full h-[250px] sm:h-[350px] md:h-[400px] bg-[#F3D9CE] relative overflow-hidden">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-[#6B5F5A]">No image</div>
                      )}

                      {hasSale && (
                        <span className="absolute top-2 left-2 md:top-3 md:left-3 bg-red-600 text-white text-[8px] md:text-[10px] uppercase px-2 py-1 md:px-3 md:py-1.5 font-medium z-10 shadow-sm">
                          Sale
                        </span>
                      )}

                      <button
                        onClick={(e) => toggleWishlist(e, product)}
                        className="absolute top-2 right-2 md:top-3 md:right-3 w-7 h-7 md:w-9 md:h-9 rounded-full bg-white/90 backdrop-blur-sm border border-[#F3D9CE] flex items-center justify-center hover:bg-white transition-all z-20 shadow-sm cursor-pointer"
                        title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill={isWishlisted ? "#D98C7A" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-colors ${isWishlisted ? "text-[#D98C7A]" : "text-[#2E2624]"}`}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                      </button>

                      <div className="hidden md:block absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/90 backdrop-blur-sm z-20">
                        <button 
                          onClick={(e) => handleQuickAdd(e, product)}
                          className="w-full bg-[#2E2624] text-white py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-[#D98C7A] transition-colors cursor-pointer"
                        >
                          + Quick Add
                        </button>
                      </div>
                    </div>

                    <div className="p-3 md:p-5 bg-white">
                      <p className="text-[8px] md:text-[10px] uppercase tracking-wider text-[#D98C7A] mb-1 truncate">{product.category || "Collection"}</p>
                      <h3 className="text-xs md:text-sm font-medium text-[#2E2624] truncate mb-2">{product.name}</h3>
                      
                      <div className="flex justify-between items-end">
                        {hasSale ? (
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 line-through">${product.price.toFixed(2)}</span>
                            <span className="text-xs md:text-sm font-bold text-red-600">${effectivePrice.toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className="text-xs md:text-sm font-bold text-[#2E2624]">${effectivePrice.toFixed(2)}</span>
                        )}
                        
                        <button 
                          onClick={(e) => handleQuickAdd(e, product)}
                          className="md:hidden w-7 h-7 flex items-center justify-center bg-[#FBF3EC] border border-[#F3D9CE] text-[#2E2624] rounded-full active:bg-[#D98C7A] active:text-white"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </button>
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