'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import './globals.css';
// import Head from 'next/head';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="pt-br">
      <head>
        <title>SinuControl</title>
        <link rel="icon" href="/bola8.png" />
        <link rel="shortcut icon" href="/bola8.png" />
        <link rel="apple-touch-icon" href="/bola8.png" />
      </head>
      <body className={`flex bg-background text-foreground antialiased ${isLoginPage ? 'justify-center items-center' : ''}`}>
        {!isLoginPage && <Sidebar />}
        <main className={`${isLoginPage ? 'w-full' : 'flex-1 p-8 overflow-y-auto'}`}>
          {children}
        </main>
      </body>
    </html>
  );
}