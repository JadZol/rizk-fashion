// app/cart/page.tsx
"use client";

import { useCart } from "../context/CartContext";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Select from "react-select";

type Country = {
  name: string;
  code: string;
  dial: string;
  flag: string;
  minDigits: number;
  maxDigits: number;
  example: string;
};

const COUNTRIES: Country[] = [
  { name: "Lebanon", code: "LB", dial: "+961", flag: "🇱🇧", minDigits: 7, maxDigits: 8, example: "70123456" },
  { name: "Italy", code: "IT", dial: "+39", flag: "🇮🇹", minDigits: 9, maxDigits: 11, example: "3123456789" },
  { name: "United Arab Emirates", code: "AE", dial: "+971", flag: "🇦🇪", minDigits: 9, maxDigits: 9, example: "501234567" },
  { name: "Saudi Arabia", code: "SA", dial: "+966", flag: "🇸🇦", minDigits: 9, maxDigits: 9, example: "501234567" },
  { name: "Qatar", code: "QA", dial: "+974", flag: "🇶🇦", minDigits: 8, maxDigits: 8, example: "55123456" },
  { name: "Kuwait", code: "KW", dial: "+965", flag: "🇰🇼", minDigits: 8, maxDigits: 8, example: "99123456" },
  { name: "Bahrain", code: "BH", dial: "+973", flag: "🇧🇭", minDigits: 8, maxDigits: 8, example: "39123456" },
  { name: "Oman", code: "OM", dial: "+968", flag: "🇴🇲", minDigits: 8, maxDigits: 8, example: "91234567" },
  { name: "Jordan", code: "JO", dial: "+962", flag: "🇯🇴", minDigits: 9, maxDigits: 9, example: "791234567" },
  { name: "Egypt", code: "EG", dial: "+20", flag: "🇪🇬", minDigits: 10, maxDigits: 10, example: "1012345678" },
  { name: "Iraq", code: "IQ", dial: "+964", flag: "🇮🇶", minDigits: 10, maxDigits: 10, example: "7912345678" },
  { name: "Palestine", code: "PS", dial: "+970", flag: "🇵🇸", minDigits: 9, maxDigits: 9, example: "591234567" },
  { name: "Syria", code: "SY", dial: "+963", flag: "🇸🇾", minDigits: 9, maxDigits: 9, example: "941234567" },
  { name: "United States", code: "US", dial: "+1", flag: "🇺🇸", minDigits: 10, maxDigits: 10, example: "4155552671" },
  { name: "United Kingdom", code: "GB", dial: "+44", flag: "🇬🇧", minDigits: 10, maxDigits: 10, example: "7911123456" },
  { name: "France", code: "FR", dial: "+33", flag: "🇫🇷", minDigits: 9, maxDigits: 9, example: "612345678" },
  { name: "Germany", code: "DE", dial: "+49", flag: "🇩🇪", minDigits: 10, maxDigits: 11, example: "15123456789" },
  { name: "Canada", code: "CA", dial: "+1", flag: "🇨🇦", minDigits: 10, maxDigits: 10, example: "4165552671" },
  { name: "Australia", code: "AU", dial: "+61", flag: "🇦🇺", minDigits: 9, maxDigits: 9, example: "412345678" },
  { name: "Turkey", code: "TR", dial: "+90", flag: "🇹🇷", minDigits: 10, maxDigits: 10, example: "5123456789" },
];

const sizeOptions = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "One Size"].map(s => ({ value: s, label: s }));
const colorOptions = ["Black", "White", "Cream", "Beige", "Champagne", "Emerald", "Burgundy", "Navy", "Red", "Pink", "Grey"].map(c => ({ value: c, label: c }));
const paymentOptions = [
  { value: "Cash on Delivery", label: "Cash on Delivery" },
  { value: "Whish Money", label: "Whish Money" }
];

const inlineSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: '#FBF3EC',
    borderColor: state.isFocused ? '#D98C7A' : '#F3D9CE',
    boxShadow: 'none',
    borderRadius: '0',
    minHeight: '28px',
    cursor: 'pointer',
    fontSize: '11px',
    '&:hover': { borderColor: '#D98C7A' }
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? '#2E2624' : state.isFocused ? '#FBF3EC' : 'white',
    color: state.isSelected ? 'white' : '#2E2624',
    cursor: 'pointer',
    fontSize: '11px',
    '&:active': { backgroundColor: '#D98C7A' }
  }),
  menu: (base: any) => ({ ...base, borderRadius: '0', marginTop: '2px', zIndex: 50 }),
  dropdownIndicator: (base: any) => ({ ...base, color: '#6B5F5A', padding: '2px', '&:hover': { color: '#2E2624' } }),
  indicatorSeparator: () => ({ display: 'none' })
};

const paymentSelectStyles = {
  ...inlineSelectStyles,
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: 'white',
    borderColor: state.isFocused ? '#D98C7A' : '#F3D9CE',
    boxShadow: 'none',
    borderRadius: '0',
    minHeight: '44px',
    cursor: 'pointer',
    fontSize: '14px',
    paddingLeft: '4px'
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? '#2E2624' : state.isFocused ? '#FBF3EC' : 'white',
    color: state.isSelected ? 'white' : '#2E2624',
    cursor: 'pointer',
    fontSize: '13px',
  })
};

