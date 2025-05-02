'use client';

import { useState } from 'react';
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
import { Truck, CreditCard, ShieldCheck } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation'; // For redirection after order

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
    cardNumber: z.string().optional(), // Add more specific validation for card numbers
    expiryDate: z.string().optional(), // Format MM/YY
    cvc: z.string().optional(), // 3-4 digits
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

// Mock Order Summary Data (fetch from cart state in real app)
const mockOrderItems = [
  { id: '1', name: 'Cybernetic Hoodie', price: 120, quantity: 1 },
  { id: '3', name: 'Zero-G Sneakers', price: 180, quantity: 1 },
];
const mockSubtotal = 300;
const mockShipping = 0;
const mockTotal = 300;


export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const { toast } = useToast();
  const router = useRouter();

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

   const onPaymentSubmit: SubmitHandler<PaymentFormValues> = (data) => {
    console.log('Payment Data:', data);
    // Simulate order placement
    toast({
        title: "Order Placed Successfully!",
        description: "Thank you for your purchase. You'll receive a confirmation email shortly.",
        duration: 5000, // Keep toast longer
    });
    setCurrentStep('confirmation'); // Move to confirmation (optional state)
     // Redirect to a thank you page or clear cart after a delay
     setTimeout(() => {
        // Clear cart logic here
        router.push('/'); // Redirect to homepage
     }, 3000);
  };


  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Checkout Steps */}
        <div className="flex-grow lg:w-2/3">
           {/* Step Indicators (Optional) */}
           <div className="flex justify-center space-x-4 md:space-x-8 mb-8">
             <div className={`flex items-center gap-2 ${currentStep === 'shipping' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
               <Truck className="h-5 w-5"/> Shipping
             </div>
             <Separator orientation="vertical" className={`h-6 ${currentStep === 'payment' || currentStep === 'confirmation' ? 'bg-primary' : 'bg-border'}`}/>
              <div className={`flex items-center gap-2 ${currentStep === 'payment' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
               <CreditCard className="h-5 w-5"/> Payment
             </div>
              <Separator orientation="vertical" className={`h-6 ${currentStep === 'confirmation' ? 'bg-primary' : 'bg-border'}`}/>
             <div className={`flex items-center gap-2 ${currentStep === 'confirmation' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                <ShieldCheck className="h-5 w-5"/> Confirmation
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
                              <Input placeholder=" " {...field} />
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
                                <FormControl><Input placeholder=" " {...field} /></FormControl>
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
                                <FormControl><Input placeholder=" " {...field} /></FormControl>
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
                            <FormControl><Input placeholder=" " {...field} /></FormControl>
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
                                <FormControl><Input placeholder=" " {...field} /></FormControl>
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
                                <FormControl><Input placeholder=" " {...field} /></FormControl>
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
                                <FormControl><Input placeholder=" " {...field} /></FormControl> {/* Consider using a Select for country */}
                                <FormLabel>Country</FormLabel>
                                <FormMessage />
                              </FormItem>
                            )}
                           />
                       </div>

                      <Button type="submit" size="lg" className="w-full btn-animated btn-animated-accent mt-6">
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
                                  <FormItem className="flex items-center space-x-3 space-y-0 border p-4 rounded-md has-[:checked]:border-primary transition-colors">
                                    <FormControl><RadioGroupItem value="card" /></FormControl>
                                    <FormLabel className="font-normal cursor-pointer flex-grow">Credit / Debit Card</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0 border p-4 rounded-md has-[:checked]:border-primary transition-colors">
                                    <FormControl><RadioGroupItem value="paypal" /></FormControl>
                                    <FormLabel className="font-normal cursor-pointer flex-grow">PayPal</FormLabel>
                                    {/* Add PayPal icon */}
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
                                  <FormControl><Input placeholder=" " {...field} /></FormControl>
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
                                    <FormControl><Input placeholder="MM/YY" {...field} /></FormControl>
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
                                    <FormControl><Input placeholder=" " type="password" {...field} /></FormControl>
                                    <FormLabel>CVC</FormLabel>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </div>
                         </div>
                       )}


                       <div className="flex flex-col sm:flex-row gap-4 mt-6">
                         <Button variant="outline" onClick={() => setCurrentStep('shipping')} className="w-full sm:w-auto btn-animated">
                            Back to Shipping
                         </Button>
                         <Button type="submit" size="lg" className="w-full sm:flex-1 btn-animated btn-animated-accent" disabled={paymentForm.formState.isSubmitting}>
                           {paymentForm.formState.isSubmitting ? 'Processing...' : 'Place Order'}
                         </Button>
                       </div>
                     </form>
                   </Form>
                 </CardContent>
              </Card>
            )}

            {/* Confirmation Message */}
            {currentStep === 'confirmation' && (
                 <Card className="text-center p-8 shadow-lg animate-fade-in">
                    <CardHeader>
                         <ShieldCheck className="h-16 w-16 text-green-500 mx-auto mb-4"/>
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
          <div className="sticky top-20 border p-6 rounded-lg shadow-sm bg-card space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {mockOrderItems.map(item => (
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
               {/* Show Place Order button here only if on payment step, otherwise it's in the form */}
               {currentStep !== 'payment' && currentStep !== 'confirmation' && (
                    <Button
                        className="w-full mt-4 btn-animated btn-animated-accent"
                        size="lg"
                        disabled={currentStep !== 'shipping'} // Disable if not on shipping step yet
                        onClick={() => shippingForm.handleSubmit(onShippingSubmit)()} // Trigger shipping submit
                    >
                        Continue to Payment
                    </Button>
                )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple fade-in animation for steps
// Add this to your globals.css or a style tag if not using Tailwind JIT animations
/*
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out forwards;
}
*/
// Ensure tailwind config includes the animation:
// theme: { extend: { keyframes: { 'fade-in': ... }, animation: { 'fade-in': ... } } }
