'use client'; // Needed for carousel interaction and potential state

import Image from 'next/image';
import { useState, useEffect, use } from 'react'; // Import use
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import ProductCard from '@/components/product/product-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast"; // Import useToast
import { ShoppingCart, ZoomIn, Loader2 } from 'lucide-react'; // Added Loader2
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"; // For zoom, Added DialogTitle
import { Skeleton } from "@/components/ui/skeleton"; // Added Skeleton
import { motion } from "framer-motion"; // Added framer-motion
import { AnimatedSpinner } from '@/components/ui/animated-spinner'; // Added AnimatedSpinner

// Mock Data (should fetch based on params.id in a real app)
const getProductDetails = async (id: string) => { // Make async
  // Simulate fetching data with delay
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate 300ms network delay
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
  const product = products.find(p => p.id === id);
  if (!product) {
      // Handle product not found case, maybe throw an error or return null
      // For demo, return a placeholder or the first product
      return products[0];
  }
  return product;
};

const getRelatedProducts = async (currentProductId: string) => { // Make async
   // Simulate fetching related products with delay
   await new Promise(resolve => setTimeout(resolve, 400)); // Simulate 400ms network delay
   const allProducts = [
      { id: '1', name: 'Cybernetic Hoodie', price: 120, imageUrl: 'https://picsum.photos/seed/prod1/600/800', description: 'Comfort meets future tech.' }, // Added description
      { id: '2', name: 'Quantum Weave Jacket', price: 250, imageUrl: 'https://picsum.photos/seed/prod2/600/800', description: 'Lightweight and adaptable.' }, // Added description
      { id: '3', name: 'Zero-G Sneakers', price: 180, imageUrl: 'https://picsum.photos/seed/prod3/600/800', description: 'Defy gravity in style.' }, // Added description
      { id: '4', name: 'Plasma Mesh Tee', price: 75, imageUrl: 'https://picsum.photos/seed/prod4/600/800', description: 'Breathable and bioluminescent.' }, // Added description
      { id: '5', name: 'Gravity Boots', price: 220, imageUrl: 'https://picsum.photos/seed/prod5/600/800', description: 'Magnetic sole technology.' }, // Added description
      { id: '6', name: 'Holo-Visor', price: 95, imageUrl: 'https://picsum.photos/seed/prod6/600/800', description: 'Augmented reality interface.' }, // Added description
    ];
  return allProducts.filter(p => p.id !== currentProductId).slice(0, 4); // Return 4 related products
};

interface ProductDetailsPageProps {
  params: Promise<{ id: string }>; // Update params type to Promise
}

