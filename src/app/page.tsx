// src/app/page.tsx
'use client'; // Required for Autoplay plugin and client-side interaction

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/product-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import Autoplay from "embla-carousel-autoplay"; // Import Autoplay plugin
import * as React from "react"; // Import React for useRef

// Mock Data
const featuredProducts = [
  { id: '1', name: 'Cybernetic Hoodie', price: 120, imageUrl: 'https://picsum.photos/seed/prod1/600/800', description: 'Comfort meets future tech.' },
  { id: '2', name: 'Quantum Weave Jacket', price: 250, imageUrl: 'https://picsum.photos/seed/prod2/600/800', description: 'Lightweight and adaptable.' },
  { id: '3', name: 'Zero-G Sneakers', price: 180, imageUrl: 'https://picsum.photos/seed/prod3/600/800', description: 'Defy gravity in style.' },
  { id: '4', name: 'Plasma Mesh Tee', price: 75, imageUrl: 'https://picsum.photos/seed/prod4/600/800', description: 'Breathable and bioluminescent.' },
];

const carouselItems = [
  { id: 'c1', title: 'New Arrivals', description: 'Explore the latest in futuristic fashion.', imageUrl: 'https://picsum.photos/seed/carousel1/1200/600', link: '/products?category=new', buttonText: 'Shop New' },
  { id: 'c2', title: 'Summer Cyber Sale', description: 'Up to 40% off on selected cyber gear.', imageUrl: 'https://picsum.photos/seed/carousel2/1200/600', link: '/products?sale=true', buttonText: 'Shop Sale' },
  { id: 'c3', title: 'Core Collection', description: 'Timeless pieces for your future wardrobe.', imageUrl: 'https://picsum.photos/seed/carousel3/1200/600', link: '/products?collection=core', buttonText: 'Explore Core' },
];

const categories = [
    { name: 'Outerwear', imageUrl: 'https://picsum.photos/seed/cat1/400/400', link: '/products?category=outerwear' },
    { name: 'Tops', imageUrl: 'https://picsum.photos/seed/cat2/400/400', link: '/products?category=tops' },
    { name: 'Footwear', imageUrl: 'https://picsum.photos/seed/cat3/400/400', link: '/products?category=footwear' },
    { name: 'Accessories', imageUrl: 'https://picsum.photos/seed/cat4/400/400', link: '/products?category=accessories' },
];

export default function Home() {
   // Initialize Autoplay plugin
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true }) // Autoplay every 5 seconds, stop on interaction/hover
  );

  return (
    <div className="flex flex-col">
      {/* Hero Carousel */}
      <section className="relative w-full h-[60vh] md:h-[80vh] mb-12 overflow-hidden group">
         <Carousel
            className="w-full h-full"
            opts={{ loop: true }}
            plugins={[plugin.current]} // Add Autoplay plugin
            onMouseEnter={plugin.current.stop} // Stop autoplay on hover
            onMouseLeave={plugin.current.play} // Resume autoplay on leave
          >
            <CarouselContent className="h-full">
              {carouselItems.map((item) => (
                <CarouselItem key={item.id} className="relative h-full">
                  {/* Ensure Card and CardContent allow image to fill */}
                  <Card className="h-full border-none rounded-none p-0 overflow-hidden bg-transparent">
                    <CardContent className="relative flex h-full items-center justify-center p-0">
                       <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill // Use fill to cover the container
                        style={{ objectFit: 'cover' }} // 'cover' ensures the image covers the area, might crop
                        className="absolute inset-0 z-0 transition-transform duration-500 ease-in-out group-hover:scale-105"
                        data-ai-hint="futuristic fashion model clothing"
                        priority // Load first image faster
                      />
                      <div className="absolute inset-0 bg-black/50 z-10 transition-colors duration-300 group-hover:bg-black/60"></div> {/* Overlay */}
                      <div className="relative z-20 text-center text-primary-foreground p-8 animate-fade-in"> {/* Content */}
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-md">{item.title}</h2>
                        <p className="text-lg md:text-xl mb-6 drop-shadow-sm">{item.description}</p>
                        <Link href={item.link}>
                           <Button size="lg" variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90 btn-animated">
                            {item.buttonText}
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-30 text-white bg-black/30 hover:bg-black/50 border-none transition-opacity opacity-50 hover:opacity-100 btn-animated" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-30 text-white bg-black/30 hover:bg-black/50 border-none transition-opacity opacity-50 hover:opacity-100 btn-animated" />
          </Carousel>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 md:px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-8 animate-fade-in">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredProducts.map((product, index) => (
             <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                 <ProductCard product={product} />
             </div>
          ))}
        </div>
         <div className="text-center mt-10 animate-fade-in">
           <Link href="/products">
             <Button variant="outline" className="btn-animated">View All Products</Button>
           </Link>
        </div>
      </section>

      {/* Category Sections */}
      <section className="bg-secondary py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-8 text-secondary-foreground animate-fade-in">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Link
                  key={category.name}
                  href={category.link}
                  className="group relative overflow-hidden rounded-lg shadow-md block transition-all duration-300 ease-in-out transform hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
               >
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  width={400}
                  height={400}
                  className="object-cover w-full h-48 md:h-64 transition-opacity duration-300 group-hover:opacity-90"
                  data-ai-hint={`${category.name} clothing fashion`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 group-hover:from-black/70"></div>
                <div className="absolute bottom-0 left-0 p-4 transition-transform duration-300 group-hover:translate-y-[-5px]">
                  <h3 className="text-lg font-semibold text-primary-foreground drop-shadow-sm">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
       <section className="container mx-auto px-4 md:px-6 py-16">
        <div className="bg-gradient-main text-primary-foreground rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-xl transform transition-transform hover:scale-[1.02] duration-500 animate-fade-in">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h2 className="text-2xl md:text-4xl font-bold mb-3">Join the ChronoClub</h2>
            <p className="text-md md:text-lg opacity-90">Get exclusive access to drops, sales, and futuristic insights.</p>
          </div>
           <Link href="/auth#signup">
              <Button variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary btn-animated">Sign Up Now</Button>
           </Link>
        </div>
      </section>
    </div>
  );
}
