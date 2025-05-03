export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  imageUrl?: string; // Add this for compatibility
  category: string;
  subcategory: string;
  sizes: string[];
  colors: string[];
  stock: number;
  features: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}