// components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../app/context/CartContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { cart } = useCart();

  useEffect(() => {
    if (menuOpen) {
      setMounted(true);
    }
  }, [menuOpen]);

  const handleClose = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-[#F3D9CE]">
        {/* Scrolling Announcement Ticker */}
        <div className="bg-[#D98C7A] text-white py-2 overflow-hidden whitespace-nowrap">
          <div className="animate-marquee text-xs tracking-widest uppercase">
            <span>EXPRESS DELIVERY ACROSS LEBANON &nbsp;•&nbsp; WHISH MONEY & CASH ON DELIVERY &nbsp;•&nbsp; SIGNATURE PACKAGING INCLUDED &nbsp;•&nbsp;&nbsp;</span>
            <span>EXPRESS DELIVERY ACROSS LEBANON &nbsp;•&nbsp; WHISH MONEY & CASH ON DELIVERY &nbsp;•&nbsp; SIGNATURE PACKAGING INCLUDED &nbsp;•&nbsp;&nbsp;</span>
          </div>
        </div>

        {/* Main Single Navigation Bar */}
        <nav className="flex justify-between items-center px-6 md:px-8 py-4 bg-white">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMenuOpen(true)}
              className="text-[#2E2624] hover:opacity-75 transition-opacity p-1.5 flex items-center justify-center"
              aria-label="Open Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            <Link href="/" className="block rounded-full overflow-hidden h-10 w-10 md:h-12 md:w-12 shadow-sm border border-[#F3D9CE] flex-shrink-0">
              <img src="/logo.png" alt="Rizk" className="h-full w-full object-cover scale-[1.15]" />
            </Link>
          </div>

          <div className="flex gap-6 items-center text-xs tracking-widest uppercase text-[#6B5F5A]">
            <Link href="/shop" className="hover:text-[#2E2624] transition-colors hidden sm:inline">Shop</Link>
            <Link href="/wishlist" className="hover:text-[#2E2624] transition-colors">Wishlist</Link>
            <Link href="/cart" className="flex items-center gap-1.5 font-bold text-[#D98C7A] hover:text-[#2E2624] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <span>({cart.length})</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Smooth Animated Slide-out Menu Drawer */}
      {mounted && (
        <div className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          {/* Backdrop Fade */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={handleClose} 
          />

          {/* Sliding Drawer Panel */}
          <div className={`relative bg-[#FBF3EC] w-4/5 max-w-sm h-full shadow-2xl p-8 flex flex-col justify-between border-r border-[#F3D9CE] z-10 transition-transform duration-300 ease-out ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div>
              <div className="flex justify-between items-center mb-12">
                <span className="text-xs uppercase tracking-[0.2em] font-serif font-bold text-[#2E2624]">Rizk Fashion — RZK</span>
                <button 
                  onClick={handleClose} 
                  className="text-[#2E2624] p-2 hover:opacity-70 transition-opacity"
                  aria-label="Close Menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6 text-lg font-serif tracking-wide text-[#2E2624]">
                <Link href="/" onClick={handleClose} className="block hover:text-[#D98C7A] transition-colors">Home</Link>
                <Link href="/shop" onClick={handleClose} className="block hover:text-[#D98C7A] transition-colors">Shop Collection</Link>
                <Link href="/wishlist" onClick={handleClose} className="block hover:text-[#D98C7A] transition-colors">Wishlist</Link>
                <Link href="/cart" onClick={handleClose} className="block hover:text-[#D98C7A] transition-colors">Shopping Bag ({cart.length})</Link>
              </div>
            </div>

            <div className="pt-8 border-t border-[#F3D9CE] space-y-2 text-xs text-[#6B5F5A]">
              <p>rizkfashion82@gmail.com</p>
              <p>+961 76 380 819</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}