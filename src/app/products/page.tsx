'use client'; // Required for state and potential client-side filtering

import { useState, useEffect } from 'react'; // Added useEffect
import ProductCard from '@/components/product/product-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Loader2 } from 'lucide-react'; // Added Loader2
import { Skeleton } from "@/components/ui/skeleton"; // Added Skeleton


// Mock Data
const allProducts = [
  { id: '1', name: 'Cybernetic Hoodie', price: 120, imageUrl: 'https://picsum.photos/seed/prod1/600/800', category: 'outerwear', size: ['M', 'L'], description: 'Comfort meets future tech.' },
  { id: '2', name: 'Quantum Weave Jacket', price: 250, imageUrl: 'https://picsum.photos/seed/prod2/600/800', category: 'outerwear', size: ['S', 'M', 'L'], description: 'Lightweight and adaptable.' },
  { id: '3', name: 'Zero-G Sneakers', price: 180, imageUrl: 'https://picsum.photos/seed/prod3/600/800', category: 'footwear', size: ['9', '10', '11'], description: 'Defy gravity in style.' },
  { id: '4', name: 'Plasma Mesh Tee', price: 75, imageUrl: 'https://picsum.photos/seed/prod4/600/800', category: 'tops', size: ['S', 'M'], description: 'Breathable and bioluminescent.' },
  { id: '5', name: 'Gravity Boots', price: 220, imageUrl: 'https://picsum.photos/seed/prod5/600/800', category: 'footwear', size: ['10', '11', '12'], description: 'Magnetic sole technology.' },
  { id: '6', name: 'Holo-Visor', price: 95, imageUrl: 'https://picsum.photos/seed/prod6/600/800', category: 'accessories', size: ['One Size'], description: 'Augmented reality interface.' },
  { id: '7', name: 'Stealth Cloak', price: 450, imageUrl: 'https://picsum.photos/seed/prod7/600/800', category: 'outerwear', size: ['L', 'XL'], description: 'Optical camouflage fabric.' },
  { id: '8', name: 'Kinetic Gloves', price: 60, imageUrl: 'https://picsum.photos/seed/prod8/600/800', category: 'accessories', size: ['M', 'L'], description: 'Enhanced grip and feedback.' },
  { id: '9', name: 'Cryo-Cooled Vest', price: 190, imageUrl: 'https://picsum.photos/seed/prod9/600/800', category: 'tops', size: ['M', 'L', 'XL'], description: 'Personal climate control.' },
   { id: '10', name: 'Neural Interface Band', price: 110, imageUrl: 'https://picsum.photos/seed/prod10/600/800', category: 'accessories', size: ['One Size'], description: 'Connect your mind.' },
   { id: '11', name: 'Reactive Cargo Pants', price: 140, imageUrl: 'https://picsum.photos/seed/prod11/600/800', category: 'bottoms', size: ['S', 'M', 'L'], description: 'Adapts to environmental conditions.' },
   { id: '12', name: 'Orbital Watch', price: 300, imageUrl: 'https://picsum.photos/seed/prod12/600/800', category: 'accessories', size: ['One Size'], description: 'Tracks planetary alignment.' },
];

const categories = ['all', 'outerwear', 'tops', 'bottoms', 'footwear', 'accessories'];
const sizes = ['all', 'S', 'M', 'L', 'XL', 'One Size', '9', '10', '11', '12'];
const MAX_PRICE = 500;

