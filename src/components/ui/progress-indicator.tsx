import { Loader2 } from 'lucide-react';

interface ProgressIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8'
};

export function ProgressIndicator({ size = 'md', className }: ProgressIndicatorProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizeMap[size]} animate-spin`} />
    </div>
  );
}