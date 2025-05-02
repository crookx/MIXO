import type { Metadata } from 'next';
// import { GeistSans } from 'geist/font/sans'; // Removed due to build errors
import './globals.css';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';


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
    // Remove GeistSans variable from html tag
    <html lang="en" className={cn("h-full")}>
      <body
        className={cn(
          'relative h-full font-sans antialiased',
          // GeistSans.className // Remove font class application
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
