// app/page.tsx
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// All categories with reliable, high-quality fashion placeholder images
const FEATURED_CATEGORIES = [
  {
    name: "Dresses",
    slug: "dresses",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1983&auto=format&fit=crop",
  },
  {
    name: "Tops & Sweaters",
    slug: "tops-sweaters",
    image: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=1972&auto=format&fit=crop",
  },
  {
    name: "Shirts",
    slug: "shirts",
    image: "https://images.unsplash.com/photo-1598032895397-b9472444bf93?q=80&w=2080&auto=format&fit=crop",
  },
  {
    name: "Coats & Jackets",
    slug: "coats-jackets",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1935&auto=format&fit=crop",
  },
  {
    name: "Jeans",
    slug: "jeans",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1926&auto=format&fit=crop",
  },
  {
    name: "Pants",
    slug: "pants",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1974&auto=format&fit=crop",
  },
  {
    name: "Skirts",
    slug: "skirts",
    image: "https://images.unsplash.com/photo-1583496924844-1188361b96e5?q=80&w=1974&auto=format&fit=crop",
  },
  {
    name: "Shorts",
    slug: "shorts",
    image: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=1935&auto=format&fit=crop",
  },
  {
    name: "Sets",
    slug: "sets",
    image: "https://images.unsplash.com/photo-1593030103066-0093718efeb9?q=80&w=2080&auto=format&fit=crop",
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