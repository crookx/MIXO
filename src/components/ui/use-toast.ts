import { Toast } from '@/components/ui/toast'

interface ToastProps {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  const toast = ({ title, description, variant = 'default' }: ToastProps) => {
    // Implementation will be added when we create the Toast component
  }

  return { toast }
}