'use client';

import { useState, useEffect } from 'react'; // Added useEffect
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Truck, CreditCard, ShieldCheck, Loader2, CheckCircle } from 'lucide-react'; // Added Loader2, CheckCircle
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation'; // For redirection after order
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton'; // Added Skeleton
import { cn } from '@/lib/utils'; // Import cn
import { useCart } from '@/hooks/use-cart';
import { orderApi } from '@/lib/api';


// Schema for form validation using Zod
const shippingSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  address: z.string().min(1, { message: "Address is required." }),
  city: z.string().min(1, { message: "City is required." }),
  postalCode: z.string().min(5, { message: "Valid postal code is required." }),
  country: z.string().min(1, { message: "Country is required." }),
});

const paymentSchema = z.object({
    paymentMethod: z.enum(['card', 'paypal'], { required_error: "Please select a payment method." }),
    cardNumber: z.string().refine(val => /^\d{13,19}$/.test(val ?? ''), { message: "Invalid card number." }).optional(), // Basic card format check
    expiryDate: z.string().refine(val => /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(val ?? ''), { message: "Invalid expiry date (MM/YY)."}).optional(), // MM/YY format
    cvc: z.string().refine(val => /^\d{3,4}$/.test(val ?? ''), { message: "Invalid CVC." }).optional(), // 3-4 digits
}).refine(data => {
    // Require card details only if 'card' is selected
    if (data.paymentMethod === 'card') {
        return !!data.cardNumber && !!data.expiryDate && !!data.cvc;
    }
    return true;
}, {
    message: "Card details are required for card payment.",
    path: ["cardNumber"], // Apply error message to a specific field if needed
});


type ShippingFormValues = z.infer<typeof shippingSchema>;
type PaymentFormValues = z.infer<typeof paymentSchema>;

// Mock Order Summary Data (will simulate loading)
interface MockOrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}
const mockSubtotal = 300;
const mockShipping: number = 0;
const mockTotal = 300;


