'use client';

import Link from 'next/link';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
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

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    // Add more categories as needed
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ease-in-out ${
        isSticky ? 'bg-background/95 shadow-md backdrop-blur-sm' : 'bg-background'
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-2xl font-bold text-primary mr-6">
          ChronoThreads
        </Link>

        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
                 <Link
                    href="/cart"
                    className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Cart
                  </Link>
                  <Link
                    href="/auth"
                    className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <User className="h-5 w-5" />
                    Account
                  </Link>
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
                  className="text-muted-foreground transition-colors hover:text-foreground hover:text-accent"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/cart" aria-label="Shopping Cart">
                <Button variant="ghost" size="icon" className="relative btn-animated">
                  <ShoppingCart className="h-5 w-5 text-primary transition-colors hover:text-accent" />
                   {/* Optional: Add a badge for item count */}
                   {/* <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs text-accent-foreground">3</span> */}
                </Button>
              </Link>
              <Link href="/auth" aria-label="User Account">
                <Button variant="ghost" size="icon" className="btn-animated">
                  <User className="h-5 w-5 text-primary transition-colors hover:text-accent" />
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
