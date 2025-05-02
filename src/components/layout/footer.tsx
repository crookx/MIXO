import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-auto py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">ChronoThreads</h3>
            <p className="text-sm text-muted-foreground">Futuristic fashion for the modern era.</p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/support" className="text-muted-foreground hover:text-foreground hover:text-accent transition-colors">Customer Service</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground hover:text-accent transition-colors">Privacy Policy</Link></li>
               <li><Link href="/terms" className="text-muted-foreground hover:text-foreground hover:text-accent transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-accent transition-opacity duration-300 opacity-70 hover:opacity-100">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-accent transition-opacity duration-300 opacity-70 hover:opacity-100">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-accent transition-opacity duration-300 opacity-70 hover:opacity-100">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
        <Separator className="my-6 bg-border" />
        <div className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ChronoThreads. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
