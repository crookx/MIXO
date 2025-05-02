// src/app/admin/customers/[id]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, User, ShoppingCart, Edit, Trash2, Loader2 } from 'lucide-react';
import { mockCustomers, Customer, mockOrders, Order } from '@/lib/admin-mock-data';
import { Skeleton } from '@/components/ui/skeleton';
import { FormattedDate } from '@/components/ui/formatted-date';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { motion } from 'framer-motion';
import { AnimatedSpinner } from '@/components/ui/animated-spinner';

interface CustomerDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function CustomerDetailsPage({ params: paramsPromise }: CustomerDetailsPageProps) {
  const params = use(paramsPromise);
  const customerId = params.id;

  const { toast } = useToast();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false); // State for delete confirmation

  useEffect(() => {
    setIsLoading(true);
    // Simulate fetching data
    setTimeout(() => {
      const foundCustomer = mockCustomers.find(c => c.id === customerId);
      if (foundCustomer) {
        setCustomer(foundCustomer);
        // Find recent orders for this customer (limit to 5 for display)
        const customerOrders = mockOrders
          .filter(o => o.customerEmail === foundCustomer.email) // Assuming email links orders
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) // Sort by most recent
          .slice(0, 5);
        setRecentOrders(customerOrders);
      } else {
        toast({ title: "Error", description: "Customer not found.", variant: "destructive" });
        // router.push('/admin/customers'); // Redirect if not found
      }
      setIsLoading(false);
    }, 600); // Simulate network delay
  }, [customerId, toast, router]);

   const handleDelete = async () => {
        if (!customer) return;
        setIsDeleting(true);
        console.log(`Deleting customer ${customerId}`);
        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
             // ** TODO: Implement delete logic here **
            toast({
                title: "Customer Deleted",
                description: `${customer.name} has been permanently deleted.`,
                variant: "destructive"
            });
             router.push('/admin/customers'); // Redirect after delete
        } catch (error: any) {
            toast({ title: "Delete Failed", description: `Could not delete customer.`, variant: "destructive" });
            setIsDeleting(false); // Stop loading on error
        }
        // No finally setIsDeleting(false) needed if redirecting on success
   };


  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 shadow-sm">
            <CardHeader className="items-center">
              <Skeleton className="h-24 w-24 rounded-full mb-2" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </CardContent>
            <CardFooter className="flex justify-center gap-2 border-t pt-4">
               <Skeleton className="h-9 w-20" />
               <Skeleton className="h-9 w-20" />
            </CardFooter>
          </Card>
          <Card className="md:col-span-2 shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                   {Array.from({ length: 3 }).map((_, index) => (
                       <div key={index} className="flex justify-between items-center border-b pb-2">
                           <div className="space-y-1">
                               <Skeleton className="h-4 w-24" />
                               <Skeleton className="h-3 w-16" />
                           </div>
                           <div className="space-y-1 text-right">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-20" />
                           </div>
                       </div>
                   ))}
               </div>
               <div className="mt-4 text-center">
                  <Skeleton className="h-9 w-32 inline-block" />
               </div>
            </CardContent>
          </Card>
        </div>
         <div className="flex justify-center items-center py-10">
           <AnimatedSpinner />
         </div>
      </div>
    );
  }

  if (!customer) {
     return (
       <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-muted-foreground">
         <p className="text-xl">Customer not found.</p>
         <Button onClick={() => router.push('/admin/customers')} variant="outline" className="btn-animated">
           <ArrowLeft className="mr-2 h-4 w-4" /> Back to Customers
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
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="h-8 w-8 btn-animated">
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold truncate">Customer: {customer.name}</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Customer Profile Card */}
        <Card className="md:col-span-1 shadow-md card-glow">
          <CardHeader className="items-center text-center">
            {/* Placeholder Avatar */}
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-2 ring-2 ring-offset-2 ring-accent">
               <User className="h-12 w-12 text-muted-foreground" />
            </div>
            <CardTitle>{customer.name}</CardTitle>
            <CardDescription>Joined <FormattedDate date={customer.joinedAt} /></CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
             <p className="flex items-center text-sm text-muted-foreground gap-2">
               <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
               <span>{customer.email}</span>
             </p>
             <p className="flex items-center text-sm text-muted-foreground gap-2">
               <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
               <span>+1-XXX-XXX-XXXX</span> {/* Placeholder Phone */}
             </p>
              <Separator />
             <div className="flex justify-between text-sm">
               <span className="text-muted-foreground">Total Orders:</span>
               <span className="font-medium">{customer.totalOrders}</span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-muted-foreground">Total Spent:</span>
               <span className="font-medium">${customer.totalSpent.toFixed(2)}</span>
             </div>
          </CardContent>
           <CardFooter className="flex justify-center gap-2 border-t pt-4">
              <Button variant="outline" size="sm" className="btn-animated">
                  <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
               {/* Delete Button */}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button variant="destructive" size="sm" className="btn-animated" disabled={isDeleting}>
                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />} Delete
                       </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the customer "{customer.name}" and potentially their associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting} className="btn-animated">Cancel</AlertDialogCancel>
                         <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90 btn-animated">
                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Delete Customer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
           </CardFooter>
        </Card>

        {/* Recent Orders Card */}
        <Card className="md:col-span-2 shadow-md card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <ShoppingCart className="h-5 w-5" /> Recent Orders
            </CardTitle>
            <CardDescription>Last 5 orders placed by this customer.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map(order => (
                  <Link key={order.id} href={`/admin/orders/${order.id}`} className="block hover:bg-muted/50 rounded-md transition-colors -mx-2 px-2 py-1"> {/* Make row clickable */}
                      <div className="flex justify-between items-center">
                        <div>
                           <p className="font-medium text-primary">{order.id}</p>
                           <p className="text-xs text-muted-foreground">
                              <FormattedDate date={order.createdAt} formatString="PPp" />
                           </p>
                        </div>
                        <div className="text-right">
                           <Badge variant={order.status === 'delivered' ? 'default' : order.status === 'cancelled' ? 'destructive' : 'secondary'} className="capitalize mb-1">{order.status}</Badge>
                           <p className="font-semibold">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No orders found for this customer.</p>
            )}
             {customer.totalOrders > 5 && ( // Show only if there are more orders
                 <div className="mt-6 text-center">
                    <Button variant="outline" className="btn-animated" asChild>
                       <Link href={`/admin/customers/${customerId}/orders`}>
                          View All {customer.totalOrders} Orders
                       </Link>
                    </Button>
                 </div>
             )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
