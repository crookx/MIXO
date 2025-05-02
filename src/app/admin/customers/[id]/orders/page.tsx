// src/app/admin/customers/[id]/orders/page.tsx
'use client';

import { useState, useMemo, useEffect, use } from 'react'; // Added 'use'
import { mockOrders, Order, OrderStatus, mockCustomers, Customer } from '@/lib/admin-mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, ArrowLeft, Filter, Search } from 'lucide-react';
import { FormattedDate } from '@/components/ui/formatted-date';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AnimatedSpinner } from '@/components/ui/animated-spinner';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const ITEMS_PER_PAGE = 15;

// Helper function to get badge variant based on status
const getStatusBadgeVariant = (status: OrderStatus): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'delivered': return 'default';
    case 'shipped': return 'default';
    case 'processing': return 'secondary';
    case 'pending': return 'secondary';
    case 'cancelled': return 'destructive';
    default: return 'outline';
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

interface CustomerOrdersPageProps {
    params: { id: string }; // Direct access is okay now in `use client`
}

export default function CustomerOrdersPage({ params }: CustomerOrdersPageProps) { // Adjusted for use(params)
  // const params = use(paramsPromise); // No longer needed with direct params access
  const customerId = params.id;

  const router = useRouter();
  const { toast } = useToast();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilters, setStatusFilters] = useState<OrderStatus[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // Loading for both customer and orders

  const allStatuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  useEffect(() => {
      setIsLoading(true);
      // Simulate fetching customer and their orders
      setTimeout(() => {
          const foundCustomer = mockCustomers.find(c => c.id === customerId);
          if (foundCustomer) {
              setCustomer(foundCustomer);
              const customerOrders = mockOrders
                  .filter(o => o.customerEmail === foundCustomer.email) // Match by email
                  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort newest first
              setOrders(customerOrders);
          } else {
              toast({ title: "Error", description: "Customer not found.", variant: "destructive" });
              // Optionally redirect
          }
          setIsLoading(false);
      }, 700);
  }, [customerId, toast]);


  // Simulate modifying order status (copied from admin/orders/page.tsx)
  const handleStatusChange = (id: string, newStatus: OrderStatus) => {
    // Indicate loading state if needed
    console.log(`Changing order ${id} status to ${newStatus}`);
    setTimeout(() => {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
      toast({ description: `Order ${id} marked as ${newStatus}.` });
    }, 500);
  };


  // Filtering logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()); // Search only by Order ID here
      const matchesStatus = statusFilters.length === 0 || statusFilters.includes(order.status);
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleStatusFilterChange = (status: OrderStatus) => {
      setStatusFilters(prev =>
          prev.includes(status)
          ? prev.filter(s => s !== status)
          : [...prev, status]
      );
      setCurrentPage(1); // Reset page when filters change
  }

   if (isLoading) {
     return (
       <div className="flex flex-col gap-6">
         <div className="flex items-center gap-4">
           <Skeleton className="h-8 w-8 rounded-full" />
           <Skeleton className="h-8 w-64" />
         </div>
         <div className="flex items-center gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-24" />
         </div>
         <Skeleton className="h-[400px] w-full rounded-lg" /> {/* Table skeleton */}
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
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">Orders for {customer.name}</h1>
      </div>

      {/* Search and Filters */}
       <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by Order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 btn-animated w-full sm:w-auto">
                <Filter className="h-4 w-4" />
                Status
                {statusFilters.length > 0 && (
                    <Badge variant="secondary" className="ml-1 rounded-sm px-1 font-normal lg:hidden">
                        {statusFilters.length}
                    </Badge>
                 )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {allStatuses.map((status) => (
                    <DropdownMenuCheckboxItem
                        key={status}
                        checked={statusFilters.includes(status)}
                        onCheckedChange={() => handleStatusFilterChange(status)}
                        className="capitalize"
                    >
                         {status}
                    </DropdownMenuCheckboxItem>
                ))}
                 {statusFilters.length > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onSelect={() => setStatusFilters([])}
                            className="justify-center text-center text-sm"
                        >
                            Clear filters
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
          </DropdownMenu>
       </div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="border rounded-lg overflow-hidden shadow-sm card-glow"
      >
        {/* Added overflow-auto for horizontal scrolling */}
        <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Order ID</TableHead>
                  <TableHead className="text-right min-w-[80px]">Total</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[120px]">Date</TableHead>
                  <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                 {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium">
                          <Link href={`/admin/orders/${order.id}`} className="hover:underline hover:text-accent">{order.id}</Link>
                      </TableCell>
                      <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                         <Badge variant={getStatusBadgeVariant(order.status)} className={cn("capitalize whitespace-nowrap", getStatusBadgeClass(order.status))}>
                            {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell><FormattedDate date={order.createdAt} /></TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                             <DropdownMenuItem asChild>
                                 <Link href={`/admin/orders/${order.id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                             <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                             {allStatuses
                                .filter(s => s !== order.status)
                                .map(newStatus => (
                                    <DropdownMenuItem
                                        key={newStatus}
                                        onClick={() => handleStatusChange(order.id, newStatus)}
                                        className="capitalize"
                                    >
                                        Mark as {newStatus}
                                    </DropdownMenuItem>
                                ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No orders found{statusFilters.length > 0 || searchTerm ? ' matching your criteria' : ''}.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
        </div>
      </motion.div>

       {/* Pagination Controls */}
       {totalPages > 1 && (
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.2, duration: 0.5 }}
           className="flex flex-col sm:flex-row justify-between items-center pt-4 gap-4"
         >
            <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages} ({filteredOrders.length} orders)
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="btn-animated"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="btn-animated"
              >
                Next
              </Button>
            </div>
         </motion.div>
       )}
    </motion.div>
  );
}
