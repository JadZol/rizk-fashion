// app/product/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useCart } from "../../../app/context/CartContext";

type Product = {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  description: string | null;
  image_url: string | null;
  image_urls: string | null;
  category: string | null;
  sizes: string | null;
  colors: string | null;
  stock_status: string | null;
};

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("S");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [addedNotification, setAddedNotification] = useState(false);

  const { cart, addToCart } = useCart();

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  async function fetchProduct() {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      setProduct(data);
      if (data.image_url) setSelectedImage(data.image_url);
      if (data.sizes) setSelectedSize(data.sizes.split(",")[0].trim());
      if (data.colors) setSelectedColor(data.colors.split(",")[0].trim());
    }
    setLoading(false);
  }

  const galleryImages = product?.image_urls 
    ? product.image_urls.split(",").map(url => url.trim()).filter(Boolean)
    : product?.image_url ? [product.image_url] : [];

  const colorsList = product?.colors ? product.colors.split(",").map(c => c.trim()) : [];

  function handleThumbnailClick(imgUrl: string, index: number) {
    setSelectedImage(imgUrl);
    if (colorsList.length > index) {
      setSelectedColor(colorsList[index]);
    }
  }

  function handleColorSelect(colorName: string, index: number) {
    setSelectedColor(colorName);
    if (galleryImages.length > index) {
      setSelectedImage(galleryImages[index]);
    }
  }

  function handleAddToCart() {
    if (!product) return;
    const effectivePrice = product.sale_price !== null && product.sale_price > 0 ? product.sale_price : product.price;
    
    addToCart({
      id: product.id,
      name: `${product.name} (${selectedColor || "Standard"} / ${selectedSize})`,
      price: effectivePrice,
      image_url: selectedImage || product.image_url,
      size: selectedSize
    });

    setAddedNotification(true);
    setTimeout(() => setAddedNotification(false), 3000);
  }

  function toggleWishlist() {
    if (!product) return;
    const saved = localStorage.getItem("rizk_wishlist");
    let wishlist: Product[] = saved ? JSON.parse(saved) : [];
    
    const exists = wishlist.some(item => item.id === product.id);
    if (exists) {
      wishlist = wishlist.filter(item => item.id !== product.id);
    } else {
      wishlist.push(product);
    }
    localStorage.setItem("rizk_wishlist", JSON.stringify(wishlist));
    alert(exists ? "Removed from wishlist" : "Added to wishlist!");
  }

  if (loading) {
    return <div className="min-h-screen bg-[#FBF3EC] flex items-center justify-center text-xs uppercase tracking-widest text-[#6B5F5A]">Loading piece...</div>;
  }

  if (!product) {
    return <div className="min-h-screen bg-[#FBF3EC] flex items-center justify-center text-xs uppercase tracking-widest text-[#6B5F5A]">Piece not found.</div>;
  }

  const effectivePrice = product.sale_price !== null && product.sale_price > 0 ? product.sale_price : product.price;
  const hasSale = product.sale_price !== null && product.sale_price > 0;
  const sizesList = product.sizes ? product.sizes.split(",").map(s => s.trim()) : [];

  const whatsappMessage = encodeURIComponent(`Hi Rizk Fashion, I have a question regarding fit/sizing for the "${product.name}" piece.`);
  const whatsappUrl = `https://wa.me/96176380819?text=${whatsappMessage}`;

  return (
    <main className="min-h-screen bg-[#FBF3EC] text-[#2E2624] pb-20 relative">
      <div className="bg-[#D98C7A] text-white text-center py-2 text-xs tracking-widest uppercase">
        Express Delivery Across Lebanon • Whish Money & Cash on Delivery
      </div>

      <nav className="flex justify-between items-center px-8 py-6 border-b border-[#F3D9CE] bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="block rounded-full overflow-hidden h-10 w-10 md:h-12 md:w-12 shadow-sm border border-[#F3D9CE]">
          <img src="/logo.png" alt="Rizk" className="h-full w-full object-cover scale-[1.15]" />
        </Link>
        <div className="flex gap-6 items-center text-xs tracking-widest uppercase text-[#6B5F5A]">
          <Link href="/shop" className="hover:text-[#2E2624]">Shop</Link>
          <Link href="/wishlist" className="hover:text-[#2E2624]">Wishlist</Link>
          <Link href="/cart" className="flex items-center gap-1.5 font-bold text-[#D98C7A] hover:text-[#2E2624]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <span>({cart.length})</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Gallery Section */}
        <div className="space-y-4">
          <div className="w-full h-[600px] bg-[#F3D9CE] overflow-hidden relative border border-[#F3D9CE]">
            {selectedImage ? (
              <img src={selectedImage} alt={product.name} className="w-full h-full object-cover transition-all duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#6B5F5A]">No image available</div>
            )}
            {hasSale && (
              <span className="absolute top-4 left-4 bg-red-600 text-white text-xs uppercase px-3 py-1 font-medium shadow-sm">
                Sale
              </span>
            )}
          </div>

          {galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {galleryImages.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(imgUrl, index)}
                  className={`w-20 h-24 flex-shrink-0 border-2 overflow-hidden transition-all ${
                    selectedImage === imgUrl ? "border-[#2E2624] scale-105" : "border-[#F3D9CE] opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info & Options */}
        <div className="space-y-8 bg-white p-8 border border-[#F3D9CE] shadow-sm relative">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#D98C7A] mb-2">{product.category || "Collection"}</p>
            <h1 className="text-3xl font-serif font-light text-[#2E2624] mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-3">
              {hasSale ? (
                <>
                  <span className="text-lg text-gray-400 line-through">${product.price.toFixed(2)}</span>
                  <span className="text-2xl font-bold text-red-600">${effectivePrice.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-2xl font-bold text-[#2E2624]">${effectivePrice.toFixed(2)}</span>
              )}
            </div>
            {product.stock_status && (
              <div className="inline-block bg-[#FBF3EC] border border-[#D98C7A]/40 px-3 py-1 text-[11px] uppercase tracking-wider text-[#2E2624] font-medium">
                ⚡ {product.stock_status}
              </div>
            )}
          </div>

          <p className="text-xs text-[#6B5F5A] leading-relaxed">
            {product.description || "Crafted with signature boutique styling, combining timeless elegance with modern comfort."}
          </p>

          {sizesList.length > 0 && (
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold mb-3 text-[#2E2624]">Select Size</label>
              <div className="flex flex-wrap gap-3">
                {sizesList.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 text-xs tracking-wider border transition-all font-medium ${
                      selectedSize === size ? "bg-[#2E2624] text-white border-[#2E2624]" : "bg-white text-[#2E2624] border-[#F3D9CE]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {colorsList.length > 0 && (
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold mb-3 text-[#2E2624]">
                Select Color: <span className="font-normal text-[#D98C7A]">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {colorsList.map((colorName, index) => {
                  const isSelected = selectedColor === colorName;
                  return (
                    <button
                      key={colorName}
                      onClick={() => handleColorSelect(colorName, index)}
                      title={colorName}
                      className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                        isSelected ? "border-[#2E2624] scale-110 shadow-md ring-2 ring-[#2E2624]/20" : "border-gray-300 hover:border-gray-500"
                      }`}
                      style={{ backgroundColor: colorName.toLowerCase() }}
                    >
                      {isSelected && (
                        <span className={`text-[10px] font-bold ${["white", "rose", "beige", "silver", "gold", "yellow"].includes(colorName.toLowerCase()) ? "text-black" : "text-white"}`}>
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-3 pt-4 border-t border-[#F3D9CE]">
            <button onClick={handleAddToCart} className="w-full bg-[#2E2624] text-white py-4 text-xs uppercase tracking-widest font-bold hover:bg-[#D98C7A] transition-colors shadow-sm">
              Add to Bag
            </button>
            <button onClick={toggleWishlist} className="w-full border border-[#2E2624] text-[#2E2624] py-3 text-xs uppercase tracking-widest font-bold hover:bg-[#F3D9CE]/30 transition-colors">
              Save to Wishlist
            </button>
          </div>

          <div className="bg-[#FBF3EC] p-4 border border-[#F3D9CE] flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[11px] uppercase tracking-wider font-bold text-[#2E2624]">Need Fit Advice?</p>
              <p className="text-[10px] text-[#6B5F5A]">Chat directly with our boutique stylist about measurements.</p>
            </div>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="bg-[#2E2624] text-white px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-[#D98C7A] transition-colors flex items-center gap-1.5 flex-shrink-0">
              Ask Stylist
            </a>
          </div>

          {addedNotification && (
            <div className="bg-[#D98C7A]/10 border border-[#D98C7A] text-[#2E2624] p-3 text-center text-xs tracking-wider uppercase">
              Added to your bag with {selectedColor} / {selectedSize}!
            </div>
          )}
        </div>
      </div>
    </main>
  );
}