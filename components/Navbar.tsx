// components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../app/context/CartContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cart, addToCart, removeFromCart } = useCart();

  // Group cart items to handle quantities
  const groupedCart = cart.reduce((acc, item) => {
    const key = `${item.id}-${item.size}-${item.color || 'default'}`;
    if (!acc[key]) {
      acc[key] = { ...item, quantity: 1, key };
    } else {
      acc[key].quantity += 1;
    }
    return acc;
  }, {} as Record<string, any>);
  const cartItems = Object.values(groupedCart);
  
  const cartSubtotal = cart.reduce((total, item) => total + item.price, 0);

  const handleRemoveOne = (targetItem: any) => {
    const index = cart.findIndex(item => item.id === targetItem.id && item.size === targetItem.size && item.color === targetItem.color);
    if (index !== -1) removeFromCart(index);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white">
        <div className="bg-[#D98C7A] text-white py-2 overflow-hidden whitespace-nowrap">
          <div className="animate-marquee text-xs tracking-widest uppercase">
            <span>EXPRESS DELIVERY ACROSS LEBANON &nbsp;•&nbsp; WHISH MONEY & CASH ON DELIVERY &nbsp;•&nbsp; SIGNATURE PACKAGING INCLUDED &nbsp;•&nbsp;&nbsp;</span>
            <span>EXPRESS DELIVERY ACROSS LEBANON &nbsp;•&nbsp; WHISH MONEY & CASH ON DELIVERY &nbsp;•&nbsp; SIGNATURE PACKAGING INCLUDED &nbsp;•&nbsp;&nbsp;</span>
          </div>
        </div>

        {/* Main Navigation Bar with Centered Container */}
        <nav className="w-full bg-white border-b border-[#F3D9CE]">
          <div className="max-w-6xl mx-auto px-6 md:px-8 h-20">
            
            {/* DESKTOP LAYOUT (3-Column Centered Grid) */}
            <div className="hidden md:grid grid-cols-3 items-center h-full w-full">
              <div className="justify-self-start">
                <Link href="/" className="block rounded-full overflow-hidden h-12 w-12 shadow-sm border border-[#F3D9CE] cursor-pointer hover:scale-105 transition-transform">
                  <img src="/logo.png" alt="Rizk" className="h-full w-full object-cover scale-[1.15]" />
                </Link>
              </div>
              
              <div className="justify-self-center flex items-center gap-8 text-xs tracking-widest uppercase font-bold text-[#2E2624]">
                <Link href="/" className="hover:text-[#D98C7A] transition-colors cursor-pointer">Home</Link>
                <Link href="/shop" className="hover:text-[#D98C7A] transition-colors cursor-pointer">Shop</Link>
                <Link href="/category/sale" className="hover:text-red-600 transition-colors cursor-pointer">Sale</Link>
                <a href="https://wa.me/96176380819" target="_blank" rel="noopener noreferrer" className="hover:text-[#D98C7A] transition-colors cursor-pointer">Contact</a>
              </div>
              
              <div className="justify-self-end flex items-center gap-6 text-xs tracking-widest uppercase text-[#6B5F5A]">
                <Link href="/wishlist" className="hover:text-[#2E2624] font-bold transition-colors cursor-pointer">Wishlist</Link>
                <button onClick={() => setCartOpen(true)} className="flex items-center gap-1.5 font-bold text-[#D98C7A] hover:text-[#2E2624] transition-colors cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
                  <span>({cart.length})</span>
                </button>
              </div>
            </div>

            {/* MOBILE LAYOUT */}
            <div className="md:hidden flex justify-between items-center h-full w-full">
              <div className="flex items-center gap-3">
                <button onClick={() => setMenuOpen(true)} className="text-[#2E2624] hover:opacity-75 transition-opacity py-1.5 pr-1.5 -ml-1.5 flex items-center justify-center cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                </button>
                <Link href="/" className="block rounded-full overflow-hidden h-9 w-9 shadow-sm border border-[#F3D9CE] flex-shrink-0 cursor-pointer">
                  <img src="/logo.png" alt="Rizk" className="h-full w-full object-cover scale-[1.15]" />
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/wishlist" className="text-[#2E2624] hover:text-[#D98C7A] transition-colors cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                </Link>
                <button onClick={() => setCartOpen(true)} className="flex items-center gap-1 font-bold text-[#D98C7A] hover:text-[#2E2624] transition-colors cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
                  <span className="text-[11px]">({cart.length})</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Cart Drawer Overlay (GPU Accelerated) */}
      <div className={`fixed inset-0 z-[60] flex justify-end transition-opacity duration-300 ${cartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="fixed inset-0 bg-black/60" onClick={() => setCartOpen(false)} />
        <div className={`relative bg-[#FBF3EC] w-full max-w-md h-full shadow-2xl flex flex-col z-10 transform-gpu will-change-transform transition-transform duration-300 ease-in-out ${cartOpen ? "translate-x-0" : "translate-x-full"}`}>
          
          <div className="p-6 border-b border-[#F3D9CE] flex justify-between items-center bg-white">
            <h2 className="text-xl font-serif text-[#2E2624]">Shopping Bag</h2>
            <button onClick={() => setCartOpen(false)} className="text-[#6B5F5A] hover:text-[#2E2624] p-2 text-xl font-bold cursor-pointer">✕</button>
          </div>

          <div className="p-6 bg-white border-b border-[#F3D9CE] space-y-2">
            <div className="flex justify-between text-sm text-[#6B5F5A]"><span>Subtotal</span><span>${cartSubtotal.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-lg text-[#2E2624] pt-2 border-t border-[#FBF3EC]"><span>Total</span><span>${cartSubtotal.toFixed(2)}</span></div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-[#6B5F5A]">Order Summary</h3>
            {cartItems.length === 0 ? (
              <p className="text-sm text-center text-[#6B5F5A] py-10">Your bag is empty.</p>
            ) : (
              cartItems.map(item => (
                <div key={item.key} className="flex gap-4 bg-white p-3 border border-[#F3D9CE]">
                  <img src={item.image_url} alt={item.name} className="w-20 h-24 object-cover bg-[#F3D9CE]" />
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <p className="text-sm font-medium text-[#2E2624] line-clamp-1">{item.name}</p>
                      <p className="text-[10px] uppercase text-[#6B5F5A] tracking-wider mt-1">Size: {item.size} <span className="mx-1">|</span> {item.color || 'Standard'}</p>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center border border-[#F3D9CE] bg-[#FBF3EC]">
                        <button onClick={() => handleRemoveOne(item)} className="px-3 py-1 text-[#6B5F5A] hover:text-[#2E2624] font-bold cursor-pointer">−</button>
                        <span className="px-3 text-xs font-bold text-[#2E2624] min-w-[2rem] text-center">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="px-3 py-1 text-[#6B5F5A] hover:text-[#2E2624] font-bold cursor-pointer">+</button>
                      </div>
                      <span className="text-sm font-bold text-[#D98C7A]">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 bg-white border-t border-[#F3D9CE]">
            <Link href="/cart" onClick={() => setCartOpen(false)} className={`block w-full text-center py-4 text-xs font-bold uppercase tracking-widest transition-colors shadow-sm ${cartItems.length === 0 ? "bg-gray-300 text-gray-500 pointer-events-none" : "bg-[#2E2624] text-white hover:bg-[#D98C7A]"}`}>
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Navigation (GPU Accelerated) */}
      <div className={`fixed inset-0 z-50 flex transition-opacity duration-300 md:hidden ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="fixed inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
        <div className={`relative bg-[#FBF3EC] w-4/5 max-w-sm h-full shadow-2xl p-8 flex flex-col justify-between border-r border-[#F3D9CE] z-10 transform-gpu will-change-transform transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div>
            <div className="flex justify-between items-center mb-12">
              <span className="text-xs uppercase tracking-[0.2em] font-serif font-bold text-[#2E2624]">Rizk Fashion — RZK</span>
              <button onClick={() => setMenuOpen(false)} className="text-[#2E2624] p-2 hover:opacity-70 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-6 text-lg font-serif tracking-wide text-[#2E2624]">
              <Link href="/" onClick={() => setMenuOpen(false)} className="block hover:text-[#D98C7A]">Home</Link>
              <Link href="/shop" onClick={() => setMenuOpen(false)} className="block hover:text-[#D98C7A]">Shop Collection</Link>
              <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="block hover:text-[#D98C7A]">Wishlist</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}