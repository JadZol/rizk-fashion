// app/faq/page.tsx
"use client";

import Link from "next/link";

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#FBF3EC] text-[#2E2624]">
      {/* Navigation Header (Sticky like the Category Pages) */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-[#F3D9CE] bg-white sticky top-0 z-50">
        <Link href="/" className="text-xl font-serif tracking-wider">RIZK FASHION</Link>
        <Link href="/wishlist" className="text-xs tracking-widest uppercase text-[#6B5F5A]">Wishlist</Link>
      </nav>

      {/* FAQ Content Container */}
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
            <h2 className="font-medium text-[#2E2624] text-sm uppercase tracking-wider">5. How will my order be packaged?</h2>
            <p className="text-sm text-[#6B5F5A] leading-relaxed">
              Every order is carefully wrapped in our signature RZK boutique packaging. We designed our bags to reflect our brand identity, featuring a blend of classic floral accents, bold leopard print styling, and the proud Lebanese cedar emblem, ensuring your unboxing experience is as elegant as the pieces inside.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}