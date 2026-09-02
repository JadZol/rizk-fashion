// app/product/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

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
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [activeImage, setActiveImage] = useState("");

  const deliveryFee = 4.00;
  const momWhatsAppNumber = process.env.NEXT_PUBLIC_MOM_WHATSAPP || "96176380819";
  const momWhishNumber = process.env.NEXT_PUBLIC_MOM_WHISH || "96176380819";

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

  if (loading) return <p className="p-20 text-center text-[#6B5F5A]">Loading piece...</p>;
  if (!product) return null;

  const sizeList = product.sizes ? product.sizes.split(",").map(s => s.trim()) : [];
  const colorList = product.colors ? product.colors.split(",").map(c => c.trim()) : [];
  const galleryList = product.image_urls 
    ? product.image_urls.split(",").map(url => url.trim()).filter(Boolean) 
    : product.image_url ? [product.image_url] : [];
  
  const effectivePrice = product.sale_price !== null && product.sale_price > 0 ? product.sale_price : product.price;
  const totalPrice = effectivePrice + deliveryFee;

  function toggleWishlist() {
    if (!product) return;
    const saved = localStorage.getItem("rizk_wishlist");
    let currentWishlist: Product[] = saved ? JSON.parse(saved) : [];

    if (isWishlisted) {
      currentWishlist = currentWishlist.filter(item => item.id !== product?.id);
      setIsWishlisted(false);
    } else {
      currentWishlist.push(product);
      setIsWishlisted(true);
    }
    localStorage.setItem("rizk_wishlist", JSON.stringify(currentWishlist));
  }

  function getOrderMessageText() {
    if (!product) return "";
    const paymentDetails = paymentMethod === "Whish Money" 
      ? `Payment Method: Whish Money\nStatus: Transfer sent to +${momWhishNumber}`
      : `Payment Method: Cash on Delivery`;

    const pageUrl = typeof window !== "undefined" ? window.location.href : "";

    return (
      `Hello Rizk Fashion! I would like to place an order:\n\n` +
      `Product Name: ${product.name}\n` +
      `Category: ${product.category || "Collection"}\n` +
      `Size: ${selectedSize}\n` +
      `Color: ${selectedColor}\n\n` +
      `Customer Phone: ${customerPhone}\n` +
      `Delivery Address: ${customerAddress}\n\n` +
      `Total Amount: $${totalPrice.toFixed(2)}\n\n` +
      `Product Image URL: ${activeImage || product.image_url || "N/A"}\n` +
      `Page Link: ${pageUrl}\n\n` +
      `${paymentDetails}`
    );
  }

  function handleWhatsAppOrder() {
    if (!customerPhone || !customerAddress) {
      alert("Please enter your phone number and delivery address before ordering.");
      return;
    }
    setShowSuccessBanner(true);
    const message = encodeURIComponent(getOrderMessageText());
    
    setTimeout(() => {
      window.location.href = `https://wa.me/${momWhatsAppNumber}?text=${message}`;
    }, 400);
  }

  return (
    <main className="min-h-screen bg-[#FBF3EC] text-[#2E2624] pb-20">
      <div className="bg-[#D98C7A] text-white text-center py-2 text-xs tracking-widest uppercase">
        Express Delivery Across Lebanon • Secure Checkout
      </div>

      {showSuccessBanner && (
        <div className="bg-[#2E2624] text-white text-center py-3 text-xs uppercase shadow-md">
          ✓ Redirecting to WhatsApp...
        </div>
      )}

      <nav className="flex justify-between items-center px-6 md:px-8 py-6 border-b border-[#F3D9CE]">
        <h1 className="text-xl font-serif">RIZK FASHION</h1>
        <Link href="/" className="text-xs uppercase tracking-widest text-[#6B5F5A]">← Back to Shop</Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white p-6 md:p-12 border border-[#F3D9CE] grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          
          <button 
            onClick={toggleWishlist}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center border border-[#F3D9CE]"
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
                  <button key={idx} onClick={() => setActiveImage(imgUrl)} className="w-16 h-20 flex-shrink-0 border">
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
              <p className="text-xl font-bold text-[#D98C7A] mb-4">${effectivePrice.toFixed(2)}</p>
              <p className="text-sm text-[#6B5F5A] mb-6">{product.description || "Crafted for the modern wardrobe."}</p>

              {colorList.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs uppercase tracking-wider text-[#6B5F5A] mb-2">Color: {selectedColor}</label>
                  <div className="flex flex-wrap gap-2">
                    {colorList.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-2 text-xs uppercase border ${selectedColor === color ? "bg-[#2E2624] text-white" : "bg-white"}`}
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
                        className={`w-10 h-10 text-xs font-medium border ${selectedSize === size ? "bg-[#2E2624] text-white" : "bg-white"}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-4 border-t border-[#F3D9CE]">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#6B5F5A] mb-1">Phone Number *</label>
                  <input 
                    type="tel"
                    required
                    placeholder="e.g. 70123456"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[#F3D9CE] text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#6B5F5A] mb-1">Delivery Address *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Beirut, Hamra"
                    value={customerAddress}
                    onChange={e => setCustomerAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[#F3D9CE] text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs uppercase tracking-wider text-[#6B5F5A] mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Cash on Delivery")}
                    className={`p-2.5 text-xs uppercase border ${paymentMethod === "Cash on Delivery" ? "bg-[#2E2624] text-white" : "bg-white"}`}
                  >
                    Cash on Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Whish Money")}
                    className={`p-2.5 text-xs uppercase border ${paymentMethod === "Whish Money" ? "bg-[#2E2624] text-white" : "bg-white"}`}
                  >
                    Whish Money
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={handleWhatsAppOrder}
              className="w-full bg-[#25D366] text-white py-4 uppercase tracking-widest text-sm font-medium shadow-sm active:bg-[#20ba5a]"
            >
              Complete Order via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}