// components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../app/context/CartContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useCart();

  return (
    <>
      <nav className="flex justify-between items-center px-6 md:px-8 py-6 bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-[#F3D9CE]">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMenuOpen(true)}
            className="text-[#2E2624] hover:opacity-70 transition-opacity p-1"
            aria-label="Open Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <Link href="/" className="block rounded-full overflow-hidden h-10 w-10 md:h-12 md:w-12 shadow-sm border border-[#F3D9CE]">
            <img src="/logo.png" alt="Rizk" className="h-full w-full object-cover scale-[1.15]" />
          </Link>
        </div>

        <div className="flex gap-6 items-center text-xs tracking-widest uppercase text-[#6B5F5A]">
          <Link href="/shop" className="hover:text-[#2E2624] hidden sm:inline">Shop</Link>
          <Link href="/wishlist" className="hover:text-[#2E2624]">Wishlist</Link>
          <Link href="/cart" className="flex items-center gap-1.5 font-bold text-[#D98C7A] hover:text-[#2E2624]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <span>({cart.length})</span>
          </Link>
        </div>
      </nav>

      {/* Slide-out Mobile Menu Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-start transition-opacity">
          <div className="bg-[#FBF3EC] w-4/5 max-w-sm h-full shadow-2xl p-8 flex flex-col justify-between border-r border-[#F3D9CE]">
            <div>
              <div className="flex justify-between items-center mb-12">
                <span className="text-xs uppercase tracking-[0.2em] font-serif font-bold text-[#2E2624]">Rizk Fashion — RZK</span>
                <button onClick={() => setMenuOpen(false)} className="text-[#2E2624] p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-6 text-lg font-serif tracking-wide text-[#2E2624]">
                <Link href="/" onClick={() => setMenuOpen(false)} className="block hover:text-[#D98C7A]">Home</Link>
                <Link href="/shop" onClick={() => setMenuOpen(false)} className="block hover:text-[#D98C7A]">Shop Collection</Link>
                <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="block hover:text-[#D98C7A]">Wishlist</Link>
                <Link href="/cart" onClick={() => setMenuOpen(false)} className="block hover:text-[#D98C7A]">Shopping Bag ({cart.length})</Link>
              </div>
            </div>
            <div className="pt-8 border-t border-[#F3D9CE] space-y-2 text-xs text-[#6B5F5A]">
              <p>rizkfashion82@gmail.com</p>
              <p>+961 76 380 819</p>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMenuOpen(false)} />
        </div>
      )}
    </>
  );
}