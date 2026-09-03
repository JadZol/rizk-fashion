// app/product/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

type Product = {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  description: string | null;
  image_url: string | null;
  image_urls: string | null;
  sizes: string | null;
  colors: string | null;
  category: string | null;
  stock_status: string | null;
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, cart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      if (!params.id) return;
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error || !data) {
        router.push("/");
      } else {
        setProduct(data);
        setActiveImage(data.image_url || "");
        if (data.sizes) setSelectedSize(data.sizes.split(",")[0].trim());
        if (data.colors) setSelectedColor(data.colors.split(",")[0].trim());

        const saved = localStorage.getItem("rizk_wishlist");
        if (saved) {
          const list: Product[] = JSON.parse(saved);
          setIsWishlisted(list.some(item => item.id === data.id));
        }
      }
      setLoading(false);
    }
    fetchProduct();
  }, [params.id, router]);

  if (loading) return <p className="p-20 text-center text-[#6B5F5A] text-xs uppercase tracking-widest">Loading piece...</p>;
  if (!product) return null;

  const sizeList = product.sizes ? product.sizes.split(",").map(s => s.trim()) : [];
  const colorList = product.colors ? product.colors.split(",").map(c => c.trim()) : [];
  const galleryList = product.image_urls 
    ? product.image_urls.split(",").map(url => url.trim()).filter(Boolean) 
    : product.image_url ? [product.image_url] : [];
  
  const effectivePrice = product.sale_price !== null && product.sale_price > 0 ? product.sale_price : product.price;

  function toggleWishlist() {
    if (!product) return;
    const saved = localStorage.getItem("rizk_wishlist");
    let currentWishlist: Product[] = saved ? JSON.parse(saved) : [];

    if (isWishlisted) {
      currentWishlist = currentWishlist.filter(item => item.id !== product.id);
      setIsWishlisted(false);
    } else {
      currentWishlist.push(product);
      setIsWishlisted(true);
    }
    localStorage.setItem("rizk_wishlist", JSON.stringify(currentWishlist));
  }

  function handleAddToBag() {
    // The TypeScript fix: Guarantee product exists before proceeding
    if (!product) return;

    if (sizeList.length > 0 && !selectedSize) {
      alert("Please select a size.");
      return;
    }
    if (colorList.length > 0 && !selectedColor) {
      alert("Please select a color.");
      return;
    }

    const combinedOptions = [selectedSize, selectedColor].filter(Boolean).join(" / ");

    addToCart({
      id: product.id,
      name: product.name,
      price: effectivePrice,
      image_url: activeImage || product.image_url,
      size: combinedOptions || "One Size"
    });
  }

  return (
    <main className="min-h-screen bg-[#FBF3EC] text-[#2E2624] pb-20">
      <div className="bg-[#D98C7A] text-white text-center py-2 text-xs tracking-widest uppercase">
        Express Delivery Across Lebanon • Secure Checkout
      </div>

      <nav className="flex justify-between items-center px-6 md:px-8 py-6 border-b border-[#F3D9CE]">
        <h1 className="text-xl font-serif">RIZK FASHION</h1>
        <div className="flex gap-6 items-center">
          <Link href="/" className="text-xs uppercase tracking-widest text-[#6B5F5A] hover:text-[#2E2624]">← Shop</Link>
          <Link href="/cart" className="text-xs font-bold tracking-widest uppercase text-[#D98C7A]">
            Bag ({cart.length})
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white p-6 md:p-12 border border-[#F3D9CE] grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          
          <button 
            onClick={toggleWishlist}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center border border-[#F3D9CE] shadow-sm transition-transform hover:scale-105"
          >
            <span className={`text-lg ${isWishlisted ? "text-red-500" : "text-[#6B5F5A]"}`}>
              {isWishlisted ? "♥" : "♡"}
            </span>
          </button>

          <div className="space-y-4">
            <div className="w-full h-[380px] md:h-[480px] bg-[#F3D9CE] overflow-hidden">
              {activeImage ? (
                <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
              ) : null}
            </div>
            {galleryList.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {galleryList.map((imgUrl, idx) => (
                  <button key={idx} onClick={() => setActiveImage(imgUrl)} className={`w-16 h-20 flex-shrink-0 border ${activeImage === imgUrl ? 'border-[#2E2624]' : 'border-[#F3D9CE]'}`}>
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#D98C7A]">{product.category || "Collection"}</span>
              <h1 className="text-2xl md:text-3xl font-serif mt-1 mb-2">{product.name}</h1>
              
              <div className="text-xl font-bold text-[#D98C7A] mb-4">
                {product.sale_price && product.sale_price > 0 ? (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 line-through text-sm">${product.price.toFixed(2)}</span>
                    <span>${effectivePrice.toFixed(2)}</span>
                  </div>
                ) : (
                  <span>${product.price.toFixed(2)}</span>
                )}
              </div>
              
              <p className="text-sm text-[#6B5F5A] mb-6 leading-relaxed">{product.description || "Crafted for the modern wardrobe."}</p>

              {colorList.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs uppercase tracking-wider text-[#6B5F5A] mb-2">Color: {selectedColor}</label>
                  <div className="flex flex-wrap gap-2">
                    {colorList.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-2 text-xs uppercase border transition-colors ${selectedColor === color ? "bg-[#2E2624] text-white border-[#2E2624]" : "bg-white border-[#F3D9CE] hover:border-[#D98C7A]"}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {sizeList.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs uppercase tracking-wider text-[#6B5F5A] mb-2">Size: {selectedSize}</label>
                  <div className="flex flex-wrap gap-2">
                    {sizeList.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-10 h-10 text-xs font-medium border transition-colors ${selectedSize === size ? "bg-[#2E2624] text-white border-[#2E2624]" : "bg-white border-[#F3D9CE] hover:border-[#D98C7A]"}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={handleAddToBag}
              className="w-full bg-[#2E2624] text-white py-4 uppercase tracking-widest text-xs font-bold shadow-sm hover:bg-[#D98C7A] transition-colors"
            >
              Add to Bag
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}