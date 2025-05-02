'use client'; // Required for state and potential client-side filtering

import { useState } from 'react';
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
import { Search } from 'lucide-react';


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

  // Basic filtering logic (can be enhanced)
  const applyFilters = () => {
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
      tempProducts = tempProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProducts(tempProducts);
  };

   // Apply filters whenever filter state changes
   // Debounce search term for better performance in a real app
   // useEffect(() => { applyFilters(); }, [selectedCategory, selectedSize, priceRange, searchTerm]);
   // For now, apply on button click

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Explore Our Collection</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-1/4 lg:w-1/5">
           <div className="sticky top-20 space-y-6">
             <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             </div>

            <Accordion type="multiple" defaultValue={['category', 'price']} className="w-full">
               <AccordionItem value="category">
                <AccordionTrigger className="text-lg font-semibold">Category</AccordionTrigger>
                <AccordionContent>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="price">
                <AccordionTrigger className="text-lg font-semibold">Price Range</AccordionTrigger>
                <AccordionContent className="pt-4">
                   <Label htmlFor="price-range" className="mb-2 block">Max Price: ${priceRange[0]}</Label>
                  <Slider
                    id="price-range"
                    max={MAX_PRICE}
                    step={10}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number])}
                    className="w-full"
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="size">
                <AccordionTrigger className="text-lg font-semibold">Size</AccordionTrigger>
                <AccordionContent>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Size" />
                    </SelectTrigger>
                    <SelectContent>
                       {sizes.map(size => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

             <Button onClick={applyFilters} className="w-full btn-animated btn-animated-accent">Apply Filters</Button>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="w-full md:w-3/4 lg:w-4/5">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <p>No products found matching your criteria.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
