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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  
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

        const recentSaved = localStorage.getItem("rizk_recently_viewed");
        let recentList: Product[] = recentSaved ? JSON.parse(recentSaved) : [];
        recentList = recentList.filter(p => p.id !== data.id);
        recentList.unshift(data);
        if (recentList.length > 4) recentList.pop();
        localStorage.setItem("rizk_recently_viewed", JSON.stringify(recentList));
        
        setRecentProducts(recentList.filter(p => p.id !== data.id));
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
      ? `Payment Method: Whish Money\nStatus: Transfer sent to +${momWhishNumber} (Please see attached receipt)`
      : `Payment Method: Cash on Delivery`;

    return (
      `Hello Rizk Fashion! I would like to place an order:\n\n` +
      `Product: ${product.name}\n` +
      `Category: ${product.category || "Collection"}\n` +
      `Size: ${selectedSize}\n` +
      `Color: ${selectedColor}\n\n` +
      `Customer Phone: ${customerPhone || "Not provided"}\n` +
      `Delivery Address: ${customerAddress || "Not provided"}\n\n` +
      `Item Price: $${effectivePrice.toFixed(2)}${product.sale_price ? " (SALE)" : ""}\n` +
      `Delivery Fee: $${deliveryFee.toFixed(2)}\n` +
      `Total Amount: $${totalPrice.toFixed(2)}\n\n` +
      `Product Photo URL: ${activeImage || product.image_url || "N/A"}\n\n` +
      `${paymentDetails}\n\n` +
      `Please confirm my order and arrange delivery!`
    );
  }

  function handleWhatsAppOrder() {
    if (!customerPhone || !customerAddress) {
      alert("Please enter your phone number and delivery address before ordering.");
      return;
    }

    setShowSuccessBanner(true);
    setTimeout(() => setShowSuccessBanner(false), 4000);

    const message = encodeURIComponent(getOrderMessageText());
    window.open(`https://wa.me/${momWhatsAppNumber}?text=${message}`, "_blank");
  }

  function handleCopyOrder() {
    if (!customerPhone || !customerAddress) {
      alert("Please enter your phone number and delivery address before copying.");
      return;
    }
    navigator.clipboard.writeText(getOrderMessageText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function handleShareProduct() {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  }

  return (
    <main className="min-h-screen bg-[#FBF3EC] text-[#2E2624]">
      
      {/* Top Announcement Bar */}
      <div className="bg-[#D98C7A] text-white text-center py-2 text-xs tracking-widest uppercase">
        Express Delivery Across Lebanon • Secure Checkout
      </div>

      {/* On-Screen Success Notification Banner */}
      {showSuccessBanner && (
        <div className="bg-[#2E2624] text-white text-center py-3 text-xs tracking-widest uppercase transition-all shadow-md animate-fade-in">
          ✓ Order successfully prepared! Redirecting to WhatsApp...
        </div>
      )}

      {/* Navigation Header */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-[#F3D9CE]">
        <h1 className="text-2xl font-serif tracking-wider">RIZK FASHION</h1>
        <div className="space-x-6 text-sm tracking-widest uppercase text-[#6B5F5A]">
          <Link href="/" className="hover:text-[#2E2624]">← Back to Shop</Link>
          <Link href="/wishlist" className="hover:text-[#2E2624]">Wishlist</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white p-8 md:p-12 border border-[#F3D9CE] grid grid-cols-1 md:grid-cols-2 gap-12 shadow-sm relative">
          
          {/* Wishlist Button */}
          <button 
            onClick={toggleWishlist}
            className="absolute top-6 right-6 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center border border-[#F3D9CE] hover:scale-110 transition-transform shadow-sm"
            title="Save to Wishlist"
          >
            <span className={`text-lg ${isWishlisted ? "text-red-500" : "text-[#6B5F5A]"}`}>
              {isWishlisted ? "♥" : "♡"}
            </span>
          </button>

          {/* Product Image Gallery Section */}
          <div className="space-y-4">
            <div 
              onClick={() => setIsModalOpen(true)}
              className="w-full h-[480px] bg-[#F3D9CE] overflow-hidden cursor-zoom-in relative group"
            >
              {activeImage ? (
                <img src={activeImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#6B5F5A]">No image available</div>
              )}
              <div className="absolute bottom-4 right-4 bg-black/60 text-white text-[10px] uppercase tracking-widest px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to Zoom
              </div>
            </div>

            {/* Thumbnail Row */}
            {galleryList.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {galleryList.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-20 h-24 bg-[#F3D9CE] flex-shrink-0 overflow-hidden border-2 transition-all ${
                      activeImage === imgUrl ? "border-[#2E2624]" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Checkout Options */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#D98C7A] font-medium">{product.category || "Collection"}</span>
              <h1 className="text-3xl font-light mt-1 mb-2 font-serif">{product.name}</h1>
              
              <div className="flex items-center space-x-3 mb-3">
                {product.sale_price !== null && product.sale_price > 0 ? (
                  <>
                    <span className="text-xl text-gray-400 line-through">${product.price.toFixed(2)}</span>
                    <span className="text-2xl font-bold text-red-600">${product.sale_price.toFixed(2)}</span>
                    <span className="bg-red-100 text-red-600 text-[10px] uppercase tracking-widest px-2 py-0.5 font-medium">Sale Price</span>
                  </>
                ) : (
                  <span className="text-2xl text-[#D98C7A] font-medium">${product.price.toFixed(2)}</span>
                )}
              </div>

              {/* Stock Urgency Badge */}
              <div className="mb-4">
                <span className="inline-block bg-[#FBF3EC] border border-[#D98C7A]/40 text-[#2E2624] text-[11px] tracking-wider uppercase px-3 py-1 font-medium">
                  ⚡ {product.stock_status || "In Stock — Ready for Express Delivery"}
                </span>
              </div>

              <p className="text-sm text-[#6B5F5A] leading-relaxed mb-6 border-b border-[#F3D9CE] pb-4">
                {product.description || "Crafted for the modern wardrobe — elegant and effortless."}
              </p>
            
              {/* Color Selection */}
              {colorList.length > 0 && (
                <div className="mb-5">
                  <label className="block text-xs uppercase tracking-wider text-[#6B5F5A] mb-2">
                    Color: <span className="font-medium text-[#2E2624]">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colorList.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 text-xs uppercase tracking-wider border transition-all ${
                          selectedColor === color 
                            ? "border-[#2E2624] bg-[#2E2624] text-white" 
                            : "border-[#F3D9CE] text-[#2E2624] hover:border-[#D98C7A]"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {sizeList.length > 0 && (
                <div className="mb-5">
                  <label className="block text-xs uppercase tracking-wider text-[#6B5F5A] mb-2">
                    Size: <span className="font-medium text-[#2E2624]">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sizeList.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 flex items-center justify-center text-sm font-medium border transition-all ${
                          selectedSize === size 
                            ? "border-[#2E2624] bg-[#2E2624] text-white" 
                            : "border-[#F3D9CE] text-[#2E2624] hover:border-[#D98C7A]"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Contact & Delivery Address Inputs */}
              <div className="space-y-4 mb-6 border-t border-[#F3D9CE] pt-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#6B5F5A] mb-1">Phone Number *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. 70123456"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#F3D9CE] text-sm focus:outline-none focus:border-[#D98C7A]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#6B5F5A] mb-1">Delivery Address (City, Street, Building) *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Beirut, Hamra Street, Building X"
                    value={customerAddress}
                    onChange={e => setCustomerAddress(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#F3D9CE] text-sm focus:outline-none focus:border-[#D98C7A]"
                  />
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-xs uppercase tracking-wider text-[#6B5F5A] mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Cash on Delivery")}
                    className={`p-3 text-xs uppercase tracking-wider border text-center transition-all ${
                      paymentMethod === "Cash on Delivery"
                        ? "border-[#2E2624] bg-[#2E2624] text-white"
                        : "border-[#F3D9CE] text-[#2E2624] bg-white hover:border-[#D98C7A]"
                    }`}
                  >
                    Cash on Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Whish Money")}
                    className={`p-3 text-xs uppercase tracking-wider border text-center transition-all ${
                      paymentMethod === "Whish Money"
                        ? "border-[#2E2624] bg-[#2E2624] text-white"
                        : "border-[#F3D9CE] text-[#2E2624] bg-white hover:border-[#D98C7A]"
                    }`}
                  >
                    Whish Money
                  </button>
                </div>

                {/* Dynamic Whish Transfer Instruction Box */}
                {paymentMethod === "Whish Money" && (
                  <div className="bg-[#FBF3EC] p-3 border border-[#D98C7A] text-xs text-[#2E2624] space-y-1">
                    <p className="font-medium">Whish Transfer Instructions:</p>
                    <p className="text-[#6B5F5A]">Please transfer <span className="font-bold text-[#2E2624]">${totalPrice.toFixed(2)}</span> to Whish Account: <span className="font-bold text-[#D98C7A]">+{momWhishNumber}</span>, then send the receipt via WhatsApp.</p>
                  </div>
                )}
              </div>

              {/* Price Breakdown Summary Box */}
              <div className="bg-[#FBF3EC] p-4 border border-[#F3D9CE] text-xs space-y-2 mb-6">
                <div className="flex justify-between text-[#6B5F5A]">
                  <span>Item Subtotal:</span>
                  <span>${effectivePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#6B5F5A]">
                  <span>Delivery Charge (Lebanon):</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-[#F3D9CE] pt-2 flex justify-between font-medium text-[#2E2624] text-sm">
                  <span>Total Amount:</span>
                  <span className="text-[#D98C7A]">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Actions */}
            <div className="space-y-3">
              <button 
                onClick={handleWhatsAppOrder}
                className="w-full bg-[#25D366] text-white py-4 uppercase tracking-widest text-sm hover:bg-[#20ba5a] transition-colors font-medium flex items-center justify-center space-x-2 shadow-sm"
              >
                <span>Complete Order via WhatsApp</span>
              </button>

              <button 
                onClick={handleCopyOrder}
                className="w-full bg-white text-[#2E2624] py-3 uppercase tracking-widest text-xs border border-[#F3D9CE] hover:border-[#2E2624] transition-colors font-medium"
              >
                {copied ? "✓ Order Summary Copied!" : "Copy Order Summary Text"}
              </button>

              <button 
                onClick={handleShareProduct}
                className="w-full bg-white text-[#2E2624] py-3 uppercase tracking-widest text-xs border border-[#F3D9CE] hover:border-[#2E2624] transition-colors font-medium"
              >
                {shareCopied ? "✓ Product Link Copied!" : "Share this Piece"}
              </button>
            </div>

          </div>
        </div>

        {/* Recently Viewed Section */}
        {recentProducts.length > 0 && (
          <div className="mt-20">
            <h3 className="text-xl font-serif text-[#2E2624] mb-6 text-center tracking-wider">Recently Viewed</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recentProducts.map(item => (
                <Link 
                  key={item.id} 
                  href={`/product/${item.id}`}
                  className="bg-white border border-[#F3D9CE] overflow-hidden group block hover:shadow-md transition-all"
                >
                  <div className="w-full h-72 bg-[#F3D9CE] overflow-hidden">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-[#6B5F5A]">{item.name}</div>
                    )}
                  </div>
                  <div className="p-4 flex justify-between items-center bg-white">
                    <h4 className="text-xs font-medium text-[#2E2624] truncate">{item.name}</h4>
                    <span className="text-xs text-[#D98C7A] font-medium">${(item.sale_price ?? item.price).toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {isModalOpen && activeImage && (
        <div 
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img src={activeImage} alt={product.name} className="max-w-full max-h-[90vh] object-contain mx-auto" />
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white text-xl bg-black/50 w-10 h-10 rounded-full flex items-center justify-center hover:bg-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </main>
  );
}