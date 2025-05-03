import axios from 'axios';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

interface CartUpdateData {
  quantity: number;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const cartApi = {
  get: async () => {
    const response = await api.get<CartItem[]>('/api/cart');
    return response.data;
  },

  add: async (productId: string, data: Partial<CartItem>) => {
    const response = await api.post<CartItem>(`/api/cart`, {
      productId,
      ...data
    });
    return response.data;
  },

  update: async (id: string, data: CartUpdateData) => {
    const response = await api.put<CartItem>(`/api/cart/${id}`, data);
    return response.data;
  },

  remove: async (id: string) => {
    await api.delete(`/api/cart/${id}`);
  },

  clear: async () => {
    await api.delete('/api/cart');
  }
};