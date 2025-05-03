'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState } from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.imageUrl || product.images?.[0] || '/placeholder.png';

  return (
    <Link href={`/products/${product._id}`}>
      <div className="group relative overflow-hidden rounded-lg border hover:shadow-lg transition-shadow duration-300">
        <div className="aspect-square overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <p className="text-muted-foreground">${product.price.toFixed(2)}</p>
          {product.compareAtPrice && (
            <p className="text-sm text-muted-foreground line-through">
              ${product.compareAtPrice.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
