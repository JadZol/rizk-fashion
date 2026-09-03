// app/cart/page.tsx
"use client";

import { useCart } from "../context/CartContext";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, updateItemSize, updateItemColor, cartTotal } = useCart();
  
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  const deliveryFee = 4.00;
  const finalTotal = cartTotal + deliveryFee;

  const handleWhatsAppCheckout = () => {
    if (!fullName || !phone || !address) {
      alert("Please fill in your name, phone number, and address.");
      return;
    }

    let message = `Hello Rizk Fashion! I would like to place an order.\n\n`;
    message += `*Customer Details:*\nName: ${fullName}\nPhone: ${phone}\nAddress: ${address}\nPayment: ${paymentMethod}\n\n`;
    message += `*Order Details:*\n`;

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (Color: ${item.color || "Standard"}, Size: ${item.size}) - $${item.price.toFixed(2)}\n`;
      message += `    Link: ${baseUrl}/product/${item.id}\n`;
    });

    message += `\nSubtotal: $${cartTotal.toFixed(2)}`;
    message += `\nDelivery: $${deliveryFee.toFixed(2)}`;
    message += `\n*Total: $${finalTotal.toFixed(2)}*\n\nPlease confirm my order!`;

    const encodedMessage = encodeURIComponent(message);
    const storePhoneNumber = "96176380819"; 
    window.open(`https://wa.me/${storePhoneNumber}?text=${encodedMessage}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-[#FBF3EC] text-[#2E2624] pt-8">
      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
        <div className="flex-1">
          <h1 className="text-3xl font-serif mb-8">Your Shopping Bag</h1>
          
          {cart.length === 0 ? (
            <div className="text-center py-12 bg-white border border-[#F3D9CE]">
              <p className="text-xs uppercase tracking-widest text-[#6B5F5A] mb-4">Your bag is empty.</p>
              <Link href="/shop" className="px-6 py-3 bg-[#2E2624] text-white text-xs uppercase tracking-widest hover:bg-[#D98C7A] transition-colors">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex gap-6 bg-white p-4 border border-[#F3D9CE] items-center">
                  <Link href={`/product/${item.id}`} className="w-24 h-32 bg-[#F3D9CE] flex-shrink-0 block relative group">
                    {item.image_url && <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />}
                  </Link>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <Link href={`/product/${item.id}`} className="font-medium text-sm hover:text-[#D98C7A] transition-colors block">
                        {item.name}
                      </Link>
                      
                      {/* Interactive Size & Color Dropdowns */}
                      <div className="flex flex-wrap items-center gap-4 mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#6B5F5A] uppercase tracking-wider">Size:</span>
                          <select 
                            value={item.size} 
                            onChange={(e) => updateItemSize(item.id, item.size, e.target.value)}
                            className="border border-[#F3D9CE] bg-[#FBF3EC] text-xs px-2 py-1 text-[#2E2624] focus:outline-none"
                          >
                            {["XXS", "XS", "S", "M", "L", "XL", "XXL", "One Size"].map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#6B5F5A] uppercase tracking-wider">Color:</span>
                          <select 
                            value={item.color || "Black"} 
                            onChange={(e) => updateItemColor(item.id, item.size, item.color || "", e.target.value)}
                            className="border border-[#F3D9CE] bg-[#FBF3EC] text-xs px-2 py-1 text-[#2E2624] focus:outline-none"
                          >
                            {["Black", "White", "Cream", "Beige", "Champagne", "Emerald", "Burgundy", "Navy", "Red", "Pink", "Grey"].map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <span className="font-bold text-[#D98C7A]">${item.price.toFixed(2)}</span>
                      <button onClick={() => removeFromCart(item.id, item.size)} className="text-xs text-red-600 uppercase tracking-widest hover:underline">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="w-full md:w-96 bg-white border border-[#F3D9CE] p-8 h-fit">
            <h2 className="text-lg font-serif mb-6 border-b border-[#F3D9CE] pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border border-[#F3D9CE] p-3 text-sm focus:outline-none focus:border-[#D98C7A]" />
              <input type="tel" placeholder="Phone Number (e.g. 70 123 456)" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-[#F3D9CE] p-3 text-sm focus:outline-none focus:border-[#D98C7A]" />
              <input type="text" placeholder="Delivery Address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-[#F3D9CE] p-3 text-sm focus:outline-none focus:border-[#D98C7A]" />
              
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full border border-[#F3D9CE] p-3 text-sm text-[#6B5F5A] focus:outline-none">
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="Whish Money">Whish Money</option>
              </select>
            </div>

            <div className="border-t border-[#F3D9CE] pt-4 space-y-2 mb-6">
              <div className="flex justify-between text-sm text-[#6B5F5A]">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-[#6B5F5A]">
                <span>Delivery</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-[#2E2624] pt-2">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={handleWhatsAppCheckout} className="w-full bg-[#25D366] text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#1DA851] transition-colors shadow-sm">
              Checkout via WhatsApp
            </button>
          </div>
        )}
      </div>
    </main>
  );
}