export default function ProductDetailsPage({ params: paramsPromise }: ProductDetailsPageProps) { // Rename params to paramsPromise
    // Use React.use to unwrap the params promise
    const params = use(paramsPromise);

    // Fetch data using useEffect and useState to handle client-side loading state
    const [product, setProduct] = useState<Awaited<ReturnType<typeof getProductDetails>> | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Awaited<ReturnType<typeof getRelatedProducts>> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
    const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
    const [isAddingToCart, setIsAddingToCart] = useState(false); // State for cart button loading
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Use the unwrapped productId
                if (params?.id) {
                  const [productData, relatedData] = await Promise.all([
                      getProductDetails(params.id),
                      getRelatedProducts(params.id)
                  ]);
                  setProduct(productData);
                  setRelatedProducts(relatedData);
                  // Set default selections once product data is loaded
                  if (productData) {
                     setSelectedSize(productData?.sizes?.[0]);
                     setSelectedColor(productData?.colors?.[0]);
                  }
                }
            } catch (error) {
                console.error("Failed to fetch product data:", error);
                toast({ title: "Error", description: "Could not load product details.", variant: "destructive" });
                // Handle error state, maybe redirect or show an error message
            } finally {
                setIsLoading(false);
            }
        };
        // Check if productId exists before fetching

        fetchData();

    }, [params?.id, toast]); // Use params.id in the dependency array, now correctly accessed


   const handleAddToCart = async () => { // Make async
     setIsAddingToCart(true); // Start loading
    // Basic validation
    if (!selectedSize || !selectedColor) {
       toast({
        title: "Selection Required",
        description: "Please select a size and color.",
        variant: "destructive",
      });
       setIsAddingToCart(false); // Stop loading on validation error
      return;
    }

     // Simulate adding to cart API call
     await new Promise(resolve => setTimeout(resolve, 700));

    console.log(`Added to cart: ${product?.name}, Size: ${selectedSize}, Color: ${selectedColor}`);

     // Show success toast
    toast({
      title: "Added to Cart",
      description: `${product?.name} (${selectedSize}, ${selectedColor}) has been added to your cart.`,
      // Removed duration for default behavior
    });
     setIsAddingToCart(false); // Stop loading
  };

   // Loading State UI
   if (isLoading) {
    return (
        <div className="container mx-auto px-4 md:px-6 py-8">
           <div className="flex justify-center items-center min-h-[60vh]">
             <AnimatedSpinner /> {/* Use Futuristic Spinner */}
           </div>
            {/* Related Products Skeleton */}
           <section className="mt-16 space-y-6 opacity-50"> {/* Make skeleton less prominent */}
             <Skeleton className="h-8 w-1/3" />
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-[250px] md:h-[300px] w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                ))}
             </div>
           </section>
        </div>
    );
   }

   // Render Product Details if not loading and product exists
   if (!product) {
      // Handle case where product is still null after loading (e.g., fetch error)
      return <div className="container mx-auto px-4 md:px-6 py-8 text-center text-destructive">Product not found or failed to load.</div>;
   }


  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Product Image Carousel */}
        <motion.div
            className="relative group"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Carousel className="w-full aspect-[3/4]" opts={{ loop: true }}>
            <CarouselContent>
              {product.images.map((imgSrc, index) => (
                 <CarouselItem key={index} className="relative">
                    <Dialog>
                      <DialogTrigger asChild>
                         <Card className="h-full border-none rounded-lg overflow-hidden cursor-zoom-in bg-card">
                          <CardContent className="relative flex h-full items-center justify-center p-0">
                              {/* Add Skeleton for image loading state */}
                              <Skeleton className="absolute inset-0 h-full w-full z-0"/>
                              <Image
                                src={imgSrc}
                                alt={`${product.name} - view ${index + 1}`}
                                fill
                                style={{ objectFit: "cover" }}
                                className="transition-all duration-500 ease-in-out group-hover:scale-105 opacity-0 data-[loaded=true]:opacity-100 relative z-10"
                                data-ai-hint="fashion clothing detail"
                                priority={index === 0} // Prioritize loading the first image
                                data-loaded="false" // Custom attribute for loading state
                                onLoad={(e) => e.currentTarget.setAttribute('data-loaded', 'true')} // Set loaded state
                              />
                               <motion.div
                                    className="absolute inset-0 bg-black/10 flex items-center justify-center z-20"
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                  <ZoomIn className="h-12 w-12 text-white/80" />
                              </motion.div>
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl h-[80vh] p-0 border-none bg-transparent shadow-none">
                          <DialogTitle className="sr-only">{`${product.name} - view ${index + 1} zoomed`}</DialogTitle> {/* Added for accessibility */}
                         <Image
                            src={imgSrc}
                            alt={`${product.name} - view ${index + 1} zoomed`}
                            fill
                            style={{ objectFit: "contain" }}
                            className="rounded-lg"
                          />
                      </DialogContent>
                    </Dialog>
                 </CarouselItem>
              ))}
            </CarouselContent>
             <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-20 text-white bg-black/30 hover:bg-black/50 border-none btn-animated opacity-50 hover:opacity-100 transition-opacity" />
             <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-20 text-white bg-black/30 hover:bg-black/50 border-none btn-animated opacity-50 hover:opacity-100 transition-opacity" />
          </Carousel>
        </motion.div>

        {/* Product Details */}
        <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gradient-accent">{product.name}</h1> {/* Added gradient */}
          <p className="text-2xl text-primary mb-4">${product.price.toFixed(2)}</p>
          <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

          <Separator className="mb-6 fancy" /> {/* Used fancy separator */}

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
                  <motion.div
                      key={size}
                      className="flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                  >
                    <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                    <Label
                      htmlFor={`size-${size}`}
                      className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-3 px-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground [&:has([data-state=checked])]:border-primary transition-all duration-200 cursor-pointer"
                    >
                      {size}
                    </Label>
                  </motion.div>
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
                   <motion.div
                      key={color}
                      className="flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                   >
                      <RadioGroupItem value={color} id={`color-${color}`} className="peer sr-only" />
                      <Label
                         htmlFor={`color-${color}`}
                         className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-3 px-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground [&:has([data-state=checked])]:border-primary transition-all duration-200 cursor-pointer"
                         // Example: Add color swatch (needs mapping color names to hex/styles)
                         // style={{ backgroundColor: colorMap[color] || '#ccc' }}
                      >
                        {color}
                      </Label>
                    </motion.div>
                 ))}
                </RadioGroup>
            </div>
          )}


          {/* Add to Cart Button */}
          <Button
            size="lg"
            className="w-full md:w-auto btn-animated btn-animated-accent mt-4 pulsating-glow" // Added pulsing glow
            onClick={handleAddToCart}
            disabled={isAddingToCart} // Disable button while adding
          >
            {isAddingToCart ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Adding...
                </>
            ) : (
                <>
                    <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                </>
            )}
          </Button>
        </motion.div>
      </div>

       {/* Related Products Section */}
       {relatedProducts && relatedProducts.length > 0 && (
         <motion.section
             className="mt-16"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
         >
           <h2 className="text-2xl md:text-3xl font-bold mb-6">You Might Also Like</h2>
            <Carousel
              opts={{
                align: "start",
                loop: false, // Optional: Set to true if you want infinite loop
              }}
              className="w-full -ml-2" // Adjust margin for alignment
            >
              <CarouselContent className="-ml-4">
                {relatedProducts.map((relatedProduct, index) => (
                  <CarouselItem key={relatedProduct.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                     <motion.div
                         className="p-1"
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.4, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                      >
                        <ProductCard product={relatedProduct} />
                      </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 hidden lg:flex btn-animated bg-background/80 hover:bg-background opacity-70 hover:opacity-100 transition-opacity" />
              <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 hidden lg:flex btn-animated bg-background/80 hover:bg-background opacity-70 hover:opacity-100 transition-opacity" />
            </Carousel>
         </motion.section>
       )}
    </div>
  );
}
