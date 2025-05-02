'use client'; // Needed for carousel interaction and potential state

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import ProductCard from '@/components/product/product-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast"; // Import useToast
import { ShoppingCart, ZoomIn } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"; // For zoom


// Mock Data (should fetch based on params.id in a real app)
const getProductDetails = (id: string) => {
  // Simulate fetching data
  const products = [
     { id: '1', name: 'Cybernetic Hoodie', price: 120, images: ['https://picsum.photos/seed/prod1/800/1000', 'https://picsum.photos/seed/prod1b/800/1000', 'https://picsum.photos/seed/prod1c/800/1000'], description: 'Experience unparalleled comfort with the Cybernetic Hoodie. Featuring integrated neural-link compatibility and adaptive thermal regulation. Made from sustainable synth-weave.', sizes: ['S', 'M', 'L', 'XL'], colors: ['Onyx Black', 'Quantum Silver'] },
     { id: '2', name: 'Quantum Weave Jacket', price: 250, images: ['https://picsum.photos/seed/prod2/800/1000', 'https://picsum.photos/seed/prod2b/800/1000'], description: 'Lightweight, durable, and stylish. The Quantum Weave Jacket uses phase-shifting material to adapt to any environment. Water-resistant and self-repairing.', sizes: ['S', 'M', 'L'], colors: ['Void Blue', 'Nebula Purple'] },
     { id: '3', name: 'Zero-G Sneakers', price: 180, images: ['https://picsum.photos/seed/prod3/800/1000', 'https://picsum.photos/seed/prod3b/800/1000', 'https://picsum.photos/seed/prod3c/800/1000'], description: 'Walk on air with the Zero-G Sneakers. Featuring magnetic levitation soles and energy-return cushioning. Perfect for urban exploration.', sizes: ['9', '10', '11', '12'], colors: ['Lunar White', 'Cosmic Grey'] },
     // Add other products as needed for related items lookup
     { id: '4', name: 'Plasma Mesh Tee', price: 75, images: ['https://picsum.photos/seed/prod4/800/1000'], description: 'Glow with the flow. The Plasma Mesh Tee uses bioluminescent fibers for a stunning visual effect. Highly breathable.', sizes: ['S', 'M', 'L'], colors: ['Electric Blue', 'Neon Green'] },
     { id: '5', name: 'Gravity Boots', price: 220, images: ['https://picsum.photos/seed/prod5/800/1000'], description: 'Magnetic sole technology.', sizes: ['10', '11', '12'], colors: ['Carbon Black'] },
     { id: '6', name: 'Holo-Visor', price: 95, images: ['https://picsum.photos/seed/prod6/800/1000'], description: 'Augmented reality interface.', sizes: ['One Size'], colors: ['Chrome'] },
  ];
   // Find the product, default to the first if not found (for demo)
  return products.find(p => p.id === id) || products[0];
};

const getRelatedProducts = (currentProductId: string) => {
   // Simulate fetching related products (exclude current)
   const allProducts = [
      { id: '1', name: 'Cybernetic Hoodie', price: 120, imageUrl: 'https://picsum.photos/seed/prod1/600/800' },
      { id: '2', name: 'Quantum Weave Jacket', price: 250, imageUrl: 'https://picsum.photos/seed/prod2/600/800' },
      { id: '3', name: 'Zero-G Sneakers', price: 180, imageUrl: 'https://picsum.photos/seed/prod3/600/800' },
      { id: '4', name: 'Plasma Mesh Tee', price: 75, imageUrl: 'https://picsum.photos/seed/prod4/600/800' },
      { id: '5', name: 'Gravity Boots', price: 220, imageUrl: 'https://picsum.photos/seed/prod5/600/800' },
      { id: '6', name: 'Holo-Visor', price: 95, imageUrl: 'https://picsum.photos/seed/prod6/600/800' },
    ];
  return allProducts.filter(p => p.id !== currentProductId).slice(0, 4); // Return 4 related products
};


