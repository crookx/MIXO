'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

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

  return (
    <Card
      className="overflow-hidden transition-all duration-300 ease-in-out shadow-md hover:shadow-xl transform hover:-translate-y-1 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`} className="block">
        <CardHeader className="p-0 relative aspect-[3/4] overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 ease-in-out group-hover:scale-105"
            data-ai-hint="fashion clothing item"
          />
          {/* Hover Effect Overlay */}
          <div
            className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-4 text-center text-primary-foreground transition-opacity duration-300 ease-in-out ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {product.description && <p className="text-sm mb-2">{product.description}</p>}
             {/* Example: Add size/color info if available */}
            {/* <p className="text-xs">Sizes: S, M, L</p> */}
            <Button variant="outline" size="sm" className="mt-4 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              View Details
            </Button>
          </div>
        </CardHeader>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <CardTitle className="text-lg font-semibold mb-1 truncate hover:text-accent transition-colors">
            {product.name}
          </CardTitle>
        </Link>
        <CardDescription className="text-muted-foreground">${product.price.toFixed(2)}</CardDescription>
      </CardContent>
       {/* Optional: Add to cart directly from card */}
       {/* <CardFooter className="p-4 pt-0">
         <Button className="w-full btn-animated btn-animated-accent">
           <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
         </Button>
       </CardFooter> */}
    </Card>
  );
};

export default ProductCard;
