// src/app/admin/products/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { mockProducts, Product } from '@/lib/admin-mock-data';
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
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, Search } from 'lucide-react';
// import { format } from 'date-fns'; // No longer needed directly here
import { FormattedDate } from '@/components/ui/formatted-date'; // Import FormattedDate
import { Skeleton } from '@/components/ui/skeleton'; // For loading state
import { motion } from 'framer-motion'; // Import motion
import { AnimatedSpinner } from '@/components/ui/animated-spinner'; // Import AnimatedSpinner
import Link from 'next/link'; // Import Link

const ITEMS_PER_PAGE = 10;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  // Simulate fetching or modifying data
  const handleArchive = (id: string) => {
     setIsLoading(true);
    console.log(`Archiving product ${id}`);
     // Simulate API call
     setTimeout(() => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'archived' } : p));
        setIsLoading(false);
     }, 500);
  };

   const handleActivate = (id: string) => {
     setIsLoading(true);
    console.log(`Activating product ${id}`);
     // Simulate API call
     setTimeout(() => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'active' } : p));
        setIsLoading(false);
     }, 500);
  };

   const handleDelete = (id: string) => {
     setIsLoading(true);
    console.log(`Deleting product ${id}`);
     // Simulate API call
     setTimeout(() => {
        setProducts(prev => prev.filter(p => p.id !== id));
        setIsLoading(false);
     }, 500);
  };


  // Filtering logic
  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

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
        <h1 className="text-2xl md:text-3xl font-bold">Products</h1>
        <Button asChild className="btn-animated btn-animated-accent">
          <Link href="/admin/products/create"> {/* Link to create page */}
            <PlusCircle className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
       <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          {/* Add more filters here if needed (e.g., category dropdown) */}
       </div>

      {/* Products Table */}
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
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && paginatedProducts.length === 0 ? ( // Show spinner only if truly loading initial data
              <TableRow>
                <TableCell colSpan={7} className="h-60 text-center">
                  <div className="flex flex-col items-center justify-center gap-4">
                     <AnimatedSpinner className="text-accent" />
                     <span className="text-muted-foreground">Loading products...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedProducts.length > 0 ? (
              paginatedProducts.map((product, index) => (
                <motion.tr // Use motion.tr here
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-muted/50 transition-colors" // Keep TableRow styling classes
                >
                  <TableCell className="font-medium">
                    <Link href={`/admin/products/${product.id}`} className="hover:underline hover:text-accent">{product.name}</Link>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                  <TableCell className={`text-right ${product.stock === 0 ? 'text-destructive' : ''}`}>
                      {product.stock}
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.status === 'active' ? 'default' : 'secondary'} className={product.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}>
                       {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell><FormattedDate date={product.createdAt} /></TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isLoading}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                         <DropdownMenuItem disabled={isLoading} asChild>
                             <Link href={`/admin/products/${product.id}`}>Edit</Link>
                        </DropdownMenuItem>
                        {product.status === 'active' ? (
                           <DropdownMenuItem onClick={() => handleArchive(product.id)} disabled={isLoading}>Archive</DropdownMenuItem>
                        ) : (
                           <DropdownMenuItem onClick={() => handleActivate(product.id)} disabled={isLoading}>Activate</DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(product.id)} disabled={isLoading}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr> // End motion.tr - Ensure no whitespace before/after TableCells
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No products found{searchTerm ? ' matching your search' : ''}.
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
