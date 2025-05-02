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
import { ArrowLeft, Loader2, PlusCircle, Upload } from 'lucide-react'; // Added Upload icon
import { motion } from 'framer-motion'; // Import motion

// Schema for product creation validation
const productSchema = z.object({
  name: z.string().min(1, { message: "Product name is required." }),
  category: z.string().min(1, { message: "Category is required." }),
  price: z.coerce.number().min(0.01, { message: "Price must be positive." }), // Coerce to number
  stock: z.coerce.number().int().min(0, { message: "Stock (Quantity) must be 0 or more." }), // Renamed label in UI, kept 'stock' internally
  description: z.string().optional(), // Description is optional
  // images: z.any().optional(), // Placeholder for image upload logic
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

                {/* Stock (Quantity) */}
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
                      <FormLabel>Stock Quantity</FormLabel> {/* Updated Label */}
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

               {/* Image Upload Placeholder */}
               <div className="space-y-1">
                 <Label htmlFor="product-images">Product Images</Label>
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (Recommended: 800x1000px)</p>
                        </div>
                        <Input id="dropzone-file" type="file" className="hidden" multiple accept="image/*" />
                         {/* TODO: Add image preview and handling logic */}
                    </label>
                  </div>
                 <p className="text-xs text-muted-foreground pt-1">Upload one or more images for the product.</p>
               </div>


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
