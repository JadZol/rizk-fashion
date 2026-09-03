// app/cart/page.tsx
"use client";

import { useCart } from "../context/CartContext";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, cartTotal } = useCart();
  
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

    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (Size: ${item.size}) - $${item.price.toFixed(2)}\n`;
      if (item.image_url) {
        message += `   Image: ${item.image_url}\n`;
      }
    });

    message += `\nSubtotal: $${cartTotal.toFixed(2)}`;
    message += `\nDelivery: $${deliveryFee.toFixed(2)}`;
    message += `\n*Total: $${finalTotal.toFixed(2)}*\n\nPlease confirm my order!`;

    const encodedMessage = encodeURIComponent(message);
    const storePhoneNumber = "96176380819"; 
    window.open(`https://wa.me/${storePhoneNumber}?text=${encodedMessage}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-[#FBF3EC] text-[#2E2624]">
      <nav className="flex justify-between items-center px-8 py-6 border-b border-[#F3D9CE] bg-white sticky top-0 z-50">
        <Link href="/" className="text-xl font-serif tracking-wider">RIZK FASHION</Link>
        
        <Link href="/cart" className="flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-[#D98C7A] hover:text-[#2E2624] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <span>({cart.length})</span>
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
        <div className="flex-1">
          <h1 className="text-3xl font-serif mb-8">Your Shopping Bag</h1>
          
          {cart.length === 0 ? (
            <div className="text-center py-12 bg-white border border-[#F3D9CE]">
              <p className="text-xs uppercase tracking-widest text-[#6B5F5A] mb-4">Your bag is empty.</p>
              <Link href="/" className="px-6 py-3 bg-[#2E2624] text-white text-xs uppercase tracking-widest hover:bg-[#D98C7A] transition-colors">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex gap-6 bg-white p-4 border border-[#F3D9CE]">
                  <div className="w-24 h-32 bg-[#F3D9CE] flex-shrink-0">
                    {item.image_url && <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-xs text-[#6B5F5A] mt-1 uppercase tracking-wider">Size: {item.size}</p>
                    </div>
                    <div className="flex justify-between items-center">
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