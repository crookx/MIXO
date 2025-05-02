'use client'; // Required for state management

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus, Loader2, ShoppingBag } from 'lucide-react'; // Added Loader2, ShoppingBag
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton'; // Added Skeleton

// Mock cart item data type
interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  size: string;
  color: string;
}

// Mock initial cart data (will simulate loading)
const initialCartItems: CartItem[] = [
  // Data moved to useEffect for simulated loading
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(true); // Control floating button visibility
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null); // Track item being updated


  // Simulate fetching cart items
  useEffect(() => {
      setIsLoading(true);
      setTimeout(() => {
          setCartItems([
              { id: '1', name: 'Cybernetic Hoodie', price: 120, imageUrl: 'https://picsum.photos/seed/prod1/100/100', quantity: 1, size: 'L', color: 'Onyx Black' },
              { id: '3', name: 'Zero-G Sneakers', price: 180, imageUrl: 'https://picsum.photos/seed/prod3/100/100', quantity: 1, size: '10', color: 'Lunar White' },
              { id: '6', name: 'Holo-Visor', price: 95, imageUrl: 'https://picsum.photos/seed/prod6/100/100', quantity: 2, size: 'One Size', color: 'Chrome' },
          ]);
          setIsLoading(false);
      }, 800); // Simulate 800ms loading time
  }, []);


  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal > 50 ? 0 : 15; // Example shipping logic
  const total = subtotal + shippingCost;

  // Handle quantity change
  const handleQuantityChange = async (id: string, change: number) => {
     setUpdatingItemId(id); // Indicate which item is updating
     // Simulate API call
     await new Promise(resolve => setTimeout(resolve, 300));

     setCartItems(prevItems => {
        const updatedItems = prevItems.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(1, item.quantity + change); // Ensure quantity doesn't go below 1
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
         // Filter out items if quantity becomes 0 (optional, if needed)
        // return updatedItems.filter(item => item.quantity > 0);
        return updatedItems;
     });
     setUpdatingItemId(null); // Clear updating state
     // Add smooth transition feel via toast (optional)
     // toast({ description: `Quantity updated.` });
  };

  // Handle item removal
  const handleRemoveItem = (id: string) => {
     const removedItem = cartItems.find(item => item.id === id);
     // Optimistically remove from UI
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
     // Simulate API call
     // await new Promise(resolve => setTimeout(resolve, 500)); // If needed
    if(removedItem){
        toast({
            title: "Item Removed",
            description: `${removedItem.name} removed from cart.`,
            variant: "destructive"
        });
    }
    // Handle API error if necessary (e.g., put item back)
  };

  // Handle scroll to show/hide floating checkout button (optional effect)
  useEffect(() => {
    if (typeof window === 'undefined') return; // Guard against SSR

    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = currentScrollY - lastScrollY;

      // Only update visibility if scrolling more than a threshold
      if (Math.abs(scrollDifference) > 10) {
         if (scrollDifference > 0 || currentScrollY > 100) { // Scrolling down or scrolled past a point
             setIsCheckoutVisible(false);
         } else if (scrollDifference < 0 || currentScrollY <= 50) { // Scrolling up or near top
             setIsCheckoutVisible(true);
          }
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true }); // Use passive listener
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  if (isLoading) {
      return (
          <div className="container mx-auto px-4 md:px-6 py-8 min-h-[calc(100vh-200px)] animate-pulse">
              <Skeleton className="h-10 w-1/3 mb-8" />
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                  {/* Cart Items Skeleton */}
                  <div className="flex-grow lg:w-2/3 space-y-6">
                      {[...Array(3)].map((_, index) => (
                          <div key={index} className="flex items-start sm:items-center gap-4 border p-4 rounded-lg shadow-sm bg-card">
                              <Skeleton className="h-[100px] w-[100px] rounded-md border" />
                              <div className="flex-grow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                  <div className="space-y-2 mb-2 sm:mb-0">
                                      <Skeleton className="h-5 w-40" />
                                      <Skeleton className="h-4 w-32" />
                                  </div>
                                  <div className="flex items-center gap-2 sm:gap-4">
                                      <Skeleton className="h-8 w-24 rounded-md" />
                                      <Skeleton className="h-6 w-16 hidden sm:block" />
                                      <Skeleton className="h-8 w-8 rounded-full" />
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
                   {/* Order Summary Skeleton */}
                  <div className="lg:w-1/3">
                       <div className="sticky top-20 border p-6 rounded-lg shadow-sm bg-card space-y-4">
                          <Skeleton className="h-8 w-1/2 mb-4" />
                          <div className="flex justify-between"><Skeleton className="h-5 w-1/4" /><Skeleton className="h-5 w-1/4" /></div>
                          <div className="flex justify-between"><Skeleton className="h-5 w-1/4" /><Skeleton className="h-5 w-1/4" /></div>
                          <Separator />
                          <div className="flex justify-between"><Skeleton className="h-6 w-1/3" /><Skeleton className="h-6 w-1/4" /></div>
                          <Skeleton className="h-12 w-full mt-4 rounded-md" />
                       </div>
                  </div>
              </div>
          </div>
      );
  }


  return (
    <div className="container mx-auto px-4 md:px-6 py-8 min-h-[calc(100vh-200px)]"> {/* Adjust min-height as needed */}
      <h1 className="text-3xl md:text-4xl font-bold mb-8 animate-fade-in">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
           <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" /> {/* Added Icon */}
          <p className="text-xl text-muted-foreground mb-4">Your cart is empty.</p>
          <Link href="/products">
            <Button className="btn-animated btn-animated-accent">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Cart Items List */}
          <div className="flex-grow lg:w-2/3">
            <div className="space-y-6">
              {cartItems.map((item, index) => (
                <div
                    key={item.id}
                    className="flex items-start sm:items-center gap-4 border p-4 rounded-lg shadow-sm bg-card transition-all duration-300 ease-in-out hover:shadow-md animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }} // Staggered animation
                >
                  <Link href={`/products/${item.id}`}>
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="rounded-md object-cover border transition-transform duration-300 hover:scale-105" // Added hover effect
                      data-ai-hint="product clothing image"
                    />
                  </Link>
                  <div className="flex-grow flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="mb-2 sm:mb-0">
                      <Link href={`/products/${item.id}`}>
                         <h2 className="text-lg font-semibold hover:text-accent transition-colors">{item.name}</h2>
                      </Link>
                      <p className="text-sm text-muted-foreground">Size: {item.size} | Color: {item.color}</p>
                      <p className="text-md font-medium sm:hidden">${(item.price * item.quantity).toFixed(2)}</p> {/* Price for mobile */}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                       {/* Quantity Controls */}
                       <div className="flex items-center border rounded-md">
                          <Button variant="ghost" size="icon" className="h-8 w-8 btn-animated" onClick={() => handleQuantityChange(item.id, -1)} aria-label="Decrease quantity" disabled={updatingItemId === item.id}>
                             {updatingItemId === item.id && change < 0 ? <Loader2 className="h-4 w-4 animate-spin"/> : <Minus className="h-4 w-4" />}
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            readOnly // Prevent direct input, use buttons
                            className="h-8 w-12 text-center border-x border-y-0 rounded-none focus-visible:ring-0 bg-transparent" // Make bg transparent
                            aria-label="Quantity"
                          />
                           <Button variant="ghost" size="icon" className="h-8 w-8 btn-animated" onClick={() => handleQuantityChange(item.id, 1)} aria-label="Increase quantity" disabled={updatingItemId === item.id}>
                              {updatingItemId === item.id && change > 0 ? <Loader2 className="h-4 w-4 animate-spin"/> : <Plus className="h-4 w-4" />}
                          </Button>
                       </div>
                       <p className="text-md font-medium hidden sm:block w-16 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                       <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive transition-colors btn-animated" onClick={() => handleRemoveItem(item.id)} aria-label="Remove item">
                         <Trash2 className="h-5 w-5" />
                       </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="sticky top-20 border p-6 rounded-lg shadow-sm bg-card space-y-4 animate-fade-in"> {/* Added animation */}
              <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Link href="/checkout" className="block w-full">
                 <Button className="w-full mt-4 btn-animated btn-animated-accent" size="lg">
                    Proceed to Checkout
                 </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Floating Checkout Button for Mobile/Scroll */}
       <div className={`fixed bottom-4 right-4 z-40 transition-all duration-500 ease-out ${isCheckoutVisible && cartItems.length > 0 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-16 opacity-0 scale-95'} lg:hidden`} > {/* Enhanced transition */}
         {cartItems.length > 0 && (
          <Link href="/checkout">
            <Button size="lg" className="shadow-lg btn-animated btn-animated-accent rounded-full px-6 py-3"> {/* Rounded button */}
              Checkout (${total.toFixed(2)})
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
