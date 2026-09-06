// components/Footer.tsx
"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#2E2624] text-[#FBF3EC] pt-20 pb-12 border-t border-[#F3D9CE]/20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-[#F3D9CE]/20">
        
        {/* Brand Statement */}
        <div className="space-y-4 md:col-span-1">
          <h3 className="font-serif text-2xl tracking-wide">Rizk Fashion</h3>
          <p className="text-xs uppercase tracking-[0.2em] text-[#D98C7A]">RZK Boutique</p>
          <p className="text-xs text-[#FBF3EC]/70 leading-relaxed font-light">
            Timeless elegance and modern sophistication, curated exclusively for the modern woman. Designed in Lebanon.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.25em] text-[#D98C7A] font-bold">Navigation</p>
          <ul className="space-y-2.5 text-xs tracking-widest uppercase text-[#FBF3EC]/80 font-light">
            <li><Link href="/shop" className="hover:text-white transition-colors">Shop Collection</Link></li>
            <li><Link href="/wishlist" className="hover:text-white transition-colors">My Wishlist</Link></li>
            <li><Link href="/cart" className="hover:text-white transition-colors">Shopping Bag</Link></li>
          </ul>
        </div>

        {/* Client Care & Payment */}
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.25em] text-[#D98C7A] font-bold">Client Care</p>
          <ul className="space-y-2.5 text-xs text-[#FBF3EC]/80 font-light leading-relaxed">
            <li>Express Delivery Across Lebanon</li>
            <li>Whish Money & Cash on Delivery</li>
            <li>Signature Gift Packaging Included</li>
          </ul>
        </div>

        {/* Concierge & Contact */}
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.25em] text-[#D98C7A] font-bold">Concierge</p>
          <div className="space-y-2 text-xs text-[#FBF3EC]/80 font-light">
            <p>Beirut, Lebanon</p>
            <p>
              <a href="mailto:rizkfashion82@gmail.com" className="hover:text-white underline underline-offset-4 transition-colors">
                rizkfashion82@gmail.com
              </a>
            </p>
            <p>
              <a href="https://wa.me/96176380819" target="_blank" rel="noopener noreferrer" className="hover:text-white underline underline-offset-4 transition-colors">
                +961 76 380 819
              </a>
            </p>
          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.25em] text-[#FBF3EC]/50">
        <p>© {new Date().getFullYear()} Rizk Fashion (RZK). All rights reserved.</p>
        <p className="mt-4 md:mt-0 font-serif lowercase tracking-normal text-xs text-[#D98C7A]">timeless elegance.</p>
      </div>
    </footer>
  );
}