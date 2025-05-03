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
import { useCart } from '@/hooks/use-cart';
import { cartApi } from '@/lib/api/cart';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(true); // Control floating button visibility
  const { toast } = useToast();
  const router = useRouter();

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    setIsLoading(true);
    try {
      await cartApi.update(id, { quantity: newQuantity });
      updateQuantity(id, newQuantity);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update quantity',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      await cartApi.remove(id);
      removeItem(id);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove item',
        variant: 'destructive',
      });
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
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


  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <Button onClick={() => router.push('/products')}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.map((item: { id: string; image: string; name: string; size?: string; price: number; quantity: number }) => (
            <div key={item.id} className="flex gap-4 border-b py-4">
              <div className="relative w-24 h-24">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                <p className="font-medium">${item.price}</p>
                
                <div className="flex items-center gap-4 mt-2">
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                    className="w-20"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          <Button
            variant="ghost"
            onClick={clearCart}
            className="mt-4"
          >
            Clear Cart
          </Button>
        </div>
        
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${getTotal()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${getTotal()}</span>
                </div>
              </div>
            </div>
            
            <Button
              onClick={handleCheckout}
              className="w-full mt-6"
              size="lg"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
