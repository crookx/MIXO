import type { Metadata } from 'next';
import { GeistSans, GeistMono } from 'geist/font'; // Corrected import
import './globals.css';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';

// No changes needed for instantiation when using `geist` package directly
// const geistSans = GeistSans({ ... }); <-- No longer needed, variables are managed differently

export const metadata: Metadata = {
  title: 'ChronoThreads',
  description: 'Futuristic eCommerce for clothing',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", GeistSans.variable, GeistMono.variable)}>
      <body
        className={cn(
          'relative h-full font-sans antialiased',
          // Variables are applied in <html> tag now
        )}
      >
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="relative flex flex-col flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster /> {/* Add Toaster component here */}
      </body>
    </html>
  );
}