export default function ProductListingPage() {
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [priceRange, setPriceRange] = useState<[number]>([MAX_PRICE]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  // Debounce function
  const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const debounced = (...args: Parameters<F>) => {
      if (timeout !== null) {
        clearTimeout(timeout);
        timeout = null;
      }
      timeout = setTimeout(() => func(...args), waitFor);
    };

    return debounced as (...args: Parameters<F>) => ReturnType<F>;
  };


  // Filtering logic
  const applyFilters = () => {
    setIsLoading(true); // Start loading

    // Simulate async filtering
    setTimeout(() => {
      let tempProducts = allProducts;

      // Filter by category
      if (selectedCategory !== 'all') {
        tempProducts = tempProducts.filter(p => p.category === selectedCategory);
      }

      // Filter by size
      if (selectedSize !== 'all') {
        tempProducts = tempProducts.filter(p => p.size.includes(selectedSize));
      }

      // Filter by price
      tempProducts = tempProducts.filter(p => p.price <= priceRange[0]);

      // Filter by search term
      if (searchTerm.trim() !== '') {
        const lowerSearchTerm = searchTerm.toLowerCase();
        tempProducts = tempProducts.filter(p =>
          p.name.toLowerCase().includes(lowerSearchTerm) ||
          (p.description && p.description.toLowerCase().includes(lowerSearchTerm))
        );
      }

      setFilteredProducts(tempProducts);
      setIsLoading(false); // Stop loading
    }, 500); // Simulate 500ms delay
  };

   // Debounced search handler
   const debouncedSearch = debounce((term: string) => {
     setSearchTerm(term);
     // applyFilters(); // Apply filters immediately after debounce, or trigger with button
   }, 300); // 300ms debounce delay

   // Apply filters whenever filter state changes (except search term, handled by debounce)
   useEffect(() => {
      applyFilters();
   }, [selectedCategory, selectedSize, priceRange, searchTerm]); // Re-run filters when searchTerm state updates


  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 animate-fade-in">Explore Our Collection</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-1/4 lg:w-1/5">
           <div className="sticky top-20 space-y-6 animate-fade-in"> {/* Added animation */}
             <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  defaultValue={searchTerm} // Use defaultValue for debounced input
                  onChange={(e) => debouncedSearch(e.target.value)}
                  className="pl-10 transition-colors duration-300" // Added transition
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             </div>

            <Accordion type="multiple" defaultValue={['category', 'price']} className="w-full transition-all duration-300"> {/* Added transition */}
               <AccordionItem value="category">
                <AccordionTrigger className="text-lg font-semibold hover:text-accent">Category</AccordionTrigger> {/* Added hover effect */}
                <AccordionContent>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full btn-animated"> {/* Added animation */}
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="animate-fade-in"> {/* Added animation */}
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat} className="capitalize cursor-pointer hover:bg-accent">{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="price">
                <AccordionTrigger className="text-lg font-semibold hover:text-accent">Price Range</AccordionTrigger> {/* Added hover effect */}
                <AccordionContent className="pt-4">
                   <Label htmlFor="price-range" className="mb-2 block text-muted-foreground">Max Price: ${priceRange[0]}</Label>
                  <Slider
                    id="price-range"
                    max={MAX_PRICE}
                    step={10}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number])}
                    className="w-full cursor-pointer [&>span>span]:bg-primary [&>span>span]:h-2 [&>span]:h-2" // Enhanced slider style
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="size">
                <AccordionTrigger className="text-lg font-semibold hover:text-accent">Size</AccordionTrigger> {/* Added hover effect */}
                <AccordionContent>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger className="w-full btn-animated"> {/* Added animation */}
                      <SelectValue placeholder="Select Size" />
                    </SelectTrigger>
                    <SelectContent className="animate-fade-in"> {/* Added animation */}
                       {sizes.map(size => (
                        <SelectItem key={size} value={size} className="cursor-pointer hover:bg-accent">{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

             {/* Apply Filters Button (Optional if useEffect is used for instant filtering) */}
             {/* <Button onClick={applyFilters} className="w-full btn-animated btn-animated-accent" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Apply Filters'}
             </Button> */}
          </div>
        </aside>

        {/* Product Grid */}
        <main className="w-full md:w-3/4 lg:w-4/5">
          {isLoading ? (
             // Skeleton Loading State
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {Array.from({ length: 6 }).map((_, index) => ( // Show 6 skeletons
                <div key={index} className="space-y-2">
                  <Skeleton className="h-[300px] md:h-[350px] w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
             // Actual Product Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProducts.map((product, index) => (
                 <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}> {/* Staggered fade-in */}
                    <ProductCard product={product} />
                 </div>
              ))}
            </div>
          ) : (
             // No Products Found State
            <div className="text-center py-16 text-muted-foreground animate-fade-in">
              <p className="text-lg">No products found matching your criteria.</p>
              <p className="text-sm">Try adjusting your filters or search term.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
