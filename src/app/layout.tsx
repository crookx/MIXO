import type { Metadata } from 'next';
import { GeistSans as Geist, GeistMono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = GeistMono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

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
    <html lang="en" className="h-full">
      <body
        className={cn(
          'relative h-full font-sans antialiased',
          geistSans.variable,
          geistMono.variable
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
