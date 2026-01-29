'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import './globals.css';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="pt-br">
      <body className={`flex bg-background text-foreground antialiased ${isLoginPage ? 'justify-center items-center' : ''}`}>
        {!isLoginPage && <Sidebar />}
        <main className={`${isLoginPage ? 'w-full' : 'flex-1 p-8 overflow-y-auto'}`}>
          {children}
        </main>
      </body>
    </html>
  );
}