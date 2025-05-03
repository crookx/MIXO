import axios from 'axios';
import { Product } from '@/types/product';

interface ProductResponse {
  products: Product[];
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Important for CORS with credentials
});

export const productApi = {
  getAll: async (params?: {
    category?: string;
    size?: string;
    maxPrice?: number;
    search?: string;
  }) => {
    try {
      const response = await api.get<ProductResponse>('/products', { params });
      return {
        data: response.data.products || []
      };
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  getOne: async (id: string) => {
    const response = await api.get<{ product: Product }>(`/products/${id}`);
    return {
      data: response.data.product
    };
  }
};

export default api;