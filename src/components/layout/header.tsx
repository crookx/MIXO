'use client';

import Link from 'next/link';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator'; // Ensure Separator is imported

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
    { href: '/about', label: 'About' }, // Added About
    { href: '/support', label: 'Support' }, // Added Support
    // Add more categories as needed
  ];

  return (
    <header
      className={cn(
        `sticky top-0 z-50 w-full border-b transition-all duration-300 ease-in-out`,
        isSticky ? 'bg-background/90 shadow-md backdrop-filter backdrop-blur-lg bg-opacity-80' : 'bg-background' // Enhanced sticky effect with blur
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-2xl font-bold text-primary mr-6 transition-transform duration-300 hover:scale-105">
          ChronoThreads
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
              <Link href="/" className="text-2xl font-bold text-primary mb-8 block" onClick={() => setIsSheetOpen(false)}>
                ChronoThreads
              </Link>
              <nav className="grid gap-4 text-lg font-medium">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setIsSheetOpen(false)} // Ensure menu closes on click
                    >
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
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground transition-colors hover:text-foreground hover:text-accent relative after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Link href="/cart" aria-label="Shopping Cart">
                <Button variant="ghost" size="icon" className="relative btn-animated group">
                  <ShoppingCart className="h-5 w-5 text-primary transition-colors group-hover:text-accent" />
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
