'use client'; // Required for state management

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

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

// Mock initial cart data
const initialCartItems: CartItem[] = [
  { id: '1', name: 'Cybernetic Hoodie', price: 120, imageUrl: 'https://picsum.photos/seed/prod1/100/100', quantity: 1, size: 'L', color: 'Onyx Black' },
  { id: '3', name: 'Zero-G Sneakers', price: 180, imageUrl: 'https://picsum.photos/seed/prod3/100/100', quantity: 1, size: '10', color: 'Lunar White' },
  { id: '6', name: 'Holo-Visor', price: 95, imageUrl: 'https://picsum.photos/seed/prod6/100/100', quantity: 2, size: 'One Size', color: 'Chrome' },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(true); // Control floating button visibility
  const { toast } = useToast();

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal > 50 ? 0 : 15; // Example shipping logic
  const total = subtotal + shippingCost;

  // Handle quantity change
  const handleQuantityChange = (id: string, change: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) } // Ensure quantity doesn't go below 1
          : item
      ).filter(item => item.quantity > 0) // Filter out items if quantity becomes 0 (optional)
    );
     // Add smooth transition feel via toast (optional)
     // toast({ description: `Quantity updated.` });
  };

  // Handle item removal
  const handleRemoveItem = (id: string) => {
     const removedItem = cartItems.find(item => item.id === id);
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    if(removedItem){
        toast({
            title: "Item Removed",
            description: `${removedItem.name} removed from cart.`,
            variant: "destructive"
        });
    }
  };

  // Handle scroll to show/hide floating checkout button (optional effect)
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.scrollY > lastScrollY + 10) { // Scrolling down
        setIsCheckoutVisible(false);
      } else if (window.scrollY < lastScrollY - 10 || window.scrollY <= 50) { // Scrolling up or near top
        setIsCheckoutVisible(true);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <div className="container mx-auto px-4 md:px-6 py-8 min-h-[calc(100vh-200px)]"> {/* Adjust min-height as needed */}
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
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
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-start sm:items-center gap-4 border p-4 rounded-lg shadow-sm bg-card transition-all duration-300 ease-in-out hover:shadow-md">
                  <Link href={`/products/${item.id}`}>
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="rounded-md object-cover border"
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
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.id, -1)} aria-label="Decrease quantity">
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            readOnly // Prevent direct input, use buttons
                            className="h-8 w-12 text-center border-x border-y-0 rounded-none focus-visible:ring-0"
                            aria-label="Quantity"
                          />
                           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.id, 1)} aria-label="Increase quantity">
                            <Plus className="h-4 w-4" />
                          </Button>
                       </div>
                       <p className="text-md font-medium hidden sm:block w-16 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                       <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive transition-colors" onClick={() => handleRemoveItem(item.id)} aria-label="Remove item">
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
            <div className="sticky top-20 border p-6 rounded-lg shadow-sm bg-card space-y-4">
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
      <div className={`fixed bottom-4 right-4 z-40 transition-transform duration-500 ease-in-out ${isCheckoutVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'} lg:hidden`}>
         {cartItems.length > 0 && (
          <Link href="/checkout">
            <Button size="lg" className="shadow-lg btn-animated btn-animated-accent">
              Checkout (${total.toFixed(2)})
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