export default function CartPage() {
  const { cart, removeFromCart, updateItemSize, updateItemColor, cartTotal } = useCart();
  
  const [fullName, setFullName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const deliveryFee = 4.00;
  const finalTotal = cartTotal > 0 ? cartTotal + deliveryFee : 0;

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

  const generateWhatsAppUrl = () => {
    const cleanedPhone = phone.replace(/[\s\-\(\)]/g, "").replace(/^0+/, "");
    const fullPhoneNumber = `${selectedCountry.dial} ${cleanedPhone}`;

    let message = `Hello Rizk Fashion! I would like to place an order.\n\n`;
    message += `*Customer Details:*\nName: ${fullName}\nPhone: ${fullPhoneNumber}\nAddress: ${address}\nPayment: ${paymentMethod.value}\n\n`;
    message += `*Order Details:*\n`;

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (Color: ${item.color || "Standard"}, Size: ${item.size}) - $${item.price.toFixed(2)}\n`;
      message += `    Link: ${baseUrl}/product/${item.id}\n`;
    });

    message += `\nSubtotal: $${cartTotal.toFixed(2)}`;
    message += `\nDelivery: $${deliveryFee.toFixed(2)}`;
    message += `\n*Total: $${finalTotal.toFixed(2)}*\n\nPlease confirm my order!`;

    return `https://wa.me/96176380819?text=${encodeURIComponent(message)}`;
  };

  const handleCheckoutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!fullName || !phone || !address) {
      e.preventDefault();
      alert("Please fill in your name, phone number, and address.");
      return;
    }

    const cleanedPhone = phone.replace(/[\s\-\(\)]/g, "").replace(/^0+/, "");

    if (cleanedPhone.length < selectedCountry.minDigits || cleanedPhone.length > selectedCountry.maxDigits) {
      e.preventDefault();
      alert(`Invalid phone number for ${selectedCountry.name}. Expected length between ${selectedCountry.minDigits} and ${selectedCountry.maxDigits} digits (e.g. ${selectedCountry.example}).`);
      return;
    }
  };

  return (
    <main className="min-h-screen bg-[#FBF3EC] text-[#2E2624] pt-8">
      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
        <div className="flex-1">
          <h1 className="text-3xl font-serif mb-8">Your Shopping Bag</h1>
          
          {cart.length === 0 ? (
            <div className="text-center py-12 bg-white border border-[#F3D9CE]">
              <p className="text-xs uppercase tracking-widest text-[#6B5F5A] mb-4">Your bag is empty.</p>
              <Link href="/shop" className="px-6 py-3 bg-[#2E2624] text-white text-xs uppercase tracking-widest hover:bg-[#D98C7A] transition-colors inline-block">
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
                      <Link href={`/product/${item.id}`} className="font-medium text-sm hover:text-[#D98C7A] transition-colors block mb-3">
                        {item.name}
                      </Link>
                      
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <span className="text-[10px] text-[#6B5F5A] uppercase tracking-wider">Size:</span>
                          <div className="flex-1">
                            <Select 
                              value={{ value: item.size, label: item.size }}
                              onChange={(opt: any) => updateItemSize(index, opt.value)}
                              options={sizeOptions}
                              styles={inlineSelectStyles}
                              isSearchable={false}
                              instanceId={`size-${index}`}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 min-w-[120px]">
                          <span className="text-[10px] text-[#6B5F5A] uppercase tracking-wider">Color:</span>
                          <div className="flex-1">
                            <Select 
                              value={{ value: item.color || "Black", label: item.color || "Black" }}
                              onChange={(opt: any) => updateItemColor(index, opt.value)}
                              options={colorOptions}
                              styles={inlineSelectStyles}
                              isSearchable={false}
                              instanceId={`color-${index}`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <span className="font-bold text-[#D98C7A]">${item.price.toFixed(2)}</span>
                      <button onClick={() => removeFromCart(index)} className="text-xs text-red-600 uppercase tracking-widest hover:underline cursor-pointer">
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
              
              <div className="flex border border-[#F3D9CE] focus-within:border-[#D98C7A] bg-white relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="bg-[#FBF3EC] text-[#2E2624] px-3 py-3 text-xs border-r border-[#F3D9CE] flex items-center gap-1.5 focus:outline-none cursor-pointer flex-shrink-0"
                >
                  <span>{selectedCountry.flag}</span>
                  <span className="font-semibold">{selectedCountry.dial}</span>
                  <span className="text-[10px]">▼</span>
                </button>

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
                    <div className="overflow-y-auto flex-1 custom-scrollbar">
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
                  placeholder={selectedCountry.example} 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="w-full p-3 text-sm focus:outline-none bg-transparent" 
                />
              </div>

              <input type="text" placeholder="Delivery Address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-[#F3D9CE] p-3 text-sm focus:outline-none focus:border-[#D98C7A]" />
              
              <div className="relative z-10">
                <Select
                  value={paymentMethod}
                  onChange={(option: any) => setPaymentMethod(option)}
                  options={paymentOptions}
                  styles={paymentSelectStyles}
                  isSearchable={false}
                  instanceId="payment-dropdown"
                />
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

            <a 
              href={generateWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCheckoutClick}
              className="block text-center w-full bg-[#25D366] text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#1DA851] transition-colors shadow-sm"
            >
              Checkout via WhatsApp
            </a>
          </div>
        )}
      </div>
    </main>
  );
}