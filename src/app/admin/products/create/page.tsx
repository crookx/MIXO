// src/app/admin/products/create/page.tsx
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Import Textarea
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, PlusCircle } from 'lucide-react'; // Import icons
import { motion } from 'framer-motion'; // Import motion

// Schema for product creation validation
const productSchema = z.object({
  name: z.string().min(1, { message: "Product name is required." }),
  category: z.string().min(1, { message: "Category is required." }),
  price: z.coerce.number().min(0.01, { message: "Price must be positive." }), // Coerce to number
  stock: z.coerce.number().int().min(0, { message: "Stock must be 0 or more." }), // Coerce to integer number
  description: z.string().optional(), // Description is optional
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function CreateProductPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      category: '',
      price: 0,
      stock: 0,
      description: '',
    },
  });

  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    setIsSubmitting(true);
    console.log('Creating Product:', data);
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // ** TODO: Implement actual product creation logic here **
      // Example: await addProductToDatabase(data);

      toast({
        title: "Product Created Successfully!",
        description: `${data.name} has been added to the catalog.`,
      });
      // Redirect back to the products list after success
      router.push('/admin/products');
      // Optionally reset form: form.reset();
    } catch (error: any) {
      console.error("Product creation error:", error);
      toast({
        title: "Product Creation Failed",
        description: error.message || "There was an issue creating the product.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <h1 className="text-2xl md:text-3xl font-bold">Create New Product</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="shadow-md card-glow">
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>Fill in the information for the new product.</CardDescription>
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
                    <FormControl><Input placeholder=" " {...field} /></FormControl> {/* Consider using a Select component here */}
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
                            step="0.01" // Allow decimals for price
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
                            step="1" // Integer steps for stock
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
                            className="resize-y min-h-[100px]" // Allow vertical resize
                            {...field}
                         />
                     </FormControl>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* TODO: Add Image Upload Component Here */}
               {/* <div className="space-y-1">
                 <Label>Product Images</Label>
                 <Input type="file" multiple />
                 <p className="text-xs text-muted-foreground">Upload one or more images.</p>
               </div> */}


            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit" className="btn-animated btn-animated-accent" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Product
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </motion.div>
  );
}
