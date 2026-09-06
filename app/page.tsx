// app/page.tsx
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Define your featured categories for the homepage carousel
const FEATURED_CATEGORIES = [
  {
    name: "Dresses",
    slug: "dresses",
    // Replace with your own image URL later
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1983&auto=format&fit=crop",
  },
  {
    name: "Sets",
    slug: "sets",
    image: "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=1974&auto=format&fit=crop",
  },
  {
    name: "Shirts",
    slug: "shirts",
    image: "https://images.unsplash.com/photo-1596755094514-f87e32f85e23?q=80&w=1987&auto=format&fit=crop",
  },
  {
    name: "Shorts",
    slug: "shorts",
    image: "https://images.unsplash.com/photo-1591369822096-bbc142d1eb1c?q=80&w=1974&auto=format&fit=crop",
  },
  {
    name: "Coats & Jackets",
    slug: "coats-&-jackets",
    image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=1974&auto=format&fit=crop",
  }
];

export default function Home() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const collectionRef = useRef<HTMLElement>(null);
  const router = useRouter();

  const handleExploreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsTransitioning(true);

    setTimeout(() => {
      router.push("/shop#catalog");
    }, 400);
  };

  return (
    <main className="min-h-screen bg-[#FBF3EC] text-[#2E2624] relative overflow-hidden">
      {/* Elite Cinematic Overlay Curtain */}
      <div className={`fixed inset-0 z-50 bg-[#2E2624] pointer-events-none transition-opacity duration-700 ease-in-out ${isTransitioning ? "opacity-100" : "opacity-0"}`} />

      {/* Hero Section with Cinematic Zoom and Background Video */}
      <header className={`relative w-full h-[85vh] bg-[#2E2624] flex items-center justify-center overflow-hidden transition-transform duration-700 ease-in-out ${isTransitioning ? "scale-105" : "scale-100"}`}>
        
        {/* Local Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          poster="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
          className={`absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 ease-in-out ${isTransitioning ? "scale-115" : "scale-105"}`}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        <div className={`relative z-10 text-center text-white px-6 space-y-6 transition-all duration-500 ${isTransitioning ? "opacity-0 translate-y-[-10px]" : "opacity-100 translate-y-0"}`}>
          <p className="text-xs md:text-sm tracking-[0.3em] uppercase drop-shadow-md">Rizk Fashion — RZK</p>
          <h1 className="text-5xl md:text-8xl font-serif font-light tracking-wide drop-shadow-lg">Timeless Elegance.</h1>
          <div>
            <a 
              href="/shop#catalog" 
              onClick={handleExploreClick}
              className="inline-block bg-white text-[#2E2624] px-8 py-4 text-xs uppercase tracking-widest font-bold hover:bg-[#D98C7A] hover:text-white transition-all shadow-lg cursor-pointer"
            >
              Explore Collection
            </a>
          </div>
        </div>
      </header>

      {/* Shop By Category Carousel Section */}
      <section ref={collectionRef} id="collection" className="max-w-7xl mx-auto px-6 py-24 scroll-mt-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#D98C7A] mb-2">Curated Selection</p>
            <h2 className="text-3xl font-serif">Shop by Category</h2>
          </div>
          <Link href="/shop" className="text-xs uppercase tracking-widest underline text-[#6B5F5A] hover:text-[#2E2624]">
            View All Collection →
          </Link>
        </div>

        {/* Horizontal Scrollable Carousel */}
        <div 
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {FEATURED_CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="min-w-[280px] md:min-w-[320px] h-[400px] flex-1 snap-start group relative block overflow-hidden bg-[#F3D9CE] border border-[#F3D9CE]"
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Dark gradient overlay so the text is always readable */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 transition-opacity duration-300">
                <h3 className="text-white text-2xl font-serif tracking-wide mb-1">{category.name}</h3>
                <span className="text-white text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}