export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const { toast } = useToast();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false); // State for processing payment
  const [isLoadingSummary, setIsLoadingSummary] = useState(true); // State for loading summary
  const [orderItems, setOrderItems] = useState<MockOrderItem[]>([]); // State for order items
  const { items, getTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  // Simulate loading order summary data
  useEffect(() => {
      setIsLoadingSummary(true);
      setTimeout(() => {
          setOrderItems([
              { id: '1', name: 'Cybernetic Hoodie', price: 120, quantity: 1 },
              { id: '3', name: 'Zero-G Sneakers', price: 180, quantity: 1 },
          ]);
          setIsLoadingSummary(false);
      }, 600); // Simulate 600ms delay
  }, []);


  const shippingForm = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: { // Optional: Prefill if user is logged in
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'United States', // Default country
    },
  });

  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
     defaultValues: {
        paymentMethod: undefined, // No default selection
    },
  });

  const onShippingSubmit: SubmitHandler<ShippingFormValues> = (data) => {
    console.log('Shipping Data:', data);
    setCurrentStep('payment'); // Move to next step
    window.scrollTo(0, 0); // Scroll to top for next step
  };

   const onPaymentSubmit: SubmitHandler<PaymentFormValues> = async (data) => {
    setIsProcessing(true); // Start processing
    console.log('Payment Data:', data);
    // Simulate order placement API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      // ** TODO: Implement actual order placement logic here **
      // (e.g., call Firebase function, interact with Stripe, etc.)

      toast({
          title: "Order Placed Successfully!",
          description: "Thank you for your purchase. You'll receive a confirmation email shortly.",
      });
      setCurrentStep('confirmation'); // Move to confirmation (optional state)
      // Redirect to a thank you page or clear cart after a delay
      setTimeout(() => {
          // Clear cart logic here
          router.push('/'); // Redirect to homepage
      }, 3000);

    } catch (error: any) {
        console.error("Order placement error:", error);
        toast({
            title: "Order Failed",
            description: error.message || "There was an issue placing your order. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsProcessing(false); // Stop processing
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        items: items,
        totalAmount: getTotal(),
        shippingDetails: formData,
      };

      await orderApi.create(orderData);
      clearCart();
      toast({
        title: 'Success',
        description: 'Order placed successfully!',
      });
      router.push('/orders/success');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to place order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 animate-fade-in">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Checkout Steps */}
        <div className="flex-grow lg:w-2/3">
           {/* Step Indicators */}
           <div className="flex justify-center space-x-4 md:space-x-8 mb-8 animate-fade-in">
             <div className={cn(
                  "flex items-center gap-2 transition-all duration-300",
                  currentStep === 'shipping' ? 'text-primary font-semibold scale-105' : 'text-muted-foreground opacity-60'
              )}>
               <Truck className="h-5 w-5"/> Shipping
             </div>
             <Separator
                  orientation="vertical"
                  className={cn(
                      "h-6 transition-all duration-500",
                      currentStep === 'payment' || currentStep === 'confirmation' ? 'bg-primary scale-y-110' : 'bg-border scale-y-90'
                  )}
              />
              <div className={cn(
                  "flex items-center gap-2 transition-all duration-300",
                  currentStep === 'payment' ? 'text-primary font-semibold scale-105' : 'text-muted-foreground opacity-60'
              )}>
               <CreditCard className="h-5 w-5"/> Payment
             </div>
              <Separator
                  orientation="vertical"
                  className={cn(
                     "h-6 transition-all duration-500",
                      currentStep === 'confirmation' ? 'bg-primary scale-y-110' : 'bg-border scale-y-90'
                  )}
              />
             <div className={cn(
                  "flex items-center gap-2 transition-all duration-300",
                  currentStep === 'confirmation' ? 'text-primary font-semibold scale-105' : 'text-muted-foreground opacity-60'
              )}>
                 {currentStep === 'confirmation' ? <CheckCircle className="h-5 w-5 text-green-500" /> : <ShieldCheck className="h-5 w-5"/>} {/* Change icon on confirmation */}
                 Confirmation
            </div>
           </div>

            {/* Shipping Form */}
            {currentStep === 'shipping' && (
             <Card className="mb-6 shadow-md transition-all duration-500 ease-in-out animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2"><Truck className="h-6 w-6"/> Shipping Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...shippingForm}>
                    <form onSubmit={shippingForm.handleSubmit(onShippingSubmit)} className="space-y-4">
                      <FormField
                        control={shippingForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="floating-label">
                            <FormControl>
                              <Input placeholder=" " {...field} required />
                            </FormControl>
                            <FormLabel>Email Address</FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <FormField
                            control={shippingForm.control}
                            name="firstName"
                            render={({ field }) => (
                            <FormItem className="floating-label">
                                <FormControl><Input placeholder=" " {...field} required /></FormControl>
                                <FormLabel>First Name</FormLabel>
                                <FormMessage />
                            </FormItem>
                            )}
                           />
                           <FormField
                            control={shippingForm.control}
                            name="lastName"
                            render={({ field }) => (
                            <FormItem className="floating-label">
                                <FormControl><Input placeholder=" " {...field} required /></FormControl>
                                <FormLabel>Last Name</FormLabel>
                                <FormMessage />
                            </FormItem>
                            )}
                           />
                       </div>
                       <FormField
                        control={shippingForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="floating-label">
                            <FormControl><Input placeholder=" " {...field} required /></FormControl>
                            <FormLabel>Street Address</FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <FormField
                            control={shippingForm.control}
                            name="city"
                            render={({ field }) => (
                            <FormItem className="floating-label">
                                <FormControl><Input placeholder=" " {...field} required /></FormControl>
                                <FormLabel>City</FormLabel>
                                <FormMessage />
                            </FormItem>
                            )}
                           />
                          <FormField
                            control={shippingForm.control}
                            name="postalCode"
                            render={({ field }) => (
                            <FormItem className="floating-label">
                                <FormControl><Input placeholder=" " {...field} required /></FormControl>
                                <FormLabel>Postal Code</FormLabel>
                                <FormMessage />
                            </FormItem>
                            )}
                           />
                           <FormField
                            control={shippingForm.control}
                            name="country"
                            render={({ field }) => (
                             <FormItem className="floating-label">
                                <FormControl><Input placeholder=" " {...field} required /></FormControl> {/* Consider using a Select for country */}
                                <FormLabel>Country</FormLabel>
                                <FormMessage />
                              </FormItem>
                            )}
                           />
                       </div>

                      <Button type="submit" size="lg" className="w-full btn-animated btn-animated-accent mt-6" disabled={isProcessing}>
                        Continue to Payment
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

             {/* Payment Form */}
            {currentStep === 'payment' && (
             <Card className="mb-6 shadow-md transition-all duration-500 ease-in-out animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2"><CreditCard className="h-6 w-6"/> Payment Details</CardTitle>
                </CardHeader>
                 <CardContent>
                   <Form {...paymentForm}>
                     <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-6">
                       <FormField
                          control={paymentForm.control}
                          name="paymentMethod"
                          render={({ field }) => (
                             <FormItem className="space-y-3">
                              <FormLabel className="text-lg font-semibold">Select Payment Method</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-2"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0 border p-4 rounded-md has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary/50 transition-all duration-200 cursor-pointer hover:border-muted-foreground/50">
                                    <FormControl><RadioGroupItem value="card" /></FormControl>
                                    <FormLabel className="font-normal cursor-pointer flex-grow">Credit / Debit Card</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0 border p-4 rounded-md has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary/50 transition-all duration-200 cursor-pointer hover:border-muted-foreground/50">
                                    <FormControl><RadioGroupItem value="paypal" /></FormControl>
                                    <FormLabel className="font-normal cursor-pointer flex-grow">PayPal</FormLabel>
                                    {/* Add PayPal icon here if desired */}
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                       {/* Conditional Card Details */}
                       {paymentForm.watch('paymentMethod') === 'card' && (
                         <div className="space-y-4 pt-4 border-t mt-4 animate-fade-in">
                           <FormField
                              control={paymentForm.control}
                              name="cardNumber"
                              render={({ field }) => (
                                <FormItem className="floating-label">
                                  <FormControl><Input placeholder=" " {...field} required={paymentForm.watch('paymentMethod') === 'card'} /></FormControl>
                                  <FormLabel>Card Number</FormLabel>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                               <FormField
                                control={paymentForm.control}
                                name="expiryDate"
                                render={({ field }) => (
                                    <FormItem className="floating-label">
                                    <FormControl><Input placeholder="MM/YY" {...field} required={paymentForm.watch('paymentMethod') === 'card'} /></FormControl>
                                    <FormLabel>Expiry Date</FormLabel>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                               <FormField
                                control={paymentForm.control}
                                name="cvc"
                                render={({ field }) => (
                                    <FormItem className="floating-label">
                                    <FormControl><Input placeholder="CVC" type="password" inputMode="numeric" maxLength={4} {...field} required={paymentForm.watch('paymentMethod') === 'card'} /></FormControl>
                                    <FormLabel>CVC</FormLabel>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </div>
                         </div>
                       )}


                       <div className="flex flex-col sm:flex-row gap-4 mt-6">
                         <Button variant="outline" onClick={() => setCurrentStep('shipping')} className="w-full sm:w-auto btn-animated" disabled={isProcessing}>
                            Back to Shipping
                         </Button>
                         <Button type="submit" size="lg" className="w-full sm:flex-1 btn-animated btn-animated-accent" disabled={isProcessing || !paymentForm.formState.isValid}>
                           {isProcessing ? (
                             <>
                               <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                             </>
                           ) : (paymentForm.watch('paymentMethod') === 'paypal' ? 'Continue with PayPal' : 'Place Order')} {/* Change text for PayPal */}
                         </Button>
                       </div>
                     </form>
                   </Form>
                 </CardContent>
              </Card>
            )}

            {/* Confirmation Message */}
            {currentStep === 'confirmation' && (
                 <Card className="text-center p-8 shadow-lg animate-fade-in border border-green-500/30"> {/* Added border */}
                    <CardHeader>
                         <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4 animate-bounce"/> {/* Changed icon */}
                        <CardTitle className="text-3xl">Order Confirmed!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg text-muted-foreground">Thank you for shopping with ChronoThreads.</p>
                        <p className="text-muted-foreground mt-2">Your order is being processed and you'll receive updates via email.</p>
                         <Link href="/products" className="mt-6 inline-block">
                             <Button variant="outline" className="btn-animated">Continue Shopping</Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:w-1/3">
          <div className="sticky top-20 border p-6 rounded-lg shadow-sm bg-card space-y-4 animate-fade-in">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            {isLoadingSummary ? (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 animate-pulse">
                   {[...Array(2)].map((_, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                            <Skeleton className="h-4 w-12" />
                        </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between"><Skeleton className="h-5 w-1/4" /><Skeleton className="h-5 w-1/4" /></div>
                    <div className="flex justify-between"><Skeleton className="h-5 w-1/4" /><Skeleton className="h-5 w-1/4" /></div>
                    <Separator />
                    <div className="flex justify-between"><Skeleton className="h-6 w-1/3" /><Skeleton className="h-6 w-1/4" /></div>
                </div>
            ) : (
                <>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {orderItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                                <div>
                                    <span className="font-medium">{item.name}</span>
                                    <span className="text-muted-foreground"> (x{item.quantity})</span>
                                </div>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <Separator />
                    <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>${mockSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                        <span>Shipping</span>
                        <span>{mockShipping === 0 ? 'Free' : `$${mockShipping.toFixed(2)}`}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span>${mockTotal.toFixed(2)}</span>
                    </div>
                </>
            )}
               {/* Action Button (Contextual) */}
               {currentStep === 'shipping' && (
                    <Button
                        className="w-full mt-4 btn-animated btn-animated-accent"
                        size="lg"
                        disabled={isProcessing || !shippingForm.formState.isValid} // Disable if form invalid
                        onClick={shippingForm.handleSubmit(onShippingSubmit)} // Trigger shipping submit
                    >
                        Continue to Payment
                    </Button>
                )}
               {currentStep === 'payment' && (
                   <Button
                     type="submit" // Important: Needs to match the form's submit
                     form="paymentForm" // Associate with the correct form ID if needed (though likely handled by Form context)
                     size="lg"
                     className="w-full mt-4 btn-animated btn-animated-accent"
                     disabled={isProcessing || !paymentForm.formState.isValid || isLoadingSummary}
                     onClick={paymentForm.handleSubmit(onPaymentSubmit)} // Trigger payment submit
                   >
                     {isProcessing ? (
                       <>
                         <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                       </>
                     ) : (paymentForm.watch('paymentMethod') === 'paypal' ? 'Continue with PayPal' : 'Place Order')}
                   </Button>
               )}
               {currentStep === 'confirmation' && (
                    <Link href="/products" className="block w-full">
                        <Button className="w-full mt-4 btn-animated" variant="outline">
                             Continue Shopping
                         </Button>
                    </Link>
               )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Animations are now in globals.css
