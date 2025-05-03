import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const { toast } = useToast();

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      checkAuth: async () => {
        const token = get().token;
        if (!token) return false;

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (!response.ok) {
            set({ user: null, token: null });
            return false;
          }

          const userData = await response.json();
          set({ user: userData });
          return true;
        } catch (error) {
          set({ user: null, token: null });
          return false;
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) throw new Error('Login failed');

          const data = await response.json();
          set({ 
            user: data.user, 
            token: data.token, 
            isLoading: false 
          });

          // Store token in localStorage for persistence
          localStorage.setItem('auth-token', data.token);

          toast({
            title: 'Welcome back!',
            description: 'Successfully logged in',
          });
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Invalid credentials',
            variant: 'destructive',
          });
          set({ isLoading: false });
        }
      },

      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name }),
          });

          if (!response.ok) throw new Error('Signup failed');

          const data = await response.json();
          set({ 
            user: data.user, 
            token: data.token, 
            isLoading: false 
          });

          localStorage.setItem('auth-token', data.token);

          toast({
            title: 'Welcome!',
            description: 'Account created successfully',
          });
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Could not create account',
            variant: 'destructive',
          });
          set({ isLoading: false });
        }
      },

      logout: () => {
        localStorage.removeItem('auth-token');
        set({ user: null, token: null });
        toast({
          title: 'Goodbye!',
          description: 'Successfully logged out',
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);