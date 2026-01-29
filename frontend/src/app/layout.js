import Sidebar from '@/components/Sidebar';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className="flex bg-background text-foreground antialiased">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}