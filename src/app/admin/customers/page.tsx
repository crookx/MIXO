// src/app/admin/customers/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { mockCustomers, Customer } from '@/lib/admin-mock-data';
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
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion'; // Import motion
import { AnimatedSpinner } from '@/components/ui/animated-spinner'; // Import AnimatedSpinner


const ITEMS_PER_PAGE = 10;

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // Added loading state

   // Simulate fetching or modifying data
   // Example: Delete Customer (use with caution!)
   const handleDelete = (id: string) => {
     setIsLoading(true);
     console.log(`Deleting customer ${id}`);
      // Simulate API call
      setTimeout(() => {
          setCustomers(prev => prev.filter(c => c.id !== id));
          setIsLoading(false);
      }, 700);
   };


  // Filtering logic
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredCustomers.slice(startIndex, endIndex);
  }, [filteredCustomers, currentPage]);

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


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold">Customers</h1>
        {/* Optional: Add Customer button? */}
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        {/* Add more filters here if needed (e.g., sort by join date) */}
      </div>

      {/* Customers Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="border rounded-lg overflow-hidden shadow-sm card-glow" // Added card-glow
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Total Orders</TableHead>
              <TableHead className="text-right">Total Spent</TableHead>
              <TableHead>Joined At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {isLoading ? (
               // Skeleton Loading Rows with Futuristic Spinner
              <TableRow>
                <TableCell colSpan={6} className="h-60 text-center">
                  <div className="flex flex-col items-center justify-center gap-4">
                     <AnimatedSpinner className="text-accent" />
                     <span className="text-muted-foreground">Loading customers...</span>
                  </div>
                </TableCell>
              </TableRow>
             ) : paginatedCustomers.length > 0 ? (
              paginatedCustomers.map((customer, index) => (
                <motion.tr // Use motion.tr here
                  key={customer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-muted/50 transition-colors" // Keep TableRow styling classes
                >
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                  <TableCell className="text-right">{customer.totalOrders}</TableCell>
                  <TableCell className="text-right">${customer.totalSpent.toFixed(2)}</TableCell>
                  <TableCell>{format(customer.joinedAt, 'PP')}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isLoading}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Customer Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>View Orders</DropdownMenuItem>
                         {/* Use with caution */}
                         <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(customer.id)}
                            disabled={isLoading}
                         >
                            Delete Customer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr> // End motion.tr
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No customers found{searchTerm ? ' matching your search' : ''}.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-between items-center pt-4"
        >
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
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
