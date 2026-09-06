// app/cart/page.tsx
"use client";

import { useCart } from "../context/CartContext";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

type Country = {
  name: string;
  code: string;
  dial: string;
  flag: string;
};

const COUNTRIES: Country[] = [
  { name: "Lebanon", code: "LB", dial: "+961", flag: "🇱🇧" },
  { name: "United Arab Emirates", code: "AE", dial: "+971", flag: "🇦🇪" },
  { name: "Saudi Arabia", code: "SA", dial: "+966", flag: "🇸🇦" },
  { name: "Qatar", code: "QA", dial: "+974", flag: "🇶🇦" },
  { name: "Kuwait", code: "KW", dial: "+965", flag: "🇰🇼" },
  { name: "Bahrain", code: "BH", dial: "+973", flag: "🇧🇭" },
  { name: "Oman", code: "OM", dial: "+968", flag: "🇴🇲" },
  { name: "Jordan", code: "JO", dial: "+962", flag: "🇯🇴" },
  { name: "Egypt", code: "EG", dial: "+20", flag: "🇪🇬" },
  { name: "Iraq", code: "IQ", dial: "+964", flag: "🇮🇶" },
  { name: "Palestine", code: "PS", dial: "+970", flag: "🇵🇸" },
  { name: "Syria", code: "SY", dial: "+963", flag: "🇸🇾" },
  { name: "United States", code: "US", dial: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", dial: "+44", flag: "🇬🇧" },
  { name: "France", code: "FR", dial: "+33", flag: "🇫🇷" },
  { name: "Germany", code: "DE", dial: "+49", flag: "🇩🇪" },
  { name: "Canada", code: "CA", dial: "+1", flag: "🇨🇦" },
  { name: "Australia", code: "AU", dial: "+61", flag: "🇦🇺" },
  { name: "Italy", code: "IT", dial: "+39", flag: "🇮🇹" },
  { name: "Spain", code: "ES", dial: "+34", flag: "🇪🇸" },
  { name: "Turkey", code: "TR", dial: "+90", flag: "🇹🇷" },
  { name: "Switzerland", code: "CH", dial: "+41", flag: "🇨🇭" },
  { name: "Sweden", code: "SE", dial: "+46", flag: "🇸🇪" },
  { name: "Netherlands", code: "NL", dial: "+31", flag: "🇳🇱" },
  { name: "Belgium", code: "BE", dial: "+32", flag: "🇧🇪" },
  { name: "Austria", code: "AT", dial: "+43", flag: "🇦🇹" },
  { name: "Brazil", code: "BR", dial: "+55", flag: "🇧🇷" },
  { name: "India", code: "IN", dial: "+91", flag: "🇮🇳" },
  { name: "Japan", code: "JP", dial: "+81", flag: "🇯🇵" },
  { name: "South Korea", code: "KR", dial: "+82", flag: "🇰🇷" },
  { name: "China", code: "CN", dial: "+86", flag: "🇨🇳" },
];

export default function CartPage() {
  const { cart, removeFromCart, updateItemSize, updateItemColor, cartTotal } = useCart();
  
  const [fullName, setFullName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]); // Default to Lebanon
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  // Searchable Dropdown States
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const deliveryFee = 4.00;
  const finalTotal = cartTotal + deliveryFee;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.dial.includes(searchQuery) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleWhatsAppCheckout = () => {
    if (!fullName || !phone || !address) {
      alert("Please fill in your name, phone number, and address.");
      return;
    }

    const cleanedPhone = phone.replace(/[\s\-\(\)]/g, "").replace(/^0+/, "");

    if (cleanedPhone.length < 6) {
      alert("Please enter a valid phone number.");
      return;
    }

    const fullPhoneNumber = `${selectedCountry.dial} ${cleanedPhone}`;

    let message = `Hello Rizk Fashion! I would like to place an order.\n\n`;
    message += `*Customer Details:*\nName: ${fullName}\nPhone: ${fullPhoneNumber}\nAddress: ${address}\nPayment: ${paymentMethod}\n\n`;
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
                <div key={index} className="flex gap-6 bg-white p-4 border border-[#F3D9CE] items-center">
                  <Link href={`/product/${item.id}`} className="w-24 h-32 bg-[#F3D9CE] flex-shrink-0 block relative group">
                    {item.image_url && <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />}
                  </Link>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <Link href={`/product/${item.id}`} className="font-medium text-sm hover:text-[#D98C7A] transition-colors block">
                        {item.name}
                      </Link>
                      
                      {/* Interactive Size & Color Dropdowns using index */}
                      <div className="flex flex-wrap items-center gap-4 mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#6B5F5A] uppercase tracking-wider">Size:</span>
                          <select 
                            value={item.size} 
                            onChange={(e) => updateItemSize(index, e.target.value)}
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
                            onChange={(e) => updateItemColor(index, e.target.value)}
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
                      <button onClick={() => removeFromCart(index)} className="text-xs text-red-600 uppercase tracking-widest hover:underline">
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
              
              {/* Searchable Country Code & Phone Input */}
              <div className="flex border border-[#F3D9CE] focus-within:border-[#D98C7A] bg-white relative" ref={dropdownRef}>
                {/* Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="bg-[#FBF3EC] text-[#2E2624] px-3 py-3 text-xs border-r border-[#F3D9CE] flex items-center gap-1.5 focus:outline-none cursor-pointer flex-shrink-0"
                >
                  <span>{selectedCountry.flag}</span>
                  <span className="font-semibold">{selectedCountry.dial}</span>
                  <span className="text-[10px]">▼</span>
                </button>

                {/* Searchable Dropdown Popup */}
                {isDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1 w-72 bg-white border border-[#F3D9CE] shadow-xl z-50 max-h-64 flex flex-col">
                    <div className="p-2 border-b border-[#F3D9CE] bg-[#FBF3EC]">
                      <input 
                        type="text" 
                        placeholder="Search country or code..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 text-xs border border-[#F3D9CE] bg-white focus:outline-none"
                        autoFocus
                      />
                    </div>
                    <div className="overflow-y-auto flex-1">
                      {filteredCountries.length === 0 ? (
                        <div className="p-3 text-xs text-gray-500 text-center">No country found</div>
                      ) : (
                        filteredCountries.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              setSelectedCountry(c);
                              setIsDropdownOpen(false);
                              setSearchQuery("");
                            }}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-[#FBF3EC] flex items-center justify-between transition-colors border-b border-gray-50"
                          >
                            <span className="flex items-center gap-2">
                              <span>{c.flag}</span>
                              <span className="font-medium text-[#2E2624]">{c.name}</span>
                            </span>
                            <span className="text-[#6B5F5A] font-mono">{c.dial}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}

                <input 
                  type="tel" 
                  placeholder="70 123 456" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="w-full p-3 text-sm focus:outline-none bg-transparent" 
                />
              </div>

              <input type="text" placeholder="Delivery Address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-[#F3D9CE] p-3 text-sm focus:outline-none focus:border-[#D98C7A]" />
              
              {/* Payment Method Selector */}
              <div className="relative">
                <select 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)} 
                  className="w-full border border-[#F3D9CE] p-3 pr-10 text-sm bg-white text-[#2E2624] focus:outline-none appearance-none rounded-none cursor-pointer"
                >
                  <option value="Cash on Delivery">Cash on Delivery</option>
                  <option value="Whish Money">Whish Money</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B5F5A]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
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