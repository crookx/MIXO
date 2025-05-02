// src/components/admin/admin-sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebar } from '@/components/ui/sidebar'; // Assuming this hook exists and provides `isMobile` and `state`

// TODO: Replace with actual useSidebar hook or context if not using the provided one
// const useSidebar = () => ({ isMobile: false, state: 'expanded' }); // Placeholder

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings }, // Example settings link
];

export function AdminSidebar() {
  const pathname = usePathname();
  // const { isMobile, state } = useSidebar(); // Use actual sidebar state if available
  const isMobile = false; // Placeholder
  const state = 'expanded'; // Placeholder - 'expanded' or 'collapsed'

  const isCollapsed = !isMobile && state === 'collapsed';

  return (
    <TooltipProvider delayDuration={0}>
      <aside className={cn(
        "flex h-full flex-col border-r bg-secondary text-secondary-foreground transition-all duration-300 ease-in-out",
        isCollapsed ? "w-14" : "w-64" // Adjust width based on collapsed state
      )}>
        <nav className="flex flex-col gap-2 px-2 sm:py-5 flex-grow">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 transition-colors",
                        isActive && "bg-primary text-primary-foreground hover:bg-primary/90",
                        !isActive && "hover:bg-muted hover:text-foreground",
                        isCollapsed && "justify-center px-0 w-10 h-10" // Styles for collapsed state
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="bg-secondary text-secondary-foreground">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>
        <div className="mt-auto p-2 border-t">
           <Tooltip>
              <TooltipTrigger asChild>
                 <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 transition-colors",
                      "hover:bg-destructive/80 hover:text-destructive-foreground",
                       isCollapsed && "justify-center px-0 w-10 h-10" // Styles for collapsed state
                    )}
                    // TODO: Add actual logout functionality
                    onClick={() => console.log("Logout clicked")}
                 >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span className="truncate">Logout</span>}
                 </Button>
              </TooltipTrigger>
               {isCollapsed && (
                  <TooltipContent side="right" className="bg-secondary text-secondary-foreground">
                     Logout
                  </TooltipContent>
               )}
           </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
