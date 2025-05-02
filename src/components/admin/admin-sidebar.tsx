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
  PanelLeft, // Import PanelLeft for trigger
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// import { useSidebar } from '@/components/ui/sidebar'; // Remove this placeholder
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'; // Import Sheet components
import { useState } from 'react';
import Image from 'next/image'; // Import Image for logo in mobile sheet
import { Separator } from '@/components/ui/separator'; // Import Separator
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { DialogTitle } from '@/components/ui/dialog';


// TODO: Replace with actual useSidebar hook or context if not using the provided one
// const useSidebar = () => ({ isMobile: false, state: 'expanded' }); // Placeholder - Removed

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings }, // Example settings link
];

const SidebarNavContent = ({ closeSheet }: { closeSheet?: () => void }) => {
   const pathname = usePathname();
   const isMobile = useIsMobile(); // Use hook inside component

   // Determine if sidebar is collapsed (only relevant for desktop)
   // TODO: This needs a proper state management solution for collapsible desktop sidebar if desired
   const isCollapsed = false; // Simplified for now, assumes always expanded on desktop

   return (
    <>
        {/* Logo/Title for Mobile Sheet */}
        {isMobile && (
             <div className="p-4 border-b">
                 <Link href="/admin" className="flex items-center gap-2 text-lg font-bold text-primary" onClick={closeSheet}>
                    <Image
                        src="https://picsum.photos/seed/logo/30/30" // Placeholder logo URL
                        alt="ChronoThreads Admin Logo"
                        width={30}
                        height={30}
                        className="h-7 w-7 rounded-full object-cover"
                        data-ai-hint="futuristic tech logo"
                        priority
                    />
                    ChronoThreads Admin
                </Link>
             </div>
        )}

        <nav className={cn(
            "flex flex-col gap-2 flex-grow",
            isMobile ? "p-4 text-lg" : "px-2 sm:py-5" // Different padding/text size for mobile
        )}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;

            const buttonContent = (
              <>
                 <Icon className={cn("flex-shrink-0", isMobile ? "h-5 w-5" : "h-5 w-5")} />
                 {!isCollapsed && <span className="truncate">{item.label}</span>}
              </>
            );

            const buttonClasses = cn(
              "w-full justify-start gap-3 transition-colors",
              isActive && "bg-primary text-primary-foreground hover:bg-primary/90",
              !isActive && "hover:bg-muted hover:text-foreground",
              // Desktop collapsed styles (if implemented)
              !isMobile && isCollapsed && "justify-center px-0 w-10 h-10",
              // Mobile styles
              isMobile && "rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            );

             if (isMobile) {
                return (
                   <SheetClose asChild key={item.href}>
                        <Link href={item.href}>
                             <Button
                                variant={isActive ? "default" : "ghost"}
                                className={buttonClasses}
                                aria-current={isActive ? 'page' : undefined}
                             >
                               {buttonContent}
                             </Button>
                         </Link>
                   </SheetClose>
                );
             }

            // Desktop rendering with Tooltips
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={buttonClasses}
                      aria-current={isActive ? 'page' : undefined}
                    >
                     {buttonContent}
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
           {/* Add separator and logout for mobile */}
           {isMobile && <Separator className="my-4" />}
        </nav>

        {/* Logout Button */}
        <div className={cn(
            "mt-auto border-t",
            isMobile ? "p-4" : "p-2" // Different padding for mobile
        )}>
            {isMobile ? (
                 <SheetClose asChild>
                     <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => console.log("Logout clicked")} // TODO: Add actual logout
                     >
                        <LogOut className="h-5 w-5 flex-shrink-0" />
                        <span className="truncate">Logout</span>
                     </Button>
                 </SheetClose>
            ) : (
                 <Tooltip>
                    <TooltipTrigger asChild>
                       <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start gap-3 transition-colors",
                            "hover:bg-destructive/80 hover:text-destructive-foreground",
                             isCollapsed && "justify-center px-0 w-10 h-10"
                          )}
                          onClick={() => console.log("Logout clicked")} // TODO: Add actual logout
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
            )}
        </div>
    </>
   );
};


export function AdminSidebar() {
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  // TODO: Implement proper state for desktop collapsed state if needed
  const isCollapsed = false; // Assuming always expanded on desktop for now

  if (isMobile) {
      return (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
             {/* Trigger is typically placed in the header/main layout */}
             {/* Placeholder Trigger (Move to AdminLayout or Header) */}
             {/*
             <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <PanelLeft className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            */}
             <SheetContent side="left" className="w-[280px] p-0 flex flex-col">
                {/* Add DialogTitle for accessibility */}
                <DialogTitle>
                    <VisuallyHidden>Admin Navigation Menu</VisuallyHidden>
                </DialogTitle>
                <SidebarNavContent closeSheet={() => setIsSheetOpen(false)} />
             </SheetContent>
          </Sheet>
      );
  }

  // Desktop Sidebar
  return (
    <TooltipProvider delayDuration={0}>
      <aside className={cn(
        "hidden md:flex h-screen flex-col border-r bg-secondary text-secondary-foreground transition-all duration-300 ease-in-out sticky top-0", // Use sticky top-0 and h-screen
        isCollapsed ? "w-14" : "w-64" // Adjust width based on collapsed state
      )}>
        <SidebarNavContent />
      </aside>
    </TooltipProvider>
  );
}

// Mobile trigger component to be used in the layout
export function AdminMobileSidebarTrigger() {
    const isMobile = useIsMobile();
    // This component only renders the trigger on mobile
    if (!isMobile) return null;

    return (
        <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:text-foreground">
                <PanelLeft className="h-6 w-6" />
                <span className="sr-only">Toggle Admin Menu</span>
            </Button>
        </SheetTrigger>
    );
}