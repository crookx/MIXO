// src/app/admin/layout.tsx
import type { Metadata } from 'next';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
// import { SidebarProvider } from '@/components/ui/sidebar'; // Import if using the provided Sidebar component

export const metadata: Metadata = {
  title: 'ChronoThreads Admin',
  description: 'Admin dashboard for ChronoThreads',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Wrap with SidebarProvider if using that component structure
    // <SidebarProvider defaultOpen={true}>
    <div className="flex min-h-screen w-full bg-background">
      <AdminSidebar />
      <main className="flex flex-1 flex-col p-4 md:p-6 lg:p-8 overflow-auto">
        {/* TODO: Add Admin Header component here if needed */}
        {/* <AdminHeader /> */}
        {children}
      </main>
      <Toaster />
    </div>
    // </SidebarProvider>
  );
}
