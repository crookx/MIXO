// src/app/admin/products/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save, Archive, Trash2, Eye } from 'lucide-react'; // Import icons
import { mockProducts, Product } from '@/lib/admin-mock-data'; // Import mock data
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"; // Import Alert Dialog
import { FormattedDate } from '@/components/ui/formatted-date'; // Import FormattedDate
import { motion } from 'framer-motion'; // Import motion
import { AnimatedSpinner } from '@/components/ui/animated-spinner';

// Schema for product editing validation
const productSchema = z.object({
  name: z.string().min(1, { message: "Product name is required." }),
  category: z.string().min(1, { message: "Category is required." }),
  price: z.coerce.number().min(0.01, { message: "Price must be positive." }),
  stock: z.coerce.number().int().min(0, { message: "Stock must be 0 or more." }),
  description: z.string().optional(),
  status: z.enum(['active', 'archived']),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductEditPageProps {
  params: Promise<{ id: string }>; // Updated for Next.js 15
}

export default function EditProductPage({ params: paramsPromise }: ProductEditPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { // Initialize with empty/default values
      name: '',
      category: '',
      price: 0,
      stock: 0,
      description: '',
      status: 'active',
    },
  });

  // Fetch product data on mount
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      const params = await paramsPromise; // Await the promise to get productId
      const productId = params.id;

      // Simulate fetching data
      const foundProduct = mockProducts.find(p => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
        form.reset({
          name: foundProduct.name,
          category: foundProduct.category,
          price: foundProduct.price,
          stock: foundProduct.stock,
          description: '', // Assuming description is not in mock Product type yet
          status: foundProduct.status,
        });
      } else {
        toast({ title: "Error", description: "Product not found.", variant: "destructive" });
        router.push('/admin/products'); // Redirect if not found
      }
      setIsLoading(false);
    };

    fetchProduct();
  }, [paramsPromise, form, toast, router]);

  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    setIsSubmitting(true);
    console.log('Updating Product:', product?.id, data);
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // ** TODO: Implement actual product update logic here **

      // Update local state for demo purposes (won't persist)
      if (product) {
        setProduct({ ...product, ...data, createdAt: product.createdAt });
      }

      toast({
        title: "Product Updated Successfully!",
        description: `${data.name} has been updated.`,
      });
      // Optionally redirect or stay on page
    } catch (error: any) {
      console.error("Product update error:", error);
      toast({
        title: "Product Update Failed",
        description: error.message || "There was an issue updating the product.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchiveToggle = async () => {
    if (!product) return;
    setIsArchiving(true);
    const newStatus = product.status === 'active' ? 'archived' : 'active';
    console.log(`${newStatus === 'archived' ? 'Archiving' : 'Activating'} product ${product.id}`);
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 700));
      setProduct({ ...product, status: newStatus });
      form.setValue('status', newStatus); // Update form state as well
      toast({
        title: `Product ${newStatus === 'archived' ? 'Archived' : 'Activated'}`,
        description: `${product.name} is now ${newStatus}.`,
      });
    } catch (error: any) {
      toast({ title: "Action Failed", description: `Could not ${newStatus === 'archived' ? 'archive' : 'activate'} product.`, variant: "destructive" });
    } finally {
      setIsArchiving(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    setIsDeleting(true);
    console.log(`Deleting product ${product.id}`);
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Product Deleted",
        description: `${product.name} has been permanently deleted.`,
        variant: "destructive"
      });
      router.push('/admin/products'); // Redirect after delete
    } catch (error: any) {
      toast({ title: "Delete Failed", description: `Could not delete product.`, variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
         <Card className="shadow-md">
           <CardHeader>
             <Skeleton className="h-6 w-1/3" />
             <Skeleton className="h-4 w-2/3" />
           </CardHeader>
           <CardContent className="grid gap-6">
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
             <div className="grid md:grid-cols-2 gap-6">
               <Skeleton className="h-10 w-full" />
               <Skeleton className="h-10 w-full" />
             </div>
             <Skeleton className="h-24 w-full" />
           </CardContent>
           <CardFooter className="border-t px-6 py-4 flex justify-between">
             <Skeleton className="h-10 w-24" />
             <div className="flex gap-2">
               <Skeleton className="h-10 w-24" />
               <Skeleton className="h-10 w-24" />
             </div>
           </CardFooter>
         </Card>
         <div className="flex justify-center items-center py-10">
           <AnimatedSpinner />
         </div>
      </div>
    );
  }

  if (!product) {
     return (
       <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-muted-foreground">
         <p className="text-xl">Product not found.</p>
         <Button onClick={() => router.push('/admin/products')} variant="outline" className="btn-animated">
           <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
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
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()} className="h-8 w-8 btn-animated">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold truncate">Edit: {product.name}</h1>
         </div>
          <Button variant="outline" size="sm" className="btn-animated" asChild>
              <a href={`/products/${product.id}`} target="_blank" rel="noopener noreferrer">
                <Eye className="mr-2 h-4 w-4" /> View Live
              </a>
         </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="shadow-md card-glow">
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>
                 Edit product details. Created on: <FormattedDate date={product.createdAt} formatString="PPP" />
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              {/* Product Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="floating-label">
                    <FormControl><Input placeholder=" " {...field} /></FormControl>
                    <FormLabel>Product Name</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
               <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="floating-label">
                    <FormControl><Input placeholder=" " {...field} /></FormControl>
                    <FormLabel>Category</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                 {/* Price */}
                 <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="floating-label">
                       <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder=" "
                            {...field}
                           />
                       </FormControl>
                      <FormLabel>Price ($)</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Stock */}
                 <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem className="floating-label">
                       <FormControl>
                          <Input
                            type="number"
                            step="1"
                            placeholder=" "
                            {...field}
                           />
                       </FormControl>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               {/* Description */}
               <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="floating-label">
                     <FormControl>
                        <Textarea
                            placeholder=" "
                            className="resize-y min-h-[100px]"
                            {...field}
                         />
                     </FormControl>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <CardFooter className="px-6 py-4 flex justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isArchiving || isDeleting}
              onClick={handleArchiveToggle}
              className="btn-animated"
            >
              <Archive className="mr-2 h-4 w-4" /> {product.status === 'active' ? 'Archive' : 'Activate'}
            </Button>

            <div className="flex gap-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isDeleting}
                    onClick={() => setIsDeleting(true)}
                    className="btn-animated"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this product?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="btn-animated">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="btn-animated btn-destructive"
                    >
                      Delete Product
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn-animated"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </motion.div>
  );
}
