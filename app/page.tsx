// app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#2E2624] text-[#FBF3EC] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Editorial Background Image */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>

      <div className="relative z-10 text-center px-6 max-w-3xl flex flex-col items-center">
        {/* Your Uploaded Logo - Cropped to a perfect circle */}
        <Link href="/">
          <img 
            src="/logo.png" 
            alt="Rizk Fashion Logo" 
            className="h-32 w-32 md:h-48 md:w-48 mb-10 object-cover rounded-full shadow-2xl hover:scale-105 transition-transform duration-500" 
          />
        </Link>

        <h1 className="text-3xl md:text-5xl font-serif font-light mb-8 tracking-wide leading-tight drop-shadow-lg">
          The Signature Collection
        </h1>

        <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-12 tracking-wide font-light">
          Welcome to Rizk Fashion. Our aesthetic celebrates the dual nature of modern style—blending the delicate beauty of floral accents with the bold, confident spirit of leopard print styling, all rooted in the enduring strength of the proud Lebanese cedar.
        </p>

        <Link href="/shop" className="inline-block border border-[#FBF3EC] px-12 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#FBF3EC] hover:text-[#2E2624] transition-all duration-500 shadow-lg">
          Enter Boutique
        </Link>
      </div>
    </main>
  );
}