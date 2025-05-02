// src/app/admin/layout.tsx
'use client'; // Add 'use client' directive

import type { Metadata } from 'next';
import { AdminSidebar, AdminMobileSidebarTrigger } from '@/components/admin/admin-sidebar'; // Import trigger
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Sheet } from '@/components/ui/sheet'; // Import Sheet root for context

// Metadata should ideally be moved to a Server Component parent if possible,
// but for simplicity, we keep it here (though 'use client' might affect it)
// export const metadata: Metadata = {
//   title: 'ChronoThreads Admin',
//   description: 'Admin dashboard for ChronoThreads',
// };

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Wrap with Sheet for mobile sidebar context
    <Sheet>
      <div className="flex min-h-screen w-full bg-background">
        <AdminSidebar /> {/* Renders SheetContent on mobile, fixed sidebar on desktop */}
        <div className="flex flex-1 flex-col">
          {/* Optional Header for mobile trigger */}
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
              {/* Mobile Sidebar Trigger */}
              <AdminMobileSidebarTrigger />
              {/* Maybe add a Breadcrumb or Title here for mobile */}
          </header>
          <main className="flex flex-1 flex-col p-4 md:p-6 lg:p-8 overflow-auto">
            {children}
          </main>
        </div>
        <Toaster />
      </div>
    </Sheet>
  );
}
