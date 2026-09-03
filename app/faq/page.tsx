// app/faq/page.tsx
"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function FAQPage() {
  const { cart } = useCart();

  return (
    <main className="min-h-screen bg-[#FBF3EC] text-[#2E2624]">
      <nav className="flex justify-between items-center px-8 py-6 border-b border-[#F3D9CE] bg-white sticky top-0 z-50">
        <Link href="/" className="text-xl font-serif tracking-wider">RIZK FASHION</Link>
        <div className="flex gap-6 items-center">
          <Link href="/wishlist" className="text-xs tracking-widest uppercase text-[#6B5F5A] hover:text-[#2E2624]">Wishlist</Link>
          <Link href="/cart" className="flex items-center gap-1.5 font-bold text-[#D98C7A] hover:text-[#2E2624] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <span className="text-xs uppercase tracking-widest">({cart.length})</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-light mb-4">Customer Care & FAQ</h1>
          <p className="text-xs text-[#6B5F5A] tracking-widest uppercase">Everything you need to know about ordering with Rizk Fashion</p>
        </div>

        <div className="space-y-8 bg-white p-8 md:p-12 border border-[#F3D9CE] shadow-sm">
          
          <div className="space-y-2">
            <h2 className="font-medium text-[#2E2624] text-sm uppercase tracking-wider">1. How do I place an order?</h2>
            <p className="text-sm text-[#6B5F5A] leading-relaxed">
              Select your preferred size and color on any product page, enter your phone number and delivery address, choose your payment method, and click <strong>"Complete Order via WhatsApp"</strong>. Your order details will automatically populate in a message to our team!
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-medium text-[#2E2624] text-sm uppercase tracking-wider">2. What are the delivery charges and timeframes?</h2>
            <p className="text-sm text-[#6B5F5A] leading-relaxed">
              We offer reliable delivery across all regions in Lebanon. A flat delivery fee of <strong>$4.00</strong> applies to all orders, and delivery typically takes between 2 to 4 business days.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-medium text-[#2E2624] text-sm uppercase tracking-wider">3. How does Whish Money payment work?</h2>
            <p className="text-sm text-[#6B5F5A] leading-relaxed">
              When selecting Whish Money at checkout, transfer the exact total amount to our designated account number shown on the screen. Once transferred, simply send a screenshot of the receipt via WhatsApp along with your order message.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-medium text-[#2E2624] text-sm uppercase tracking-wider">4. Can I exchange or return items?</h2>
            <p className="text-sm text-[#6B5F5A] leading-relaxed">
              We want you to love your pieces. Exchanges for sizing or color adjustments can be coordinated directly via WhatsApp within 48 hours of receiving your delivery, provided the item is unworn with original tags.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-medium text-[#2E2624] text-sm uppercase tracking-wider">5. What is your cancellation policy?</h2>
            <p className="text-sm text-[#6B5F5A] leading-relaxed">
              To ensure rapid processing and delivery, <strong>once an order is confirmed, there is no cancellation</strong>. Please review your cart carefully before completing your order via WhatsApp.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-medium text-[#2E2624] text-sm uppercase tracking-wider">6. How will my order be packaged?</h2>
            <p className="text-sm text-[#6B5F5A] leading-relaxed">
              Every order is carefully wrapped in our signature RZK boutique packaging. We designed our bags to reflect our brand identity, featuring a blend of classic floral accents, bold leopard print styling, and the proud Lebanese cedar emblem, ensuring your unboxing experience is as elegant as the pieces inside.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}