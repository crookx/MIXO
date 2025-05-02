// src/app/admin/orders/page.tsx
'use client';

import { useState, useMemo } from 'react';
// Import mockCustomers here
import { mockOrders, Order, OrderStatus, mockCustomers } from '@/lib/admin-mock-data';
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
  DropdownMenuCheckboxItem, // For status filtering
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search, Filter } from 'lucide-react';
// import { format } from 'date-fns'; // No longer needed directly here
import { FormattedDate } from '@/components/ui/formatted-date'; // Import FormattedDate
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion'; // Import motion
import { AnimatedSpinner } from '@/components/ui/animated-spinner'; // Import AnimatedSpinner
import Link from 'next/link'; // Import Link


const ITEMS_PER_PAGE = 10;

// Helper function to get badge variant based on status
const getStatusBadgeVariant = (status: OrderStatus): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'delivered': return 'default'; // Greenish
    case 'shipped': return 'default'; // Blueish
    case 'processing': return 'secondary'; // Yellowish
    case 'pending': return 'secondary'; // Greyish
    case 'cancelled': return 'destructive'; // Reddish
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


export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilters, setStatusFilters] = useState<OrderStatus[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const allStatuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  // Simulate modifying order status
  const handleStatusChange = (id: string, newStatus: OrderStatus) => {
    setIsLoading(true);
    console.log(`Changing order ${id} status to ${newStatus}`);
    // Simulate API call
    setTimeout(() => {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
      setIsLoading(false);
    }, 500);
  };


  // Filtering logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilters.length === 0 || statusFilters.includes(order.status);
      return matchesSearch && matchesStatus;
    }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by newest first
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


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold">Orders</h1>
        {/* Optional: Add Order button? */}
      </div>

      {/* Search and Filters */}
       <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search orders by ID, name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 btn-animated w-full sm:w-auto"> {/* Make full width on mobile */}
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
        className="border rounded-lg overflow-hidden shadow-sm card-glow" // Added card-glow
      >
        {/* Added overflow-auto for horizontal scrolling on small screens */}
        <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Order ID</TableHead>
                  <TableHead className="min-w-[150px]">Customer</TableHead>
                  <TableHead className="min-w-[180px]">Email</TableHead>
                  <TableHead className="text-right min-w-[80px]">Total</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[120px]">Date</TableHead>
                  <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                 {isLoading && paginatedOrders.length === 0 ? ( // Show spinner only if truly loading initial data
                  <TableRow>
                    <TableCell colSpan={7} className="h-60 text-center">
                      <div className="flex flex-col items-center justify-center gap-4">
                         <AnimatedSpinner className="text-accent" />
                         <span className="text-muted-foreground">Loading orders...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order, index) => (
                    <motion.tr // Use motion.tr here
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-muted/50 transition-colors" // Keep TableRow styling classes
                    >
                      <TableCell className="font-medium">
                        <Link href={`/admin/orders/${order.id}`} className="hover:underline hover:text-accent">{order.id}</Link>
                      </TableCell>
                      <TableCell>
                        <Link href={`/admin/customers/${mockCustomers.find(c => c.email === order.customerEmail)?.id ?? '#'}`} className="hover:underline hover:text-accent">{order.customerName}</Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{order.customerEmail}</TableCell>
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
                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isLoading}>
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
                                .filter(s => s !== order.status) // Don't show current status as an option
                                .map(newStatus => (
                                    <DropdownMenuItem
                                        key={newStatus}
                                        onClick={() => handleStatusChange(order.id, newStatus)}
                                        className="capitalize"
                                        disabled={isLoading} // Disable while loading
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
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
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
                Page {currentPage} of {totalPages} ({filteredOrders.length} total orders)
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1 || isLoading}
                className="btn-animated"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages || isLoading}
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
