// src/components/layout/header.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image'; // Import Image component
import { ShoppingCart, User, Menu, Shield } from 'lucide-react'; // Added Shield for Admin
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { DialogTitle } from '@/components/ui/dialog'; // Import DialogTitle
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'; // Import VisuallyHidden

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false); // State for mobile menu
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Close sheet if screen size changes from mobile to desktop
    if (!isMobile && isSheetOpen) {
      setIsSheetOpen(false);
    }
  }, [isMobile, isSheetOpen]);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/about', label: 'About' },
    { href: '/support', label: 'Support' },
    // Add Admin link conditionally based on auth state in a real app
    // For now, always show it for development
    { href: '/admin', label: 'Admin', icon: Shield, adminOnly: true }, // Added Admin link
  ];

  // In a real app, you'd get the user's role from auth context
  const isAdmin = true; // Placeholder: Assume user is admin for demo

  const filteredNavItems = navItems.filter(item => !item.adminOnly || isAdmin);
  const mobileNavItems = navItems.filter(item => !item.adminOnly || isAdmin); // Mobile might show admin differently or not

  return (
    <header
      className={cn(
        `sticky top-0 z-50 w-full border-b transition-all duration-300 ease-in-out`,
        isSticky ? 'bg-background/90 shadow-md backdrop-filter backdrop-blur-lg bg-opacity-80' : 'bg-background'
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 mr-6 transition-transform duration-300 hover:scale-105">
          {/* Logo Image */}
          <Image
            src="https://picsum.photos/seed/logo/40/40" // Placeholder logo URL, ensure square ratio
            alt="ChronoThreads Logo"
            width={40} // Adjust width for circular frame
            height={40} // Adjust height for circular frame
            className="h-10 w-10 rounded-full object-cover" // Add rounded-full, object-cover, adjust h/w
            data-ai-hint="futuristic tech logo"
            priority // Load logo early
          />
          {/* Optional: Keep text if needed */}
          <span className="text-2xl font-bold text-primary hidden sm:inline-block">
            ChronoThreads
          </span>
        </Link>

        {isMobile ? (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="btn-animated">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] bg-background p-6">
                 {/* Add DialogTitle for accessibility */}
                <DialogTitle>
                    <VisuallyHidden>Mobile Navigation Menu</VisuallyHidden>
                </DialogTitle>
              <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary mb-8" onClick={() => setIsSheetOpen(false)}>
                 <Image
                    src="https://picsum.photos/seed/logo/30/30" // Placeholder logo URL
                    alt="ChronoThreads Logo"
                    width={30}
                    height={30}
                    className="h-7 w-7 rounded-full object-cover" // Add rounded-full
                    data-ai-hint="futuristic tech logo"
                    priority
                  />
                  {/* Optional Text for Mobile Menu */}
                  ChronoThreads
              </Link>
              <nav className="grid gap-4 text-lg font-medium">
                {mobileNavItems.map((item) => (
                   <SheetClose asChild key={item.href}>
                       <Link
                           href={item.href}
                           className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                            item.adminOnly && "text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300" // Style admin link differently
                           )}
                       >
                           {item.icon && <item.icon className="h-5 w-5 inline-block mr-1" />} {/* Add icon if exists */}
                           {item.label}
                       </Link>
                   </SheetClose>
                ))}
                <Separator className="my-2" />
                 <SheetClose asChild>
                   <Link
                       href="/cart"
                       className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                   >
                       <ShoppingCart className="h-5 w-5 inline-block mr-3" />
                       Cart
                   </Link>
                 </SheetClose>
                  <SheetClose asChild>
                   <Link
                       href="/auth"
                       className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                   >
                       <User className="h-5 w-5 inline-block mr-3" />
                       Account
                   </Link>
                  </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-muted-foreground transition-colors hover:text-foreground hover:text-accent relative after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full",
                     item.adminOnly && "text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-semibold" // Style admin link differently
                   )}
                >
                   {item.icon && <item.icon className="h-4 w-4 inline-block mr-1 mb-0.5" />} {/* Add icon if exists */}
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Link href="/cart" aria-label="Shopping Cart">
                <Button variant="ghost" size="icon" className="relative btn-animated group">
                  <ShoppingCart className="h-5 w-5 text-primary transition-colors group-hover:text-accent" />
                  {/* Optional: Add cart item count badge here */}
                </Button>
              </Link>
              <Link href="/auth" aria-label="User Account">
                <Button variant="ghost" size="icon" className="btn-animated group">
                  <User className="h-5 w-5 text-primary transition-colors group-hover:text-accent" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
