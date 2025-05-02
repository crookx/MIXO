// src/components/ui/animated-spinner.tsx
import { cn } from "@/lib/utils";

export function AnimatedSpinner({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("futuristic-spinner", className)} // Use the class defined in globals.css
      role="status" // Add role for accessibility
      aria-live="polite" // Indicate content may update
      aria-label="Loading..." // Provide accessible label
      {...props}
    />
  );
}