export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const product = getProductDetails(params.id);
  const relatedProducts = getRelatedProducts(params.id);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product.sizes?.[0]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product.colors?.[0]);
  const { toast } = useToast(); // Initialize useToast

   const handleAddToCart = () => {
    // Basic validation
    if (!selectedSize || !selectedColor) {
       toast({
        title: "Selection Required",
        description: "Please select a size and color.",
        variant: "destructive",
      });
      return;
    }

     // Logic to add item to cart (e.g., using context or state management)
    console.log(`Added to cart: ${product.name}, Size: ${selectedSize}, Color: ${selectedColor}`);

     // Show success toast
    toast({
      title: "Added to Cart",
      description: `${product.name} (${selectedSize}, ${selectedColor}) has been added to your cart.`,
    });
  };


  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Product Image Carousel */}
        <div className="relative group">
          <Carousel className="w-full aspect-[3/4]" opts={{ loop: true }}>
            <CarouselContent>
              {product.images.map((imgSrc, index) => (
                 <CarouselItem key={index} className="relative">
                    <Dialog>
                      <DialogTrigger asChild>
                         <Card className="h-full border-none rounded-lg overflow-hidden cursor-zoom-in">
                          <CardContent className="relative flex h-full items-center justify-center p-0">
                              <Image
                                src={imgSrc}
                                alt={`${product.name} - view ${index + 1}`}
                                layout="fill"
                                objectFit="cover"
                                className="transition-transform duration-500 ease-in-out group-hover:scale-105"
                                data-ai-hint="fashion clothing detail"
                                priority={index === 0} // Prioritize loading the first image
                              />
                               <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                  <ZoomIn className="h-12 w-12 text-white" />
                              </div>
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl h-[80vh] p-0 border-none">
                         <Image
                            src={imgSrc}
                            alt={`${product.name} - view ${index + 1} zoomed`}
                            layout="fill"
                            objectFit="contain"
                            className="rounded-lg"
                          />
                      </DialogContent>
                    </Dialog>
                 </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white bg-black/30 hover:bg-black/50 border-none" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white bg-black/30 hover:bg-black/50 border-none" />
          </Carousel>
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl text-primary mb-4">${product.price.toFixed(2)}</p>
          <p className="text-muted-foreground mb-6">{product.description}</p>

          <Separator className="mb-6" />

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <Label className="text-lg font-semibold mb-3 block">Size</Label>
              <RadioGroup
                value={selectedSize}
                onValueChange={setSelectedSize}
                className="flex flex-wrap gap-2"
              >
                {product.sizes.map((size) => (
                  <div key={size} className="flex items-center">
                    <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                    <Label
                      htmlFor={`size-${size}`}
                      className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-3 px-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground [&:has([data-state=checked])]:border-primary transition-colors cursor-pointer"
                    >
                      {size}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Color Selection */}
           {product.colors && product.colors.length > 0 && (
            <div className="mb-8">
                <Label className="text-lg font-semibold mb-3 block">Color</Label>
                <RadioGroup
                  value={selectedColor}
                  onValueChange={setSelectedColor}
                  className="flex flex-wrap gap-3"
                >
                 {product.colors.map((color) => (
                   <div key={color} className="flex items-center">
                      <RadioGroupItem value={color} id={`color-${color}`} className="peer sr-only" />
                      <Label
                         htmlFor={`color-${color}`}
                         className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-3 px-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground [&:has([data-state=checked])]:border-primary transition-colors cursor-pointer"
                         // Example: Add color swatch (needs mapping color names to hex/styles)
                         // style={{ backgroundColor: colorMap[color] || '#ccc' }}
                      >
                        {color}
                      </Label>
                    </div>
                 ))}
                </RadioGroup>
            </div>
          )}


          {/* Add to Cart Button */}
          <Button size="lg" className="w-full md:w-auto btn-animated btn-animated-accent" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </div>

       {/* Related Products Section */}
       {relatedProducts.length > 0 && (
         <section className="mt-16">
           <h2 className="text-2xl md:text-3xl font-bold mb-6">You Might Also Like</h2>
            <Carousel
              opts={{
                align: "start",
                loop: false, // Optional: Set to true if you want infinite loop
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {relatedProducts.map((relatedProduct) => (
                  <CarouselItem key={relatedProduct.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                     <div className="p-1">
                        <ProductCard product={relatedProduct as any} />
                      </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 z-10 hidden lg:flex" />
              <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 z-10 hidden lg:flex" />
            </Carousel>
         </section>
       )}
    </div>
  );
}
