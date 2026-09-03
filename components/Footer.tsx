// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#2E2624] text-white py-16 px-8 mt-20 border-t border-[#483C32]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <h3 className="text-lg font-serif tracking-wide">RIZK FASHION</h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            Curated elegance and timeless wardrobe essentials. Proudly serving Lebanon with premium boutique fashion.
          </p>
        </div>

        <div className="space-y-3 text-xs tracking-widest uppercase">
          <p className="text-[#D98C7A] font-bold mb-1">Customer Care</p>
          <Link href="/shop" className="block text-gray-300 hover:text-white transition-colors">Shipping & Delivery</Link>
          <Link href="/shop" className="block text-gray-300 hover:text-white transition-colors">Payment Methods</Link>
          <Link href="/shop" className="block text-gray-300 hover:text-white transition-colors">Returns & Exchanges</Link>
        </div>

        <div className="space-y-3 text-xs tracking-widest uppercase">
          <p className="text-[#D98C7A] font-bold mb-1">Contact Info</p>
          <a href="tel:+96176380819" className="block text-gray-300 hover:text-white transition-colors">+961 76 380 819</a>
          <a href="mailto:rizkfashion82@gmail.com" className="block text-gray-300 hover:text-white transition-colors">rizkfashion82@gmail.com</a>
          <p className="text-gray-400 normal-case">Lebanon — Online Only</p>
        </div>

        <div className="space-y-3 text-xs tracking-widest uppercase">
          <p className="text-[#D98C7A] font-bold mb-1">Connect</p>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="block text-gray-300 hover:text-white transition-colors">Instagram</a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="block text-gray-300 hover:text-white transition-colors">Facebook</a>
          <a href="https://wa.me/96176380819" target="_blank" rel="noreferrer" className="block text-gray-300 hover:text-white transition-colors">WhatsApp</a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-gray-700 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-xs tracking-widest text-gray-400">
        <p>© 2026 RIZK FASHION. All Rights Reserved.</p>
        <p className="mt-2 md:mt-0">Online Boutique Experience</p>
      </div>
    </footer>
  );
}