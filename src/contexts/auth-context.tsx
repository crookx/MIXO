import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check authentication status on mount
    auth.checkAuth();
  }, []);

  const value: AuthContextType = {
    ...auth,
    isAuthenticated: !!auth.user,
    checkAuth: async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (!token) return false;

        // Verify token with backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        return response.ok;
      } catch (error) {
        return false;
      }
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

// Protected route wrapper
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options = { requireAdmin: false }
) {
  return function ProtectedRoute(props: P) {
    const { user, isLoading, isAuthenticated } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/auth/login');
      }

      if (options.requireAdmin && user?.role !== 'admin') {
        router.push('/');
      }
    }, [isLoading, isAuthenticated, user]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}