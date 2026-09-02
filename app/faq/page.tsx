// app/faq/page.tsx
"use client";

import Link from "next/link";

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#FBF3EC] text-[#2E2624] flex flex-col justify-between">
      <div>
        {/* Top Announcement Bar */}
        <div className="bg-[#D98C7A] text-white text-center py-2 text-xs tracking-widest uppercase">
          Express Delivery Across Lebanon • Secure Checkout
        </div>

        {/* Navigation Header */}
        <nav className="flex justify-between items-center px-8 py-6 border-b border-[#F3D9CE]">
          <h1 className="text-2xl font-serif tracking-wider">RIZK FASHION</h1>
          <div className="space-x-6 text-sm tracking-widest uppercase text-[#6B5F5A]">
            <Link href="/" className="hover:text-[#2E2624]">← Back to Shop</Link>
            <Link href="/wishlist" className="hover:text-[#2E2624]">Wishlist</Link>
          </div>
        </nav>

        {/* FAQ Content Container */}
        <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-serif font-light mb-2">Customer Care & FAQ</h2>
            <p className="text-xs text-[#6B5F5A] tracking-widest uppercase">Everything you need to know about ordering with Rizk Fashion</p>
          </div>

          <div className="space-y-8 bg-white p-8 md:p-12 border border-[#F3D9CE] shadow-sm">
            
            <div className="space-y-2">
              <h3 className="font-medium text-[#2E2624] text-sm uppercase tracking-wider">1. How do I place an order?</h3>
              <p className="text-xs text-[#6B5F5A] leading-relaxed">
                Select your preferred size and color on any product page, enter your phone number and delivery address, choose your payment method, and click <strong>"Complete Order via WhatsApp"</strong>. Your order details will automatically populate in a message to our team!
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-[#2E2624] text-sm uppercase tracking-wider">2. What are the delivery charges and timeframes?</h3>
              <p className="text-xs text-[#6B5F5A] leading-relaxed">
                We offer reliable delivery across all regions in Lebanon. A flat delivery fee of <strong>$4.00</strong> applies to all orders, and delivery typically takes between 2 to 4 business days.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-[#2E2624] text-sm uppercase tracking-wider">3. How does Whish Money payment work?</h3>
              <p className="text-xs text-[#6B5F5A] leading-relaxed">
                When selecting Whish Money at checkout, transfer the exact total amount to our designated account number shown on the screen. Once transferred, simply send a screenshot of the receipt via WhatsApp along with your order message.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-[#2E2624] text-sm uppercase tracking-wider">4. Can I exchange or return items?</h3>
              <p className="text-xs text-[#6B5F5A] leading-relaxed">
                We want you to love your pieces. Exchanges for sizing or color adjustments can be coordinated directly via WhatsApp within 48 hours of receiving your delivery, provided the item is unworn with original tags.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Luxury Footer */}
      <footer className="bg-[#2E2624] text-[#FBF3EC] py-12 px-8 border-t border-[#F3D9CE]/20 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-[#FBF3EC]/70 tracking-widest uppercase">
          <p>&copy; {new Date().getFullYear()} Rizk Fashion. Beirut, Lebanon.</p>
          <div className="mt-4 md:mt-0 space-x-6">
            <Link href="/" className="hover:text-white">Shop</Link>
            <Link href="/faq" className="hover:text-white underline">FAQ & Policies</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}