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
import { productApi } from '@/lib/api-client';
import { Product } from '@/types/product';
import { toast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/use-debounce';

const categories = ['all', 'outerwear', 'tops', 'bottoms', 'footwear', 'accessories'];
const sizes = ['all', 'S', 'M', 'L', 'XL', 'One Size', '9', '10', '11', '12'];
const MAX_PRICE = 500;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: 'all',
    size: 'all',
    maxPrice: MAX_PRICE,
    search: ''
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await productApi.getAll({
          category: filters.category !== 'all' ? filters.category : undefined,
          size: filters.size !== 'all' ? filters.size : undefined,
          maxPrice: filters.maxPrice,
          search: debouncedSearch
        });
        
        // Add logging to debug the response
        console.log('API Response:', response);
        
        if (response.data) {
          setProducts(response.data);
          setError(null);
        } else {
          throw new Error('No products data received');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        toast({
          title: 'Error',
          description: 'Failed to load products. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [filters.category, filters.size, filters.maxPrice, debouncedSearch]);

  const handleFilterChange = (key: keyof typeof filters, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[350px] w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10 transition-colors duration-300" // Added transition
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             </div>

            <Accordion type="multiple" defaultValue={['category', 'price']} className="w-full transition-all duration-300"> {/* Added transition */}
               <AccordionItem value="category">
                <AccordionTrigger className="text-lg font-semibold hover:text-accent">Category</AccordionTrigger> {/* Added hover effect */}
                <AccordionContent>
                  <Select 
                    value={filters.category}
                    onValueChange={(value) => handleFilterChange('category', value)}
                  >
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
<Label htmlFor="price-range" className="mb-2 block text-muted-foreground">Max Price: ${MAX_PRICE}</Label>
                  <Slider
                    id="price-range"
                    max={MAX_PRICE}
                    step={10}
                    value={[filters.maxPrice]}
                    onValueChange={(value) => handleFilterChange('maxPrice', value[0])}
                    className="w-full cursor-pointer [&>span>span]:bg-primary [&>span>span]:h-2 [&>span]:h-2" // Enhanced slider style
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="size">
                <AccordionTrigger className="text-lg font-semibold hover:text-accent">Size</AccordionTrigger> {/* Added hover effect */}
                <AccordionContent>
                  <Select 
                    value={filters.size}
                    onValueChange={(value) => handleFilterChange('size', value)}
                  >
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
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {products.map((product) => (
                <div 
                  key={product._id} 
                  className="animate-fade-in" 
                  style={{ animationDelay: `${products.indexOf(product) * 0.05}s` }}
                >
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
