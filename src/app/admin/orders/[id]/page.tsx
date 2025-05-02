// src/app/admin/orders/[id]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Mail, MapPin, Package, DollarSign, CreditCard, Calendar, Hash, Loader2, Phone } from 'lucide-react'; // Added Hash, Phone
import { mockOrders, Order, OrderStatus, mockCustomers, Customer, mockProducts, Product } from '@/lib/admin-mock-data'; // Import necessary data
import { Skeleton } from '@/components/ui/skeleton';
import { FormattedDate } from '@/components/ui/formatted-date';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AnimatedSpinner } from '@/components/ui/animated-spinner';

// Interface for items within an order (simplified)
interface OrderItem {
    product: Product; // Reference the full product
    quantity: number;
    priceAtPurchase: number; // Price might change over time
}

// Helper function to get badge variant/class based on status (copied)
const getStatusBadgeVariant = (status: OrderStatus): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'delivered': return 'default'; case 'shipped': return 'default'; case 'processing': return 'secondary';
    case 'pending': return 'secondary'; case 'cancelled': return 'destructive'; default: return 'outline';
  }
};
const getStatusBadgeClass = (status: OrderStatus): string => {
    switch (status) {
        case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        case 'shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        case 'processing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
        case 'pending': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        default: return 'border';
    }
};

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

// Mock function to get order items (replace with actual data fetching)
const getOrderItems = async (orderId: string): Promise<OrderItem[]> => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate delay
    // Randomly associate some products with the order for demo
    const items: OrderItem[] = [];
    const numItems = Math.floor(Math.random() * 3) + 1; // 1 to 3 items
    const shuffledProducts = [...mockProducts].sort(() => 0.5 - Math.random());

    for (let i = 0; i < numItems; i++) {
        const product = shuffledProducts[i];
        if (product) {
            items.push({
                product: product,
                quantity: Math.floor(Math.random() * 2) + 1, // 1 or 2 quantity
                priceAtPurchase: product.price // Use current price for demo
            });
        }
    }
    return items;
};


