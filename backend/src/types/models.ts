import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
  features: string[];
  status: 'draft' | 'active' | 'outOfStock' | 'discontinued';
}

export interface IOrder extends Document {
  user: IUser['_id'];
  items: Array<{
    product: IProduct['_id'];
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }>;
  shipping: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  payment: {
    method: 'mpesa' | 'card' | 'paypal';
    transactionId?: string;
    amount?: number;
    status: 'pending' | 'completed' | 'failed';
    paidAt?: Date;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shippingCost: number;
  total: number;
}