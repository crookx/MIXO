'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState } from 'react';
import { ShoppingCart, Eye } from 'lucide-react'; // Changed icon to Eye for 'View Details'
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description?: string; // Optional description for hover
  // Add other relevant product properties like sizes, colors if needed for hover
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false); // State to track image loading

  return (
    <Card
      className="overflow-hidden transition-all duration-300 ease-in-out shadow-md hover:shadow-xl transform hover:-translate-y-1 group bg-card" // Ensure background color for loading state
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`} className="block">
        <CardHeader className="p-0 relative aspect-[3/4] overflow-hidden">
          {!imageLoaded && <Skeleton className="absolute inset-0 h-full w-full" />} {/* Skeleton Loader */}
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill // Use fill instead of layout
            style={{ objectFit: 'cover' }} // Use style for objectFit
            className={`transition-transform duration-500 ease-in-out group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} // Fade in image when loaded
            data-ai-hint="fashion clothing item"
            onLoad={() => setImageLoaded(true)} // Set image loaded state
            priority={false} // Consider setting priority based on position in grid
          />
          {/* Hover Effect Overlay - More subtle */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex flex-col items-center justify-end p-4 text-center text-primary-foreground transition-opacity duration-400 ease-in-out ${
              isHovered && imageLoaded ? 'opacity-100' : 'opacity-0' // Only show on hover and when image is loaded
            }`}
          >
             {/* Optional: Show description on hover */}
             {/* {product.description && <p className="text-sm mb-2 opacity-90">{product.description}</p>} */}
            <Button variant="outline" size="sm" className="mt-4 bg-transparent border-primary-foreground/70 text-primary-foreground/90 hover:bg-primary-foreground hover:text-primary hover:border-primary-foreground transition-all duration-300">
              <Eye className="mr-2 h-4 w-4" /> {/* Changed Icon */}
              View Details
            </Button>
          </div>
        </CardHeader>
      </Link>
      <CardContent className="p-4">
        {/* Skeleton for text if needed, but usually loads fast */}
        <Link href={`/products/${product.id}`}>
          <CardTitle className="text-lg font-semibold mb-1 truncate hover:text-accent transition-colors">
            {product.name}
          </CardTitle>
        </Link>
        <CardDescription className="text-muted-foreground">${product.price.toFixed(2)}</CardDescription>
      </CardContent>
       {/* Optional: Add to cart directly from card (Consider UX implications) */}
       {/* <CardFooter className="p-4 pt-0">
         <Button className="w-full btn-animated btn-animated-accent">
           <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
         </Button>
       </CardFooter> */}
    </Card>
  );
};

export default ProductCard;