export default function OrderDetailsPage({ params: paramsPromise }: OrderDetailsPageProps) {
  const params = use(paramsPromise);
  const orderId = params.id;

  const { toast } = useToast();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const allStatuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  useEffect(() => {
    setIsLoading(true);
    // Simulate fetching order, customer, and items
    const fetchData = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 600)); // Simulate combined delay
            const foundOrder = mockOrders.find(o => o.id === orderId);

            if (foundOrder) {
                setOrder(foundOrder);
                const foundCustomer = mockCustomers.find(c => c.email === foundOrder.customerEmail);
                setCustomer(foundCustomer || null); // Set customer or null if not found

                const items = await getOrderItems(orderId);
                setOrderItems(items);

            } else {
                toast({ title: "Error", description: "Order not found.", variant: "destructive" });
                // router.push('/admin/orders');
            }
        } catch (error) {
             toast({ title: "Error", description: "Failed to load order details.", variant: "destructive" });
        } finally {
             setIsLoading(false);
        }
    };
    fetchData();
  }, [orderId, toast, router]);

  // Simulate modifying order status
  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;
    setIsUpdatingStatus(true);
    console.log(`Changing order ${orderId} status to ${newStatus}`);
    // Simulate API call
    try {
        await new Promise(resolve => setTimeout(resolve, 800));
        // ** TODO: Implement status update logic here **
        setOrder({ ...order, status: newStatus }); // Update local state
        toast({ description: `Order ${orderId} marked as ${newStatus}.` });
    } catch (error) {
        toast({ title: "Status Update Failed", description: `Could not update status.`, variant: "destructive" });
    } finally {
         setIsUpdatingStatus(false);
    }
  };


  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
         <div className="grid md:grid-cols-3 gap-6">
             {/* Order Details Skeleton */}
             <Card className="md:col-span-2 shadow-sm">
                 <CardHeader>
                     <Skeleton className="h-6 w-1/2" />
                     <Skeleton className="h-4 w-3/4" />
                 </CardHeader>
                 <CardContent className="space-y-4">
                     <Skeleton className="h-5 w-full" />
                     <Skeleton className="h-5 w-full" />
                     <Skeleton className="h-5 w-full" />
                      <Separator />
                     <Skeleton className="h-20 w-full" /> {/* Items table skeleton */}
                      <Separator />
                     <div className="flex justify-end"><Skeleton className="h-6 w-1/4" /></div>
                 </CardContent>
                 <CardFooter className="border-t pt-4">
                     <Skeleton className="h-9 w-32" />
                 </CardFooter>
             </Card>
             {/* Customer Details Skeleton */}
              <Card className="md:col-span-1 shadow-sm">
                 <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                 </CardHeader>
                 <CardContent className="space-y-3">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                 </CardContent>
             </Card>
         </div>
         <div className="flex justify-center items-center py-10">
           <AnimatedSpinner />
         </div>
      </div>
    );
  }

  if (!order) {
     return (
       <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-muted-foreground">
         <p className="text-xl">Order not found.</p>
         <Button onClick={() => router.push('/admin/orders')} variant="outline" className="btn-animated">
           <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
         </Button>
       </div>
     );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6"
    >
      <div className="flex items-center gap-4 justify-between">
         <div className="flex items-center gap-4">
             <Button variant="outline" size="icon" onClick={() => router.back()} className="h-8 w-8 btn-animated">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
             </Button>
             <h1 className="text-2xl md:text-3xl font-bold">Order {order.id}</h1>
         </div>
          {/* Status Change Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="btn-animated" disabled={isUpdatingStatus}>
                 {isUpdatingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                 Change Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Set Order Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {allStatuses.map(newStatus => (
                <DropdownMenuItem
                  key={newStatus}
                  onClick={() => handleStatusChange(newStatus)}
                  disabled={newStatus === order.status || isUpdatingStatus} // Disable current status and while updating
                  className="capitalize"
                >
                  Mark as {newStatus}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Order Details & Items */}
        <Card className="md:col-span-2 shadow-md card-glow">
          <CardHeader>
            <div className="flex justify-between items-start">
                 <div>
                    <CardTitle className="flex items-center gap-2"><Hash className="h-5 w-5"/> Order Details</CardTitle>
                    <CardDescription>
                        Placed on <FormattedDate date={order.createdAt} formatString="PPPp" />
                    </CardDescription>
                 </div>
                 <Badge variant={getStatusBadgeVariant(order.status)} className={cn("capitalize text-base px-3 py-1", getStatusBadgeClass(order.status))}>
                    {order.status}
                </Badge>
             </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Shipping Info (Placeholder) */}
             <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2"><MapPin className="h-4 w-4 text-primary"/> Shipping Address</h3>
                <p className="text-sm text-muted-foreground">
                    {customer?.name || 'N/A'}<br />
                    123 Future Street<br />
                    Neo City, CA 90210<br />
                    United States
                </p>
            </div>
             <Separator />
             {/* Items Table */}
             <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2"><Package className="h-4 w-4 text-primary"/> Items Ordered</h3>
                 <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>Product</TableHead>
                           <TableHead className="text-center">Quantity</TableHead>
                           <TableHead className="text-right">Price</TableHead>
                           <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {orderItems.map(item => (
                            <TableRow key={item.product.id}>
                               <TableCell className="font-medium">
                                   <Link href={`/admin/products/${item.product.id}`} className="hover:underline hover:text-accent">
                                       {item.product.name}
                                   </Link>
                                </TableCell>
                               <TableCell className="text-center">{item.quantity}</TableCell>
                               <TableCell className="text-right">${item.priceAtPurchase.toFixed(2)}</TableCell>
                               <TableCell className="text-right">${(item.priceAtPurchase * item.quantity).toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                         {/* Summary Row */}
                         <TableRow className="border-t-2 border-border font-semibold">
                             <TableCell colSpan={3} className="text-right text-lg">Total</TableCell>
                             <TableCell className="text-right text-lg">${order.total.toFixed(2)}</TableCell>
                        </TableRow>
                     </TableBody>
                </Table>
            </div>
             <Separator />
             {/* Payment Info (Placeholder) */}
             <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary"/> Payment Details</h3>
                 <p className="text-sm text-muted-foreground">
                     Method: Credit Card ending in **** 1234<br/>
                     Status: Paid
                 </p>
            </div>
          </CardContent>
           {/* Optional Footer for actions like Print Invoice, Refund etc. */}
           {/* <CardFooter className="border-t pt-4"> */}
               {/* Actions */}
           {/* </CardFooter> */}
        </Card>

        {/* Customer Details Sidebar */}
        <Card className="md:col-span-1 shadow-md card-glow h-fit sticky top-20"> {/* Make sticky */}
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="h-5 w-5"/> Customer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
             {customer ? (
                 <>
                     <p className="font-semibold text-primary">
                         <Link href={`/admin/customers/${customer.id}`} className="hover:underline hover:text-accent">
                            {customer.name}
                         </Link>
                     </p>
                     <p className="flex items-center text-sm text-muted-foreground gap-2">
                       <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                       <span>{customer.email}</span>
                     </p>
                      <p className="flex items-center text-sm text-muted-foreground gap-2">
                       <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                       <span>+1-XXX-XXX-XXXX</span> {/* Placeholder Phone */}
                     </p>
                      <Separator />
                      <p className="text-sm text-muted-foreground">{customer.totalOrders} lifetime orders</p>
                 </>
             ) : (
                 <p className="text-muted-foreground">Customer details not available.</p>
             )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
