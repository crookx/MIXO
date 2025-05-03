'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear any lingering cart data if needed
    // This would depend on your cart implementation
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4">Order Successful!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your purchase. We'll send you an email with your order details shortly.
        </p>
        <div className="space-y-4">
          <Button 
            onClick={() => router.push('/products')}
            className="w-full"
          >
            Continue Shopping
          </Button>
          <Button 
            variant="outline"
            onClick={() => router.push('/account/orders')}
            className="w-full"
          >
            View Order
          </Button>
        </div>
      </div>
    </div>
  );
}