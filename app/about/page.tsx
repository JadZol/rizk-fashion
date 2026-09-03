// app/about/page.tsx
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FBF3EC] text-[#2E2624]">
      <nav className="flex justify-between items-center px-8 py-6 border-b border-[#F3D9CE] bg-white sticky top-0 z-50">
        <Link href="/" className="text-xl font-serif tracking-wider">RIZK FASHION</Link>
        <Link href="/wishlist" className="text-xs tracking-widest uppercase text-[#6B5F5A]">Wishlist</Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-serif mb-8">Our Story</h1>
        <p className="text-sm md:text-base leading-relaxed text-[#6B5F5A] mb-8">
          Founded in the heart of Lebanon, Rizk Fashion (RZK) was born from a passion for curated elegance. 
          We believe that a wardrobe should be a collection of timeless essentials, blending modern aesthetics 
          with classic silhouettes. 
        </p>
        <div className="w-24 h-[1px] bg-[#D98C7A] mx-auto mb-12"></div>
        <h2 className="text-2xl font-serif mb-4">The Signature Style</h2>
        <p className="text-sm text-[#6B5F5A] mb-12">
          Inspired by the bold spirit of leopard prints, the delicate touch of floral accents, and the enduring strength 
          of the Lebanese cedar, our aesthetic reflects the dual nature of modern fashion: strong, proud, and deeply feminine.
        </p>
        <Link href="/" className="inline-block px-8 py-4 bg-[#2E2624] text-white text-xs uppercase tracking-widest hover:bg-[#D98C7A] transition-colors">
          Explore The Collection
        </Link>
      </div>
    </main>
  );
}